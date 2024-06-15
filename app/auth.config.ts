import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/SignInForm',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Check if the user is authenticated
      const isLoggedIn = !!auth?.user
      // Initialize protected routes
      // Here, all routes except the login page is protected
      const isOnProtected = !nextUrl.pathname.startsWith('/SignInForm')

      if (isOnProtected) {
        if (isLoggedIn) return true
        // redirect to /login
        return false
      } else if (isLoggedIn) {
        // redirected to homepage
        return Response.redirect(new URL('/', nextUrl))
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
