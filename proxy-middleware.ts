
import { NextRequest, NextResponse } from 'next/server'

export default function proxyMiddleware(req: NextRequest) {
  if (req.nextUrl.pathname.match('__clerk')) {
    const proxyHeaders = new Headers(req.headers)
    proxyHeaders.set('Clerk-Proxy-Url', process.env.NEXT_PUBLIC_CLERK_PROXY_URL || '')
    proxyHeaders.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')

    // Manually get IP address from headers
    // const forwardedFor = req.headers.get('x-forwarded-for') || ''
    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || ''
    proxyHeaders.set('X-Forwarded-For', forwardedFor)

    const proxyUrl = new URL(req.url)
    proxyUrl.host = 'frontend-api.clerk.dev'
    proxyUrl.port = '443'
    proxyUrl.protocol = 'https'
    proxyUrl.pathname = proxyUrl.pathname.replace('/__clerk', '')

    return NextResponse.rewrite(proxyUrl, {
      request: {
        headers: proxyHeaders,
      },
    })
  }

  return NextResponse.next()
}
