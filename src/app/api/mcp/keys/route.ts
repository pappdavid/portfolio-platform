import { auth } from '@clerk/nextjs/server';
import { createHash, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { demoApiKeys } from '@/constants/demo-data';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const name = (body.name as string) || 'Untitled Key';

  const plainKey = `sk-mcp-${randomBytes(24).toString('hex')}`;
  const keyHash = createHash('sha256').update(plainKey).digest('hex');
  const keyPrefix = plainKey.slice(0, 12);

  const { data, error } = await supabaseAdmin
    .from('mcp_api_keys')
    .insert({ user_id: userId, key_hash: keyHash, key_prefix: keyPrefix, name })
    .select('id, key_prefix, name, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...data,
    key: plainKey,
    note: 'Save this key securely. It will not be shown again.'
  });
}

export async function GET(req: NextRequest) {
  // Demo mode: return seeded fake keys (read-only)
  const isDemoMode = req.cookies.get('demo_mode')?.value === 'true';
  if (isDemoMode) {
    return NextResponse.json({ keys: demoApiKeys });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('mcp_api_keys')
    .select('id, key_prefix, name, revoked_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ keys: data });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const keyId = searchParams.get('id');
  if (!keyId) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('mcp_api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', keyId)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ revoked: true });
}
