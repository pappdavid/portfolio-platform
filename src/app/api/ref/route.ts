import { auth } from '@clerk/nextjs/server';
import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { company, notes } = body as { company?: string; notes?: string };

  if (!company) {
    return NextResponse.json({ error: 'company is required' }, { status: 400 });
  }

  const secret = process.env.MCP_HMAC_SECRET || 'dev-secret';
  const token = createHmac('sha256', secret)
    .update(`${company}:${Date.now()}`)
    .digest('hex')
    .slice(0, 16);

  const { data, error } = await supabaseAdmin
    .from('ref_links')
    .insert({ token, company, notes: notes || null, user_id: userId })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.json({
    id: data.id,
    token: data.token,
    url: `${baseUrl}/r/${data.token}`,
    company: data.company,
    created_at: data.created_at
  });
}
