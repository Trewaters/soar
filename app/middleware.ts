export { auth as middleware } from '@/auth'
import authConfig from '@auth.config'
import NextAuth from 'next-auth'
import { NextRequest } from 'next/server'

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
})
