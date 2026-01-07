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
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  if (!request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/auth/signin', request.url), 401)
}
