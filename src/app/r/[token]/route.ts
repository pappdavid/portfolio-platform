import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data: link } = await supabaseAdmin
    .from('ref_links')
    .select('id')
    .eq('token', token)
    .single();

  if (!link) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const forwarded = req.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || '';
  const ipTrunc = ip.includes('.')
    ? ip.split('.').slice(0, 3).join('.') + '.0'
    : ip;

  await supabaseAdmin.from('ref_events').insert({
    link_id: link.id,
    event_type: 'visit',
    user_agent: req.headers.get('user-agent') || null,
    ip_trunc: ipTrunc || null,
    country: req.headers.get('x-vercel-ip-country') || null
  });

  return NextResponse.redirect(new URL('/', req.url));
}
