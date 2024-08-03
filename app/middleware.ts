export { auth as middleware } from '@/auth'
import authConfig from '@auth.config'
import NextAuth from 'next-auth'

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

const { auth } = NextAuth(authConfig)
export default auth(async function middleware() {
  // Your custom middleware logic goes here
})

/*  */
// export { auth as middleware } from '@/auth'
// import Auth, { type AuthConfig } from '@auth/core'

// import { NextRequest } from 'next/server'

// // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

// const { auth } = NextAuth(authConfig)
// export default auth(async function middleware(req: NextRequest) {
//   // Your custom middleware logic goes here
// })
