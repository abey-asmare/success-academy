import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { MAX_ALLOWED_DEVICES } from './app/constants'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/api/uploadthing", '/api/webhook(.*)', '/'])


const isAdminRoute = createRouteMatcher(['/admin(.*)'])



//  _Session {
//   id: 'sess_30bc4FaLXL1g3nOmLcTKPmVgt60',
//   clientId: 'client_30TS6jGhjcCsjHG2MjGgPpz39cI',
//   userId: 'user_30bUwBefgF31zbXmBmqik5fkEkp',
//   status: 'active',
//   lastActiveAt: 1753899519047,
//   expireAt: 1754504319047,
//   abandonAt: 1756491519047,
//   createdAt: 1753899519047,
//   updatedAt: 1753899519118,
//   lastActiveOrganizationId: undefined,
//   latestActivity: _SessionActivity {
//   id: 'sess_activity_30bc2vEL0uGE8k7xPmiEFQkUWUu',
//   isMobile: false,
//   ipAddress: '196.188.252.134',
//   city: 'Addis Ababa',
//   country: 'ET',
//   browserVersion: '138.0.0.0',
//   browserName: 'Edge',
//   deviceType: 'Windows'
// },
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

  
// Max one session per device type (mobile & desktop)
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