import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { resolveProofReferral } from '@/features/application-proofs/referral';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  let valid = false;
  let proofPath: string | null = null;
  if (/^[a-f0-9]{16}$/.test(token)) {
    const { data } = await supabaseAdmin
      .from('ref_links')
      .select('id, company, notes')
      .eq('token', token)
      .maybeSingle();
    valid = Boolean(data);
    if (data) proofPath = resolveProofReferral(data.company, data.notes);
  }
  const target = new URL(proofPath || '/', req.url);
  if (valid && !proofPath) target.searchParams.set('ref', token);
  const response = NextResponse.redirect(target);
  response.cookies.delete('dp_ref');
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
