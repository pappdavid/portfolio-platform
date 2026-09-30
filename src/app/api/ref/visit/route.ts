import { createHash, randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { refVisitRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin)
    return NextResponse.json(
      { error: 'Same-origin request required' },
      { status: 403 }
    );
  const { success } = await refVisitRateLimit.limit(
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  );
  if (!success)
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (
    body.action === 'count' &&
    body.consent === true &&
    /^[a-f0-9]{16}$/.test(body.token || '')
  ) {
    const receipt = randomUUID();
    const { data, error } = await supabaseAdmin.rpc(
      'count_referral_with_consent',
      {
        p_token: body.token,
        p_receipt_hash: createHash('sha256').update(receipt).digest('hex')
      }
    );
    if (error || !data)
      return NextResponse.json(
        { error: 'Counting unavailable' },
        { status: 503 }
      );
    return NextResponse.json({ counted: true, receipt });
  }
  if (
    body.action === 'withdraw' &&
    /^[a-f0-9-]{36}$/.test(body.receipt || '')
  ) {
    const { data, error } = await supabaseAdmin.rpc('withdraw_referral_count', {
      p_receipt_hash: createHash('sha256').update(body.receipt).digest('hex')
    });
    if (error || !data)
      return NextResponse.json(
        { error: 'Withdrawal unavailable' },
        { status: 409 }
      );
    return NextResponse.json({ withdrawn: true });
  }
  return NextResponse.json(
    { error: 'Explicit counting consent or valid withdrawal required' },
    { status: 400 }
  );
}
