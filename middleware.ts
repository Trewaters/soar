import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // '/flows/:path*',
    '/navigator/asanaPoses/createAsana/:path*',
    // '/navigator/asanaPoses/:path*',
    // '/api/:path*', // API routes
  ],
}

export default function middleware(request: NextRequest) {
  // Access session data
  // const session = request.cookies.get('authjs.session-token') // the session cookie name
  const response = NextResponse.next()

  // Prevent MIME sniffing - this is safe to always apply
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Prevent caching for sensitive API operations
  if (request.nextUrl.pathname.includes('/api/')) {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, private'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  if (process.env.NODE_ENV !== 'production') {
    return response
  }

  if (!request.nextUrl.pathname.startsWith('/protected')) {
    return response
  }
  return NextResponse.redirect(new URL('/auth/signin', request.url), 401)
}
