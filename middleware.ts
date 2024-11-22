import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // '/flows/:path*',
    '/navigator/asanaPostures/createAsana/:path*',
    // '/navigator/asanaPostures/:path*',
    // '/api/:path*', // API routes
  ],
}

export default function middleware(request: NextRequest) {
  console.log('Middleware url:', request.url)
  console.log('Middleware request:', request)

  // Access session data
  // const session = request.cookies.get('authjs.session-token') // the session cookie name
  // console.log('Middleware session-token:', session)

  const response = NextResponse.next()

  // Disable caching
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('Surrogate-Control', 'no-store')

  if (process.env.NODE_ENV !== 'production') {
    return response
  }

  // if (!request.nextUrl.pathname.startsWith('/protected')) {
  //   return response;
  // }

  return NextResponse.redirect(new URL('/auth/signin', request.url), 401)
}
