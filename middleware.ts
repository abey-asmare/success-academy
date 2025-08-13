import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public and admin routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing',
  '/',
  '/api/courses(.*)',
  '/telegram-bot(.*)',
  '/privacy-policy(.*)',
  '/terms-of-use(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/dashboard/teacher(.*)']);

// Max one session per device type
const MAX_SESSIONS_PER_DEVICE_TYPE = 1;

export default clerkMiddleware(async (auth, req) => {
  try {
    const authData = await auth();
    const { userId, sessionId } = authData;

    // 1️⃣ Protect non-public routes
    if (!isPublicRoute(req)) {
      await auth.protect(); // will throw if unauthorized
    }

    // 2️⃣ Admin-only routes
    if (isAdminRoute(req) && authData.sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 3️⃣ Session limiting logic
    if (userId && sessionId) {
      const client = clerkClient; // DO NOT await clerkClient()
      const sessions = await client.sessions.getSessionList({ userId, status: 'active' });
      const currentSession = sessions.data.find((s) => s.id === sessionId);

      if (currentSession) {
        const isMobile = currentSession.latestActivity?.isMobile ?? false;
        const sameTypeSessions = sessions.data.filter(
          (s) => s.id !== sessionId && (s.latestActivity?.isMobile ?? false) === isMobile
        );

        // If too many sessions of the same type, revoke oldest ones
        if (sameTypeSessions.length >= MAX_SESSIONS_PER_DEVICE_TYPE) {
          // Sort by last activity so we revoke oldest sessions first
          const sorted = sameTypeSessions.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          await Promise.allSettled(
            sorted.map((s) => client.sessions.revokeSession(s.id))
          );
        }
      }
    }

    return NextResponse.next(); // continue request
  } catch (err) {
    console.error('Middleware error:', err);
    // On error, either redirect to login or continue
    return NextResponse.next();
  }
});

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    '/',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
