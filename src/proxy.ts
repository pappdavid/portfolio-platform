import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

const clerkEnabled = !!process.env.CLERK_SECRET_KEY;

// When the Clerk secret key is absent, export a pass-through middleware so
// clerkMiddleware never runs (avoids the keyless "claim your application"
// behavior). Adding the key re-enables route protection automatically.
const handler = clerkEnabled
  ? clerkMiddleware(async (auth, req: NextRequest) => {
      if (isProtectedRoute(req)) await auth.protect();
    })
  : function middleware() {};

export default handler;
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
