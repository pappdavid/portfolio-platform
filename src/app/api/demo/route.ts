import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/demo?action=enter  → sets demo_mode cookie, redirects to /dashboard/overview
 * GET /api/demo?action=exit   → clears demo_mode cookie, redirects to /
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? 'enter';

  if (action === 'exit') {
    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.set('demo_mode', '', {
      maxAge: 0,
      path: '/'
    });
    return response;
  }

  const response = NextResponse.redirect(
    new URL('/dashboard/overview', req.url)
  );
  response.cookies.set('demo_mode', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/'
  });
  return response;
}
