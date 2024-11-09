import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/flows/:path*',
    '/api/:path*', // API routes
  ],
}

export default function middleware(request: NextRequest) {
  console.log('Middleware url:', request.url)
  console.log('Middleware request:', request)

  // Access session data
  const session = request.cookies.get('authjs.session-token') // the session cookie name
  console.log('Session:', session)

  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  if (!request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/login', request.url), 401)
}