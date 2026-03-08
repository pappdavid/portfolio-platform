import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { mcpRateLimit } from '@/lib/rate-limit';
import { handleMcpRequest } from '@/lib/mcp/server';

async function authenticateApiKey(
  authHeader: string | null
): Promise<{ userId: string } | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;

  const key = authHeader.slice(7);
  const keyHash = createHash('sha256').update(key).digest('hex');

  const { data } = await supabaseAdmin
    .from('mcp_api_keys')
    .select('user_id, revoked_at')
    .eq('key_hash', keyHash)
    .single();

  if (!data || data.revoked_at) return null;
  return { userId: data.user_id };
}

export async function POST(req: Request) {
  const authResult = await authenticateApiKey(req.headers.get('authorization'));

  if (!authResult) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32001, message: 'Invalid or revoked API key' }
      },
      { status: 401 }
    );
  }

  const { success } = await mcpRateLimit.limit(authResult.userId);
  if (!success) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32002, message: 'Rate limit exceeded' }
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const response = await handleMcpRequest(body, authResult.userId);
  return NextResponse.json(response);
}
