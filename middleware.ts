import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/api/uploadthing", '/', '/api/courses(.*)', '/dashbaord-temp'])

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/dashboard/teacher(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth()
  const { userId, sessionId } = authData

  // 1. Route protection
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // 2. Admin-only protection
  if (isAdminRoute(req) && authData.sessionClaims?.metadata?.role !== "admin") {
    const url = new URL("/", req.url)
    return NextResponse.redirect(url)
  }
  const client = await clerkClient()

  // 3. Limit user to 2 active sessions
  // if (userId && sessionId) {
  //   const sessions = await client.sessions.getSessionList({userId, status: "active"})

  //   if (sessions.totalCount > MAX_ALLOWED_DEVICES) {
  //     await Promise.all(
  //       sessions.data.filter((session) => session.id !== sessionId).map((session) => client.sessions.revokeSession(session.id))
  //     )
  //     const redirectUrl = new URL("/too-many-devices", req.url)
  //     return NextResponse.redirect(redirectUrl)
  //   }
  // }

  
// Max one session per device type (mobile & desktop), too strict
if (userId && sessionId) {
  try {
    const sessions = await client.sessions.getSessionList({ userId, status: "active" })
    const currentSession = sessions.data.find((s) => s.id === sessionId)

    if (!currentSession) return NextResponse.next()

    const isMobile = currentSession.latestActivity?.isMobile
    const sameTypeSessions = sessions.data.filter(
      (s) => s.id !== sessionId && s.latestActivity?.isMobile === isMobile
    )

    if (sameTypeSessions.length >= 1) {
      await client.sessions.revokeSession(sessionId)
      
      // this triggers all the users from the account to log out
      // await Promise.all(
      //   sessions.data.filter((session) => session.id !== sessionId).map((session) => client.sessions.revokeSession(session.id))
      // )
      return NextResponse.redirect(new URL("/too-many-devices", req.url))
    }

  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.next()
  }
}

})



export const config = {
  matcher: [
    '/', 
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}