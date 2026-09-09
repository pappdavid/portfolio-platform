import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { REFERRAL_COOKIE } from '@/lib/referral-personalization';
import { refVisitRateLimit } from '@/lib/rate-limit';
import { purgeExpiredRefEvents } from '@/lib/ref-events-retention';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const visitIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const { success: visitAllowed } = await refVisitRateLimit.limit(visitIp);
  if (!visitAllowed) {
    return NextResponse.redirect(new URL('/', req.url));
  }

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

  purgeExpiredRefEvents().catch(() => {
    // retention purge is best-effort; never block a visit
  });

  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set(REFERRAL_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
