import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  let valid = false;
  if (/^[a-f0-9]{16}$/.test(token)) {
    const { data } = await supabaseAdmin
      .from('ref_links')
      .select('id')
      .eq('token', token)
      .maybeSingle();
    valid = Boolean(data);
  }
  const target = new URL('/', req.url);
  if (valid) target.searchParams.set('ref', token);
  const response = NextResponse.redirect(target);
  response.cookies.delete('dp_ref');
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
