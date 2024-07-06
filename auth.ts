import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import authConfig from '@auth.config'

/*  
Resource Links:

- https://www.prisma.io/docs/orm/overview/databases/mongodb
- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-typescript-mongodb
- https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
- https://authjs.dev/reference/core/adapters#adapter
- https://authjs.dev/reference/nextjs/jwt
- https://authjs.dev/reference/mongodb-adapter

* example app using mongodb adapter:
- https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
- https://authjs.dev/getting-started/adapters/mongodb (this worked! 2024-06-30 20:36:59)
*/

const config = {
  ...authConfig,
  theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
  basePath: '/auth',
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === '/') return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === 'update') token.name = session.user.name
      if (account?.provider === 'google') {
        return { ...token, accessToken: account.access_token }
      }
      if (account?.provider === 'github') {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    // async signIn({ user, account, profile }) {
    //   const email = user.email

    //   // Check if the user already exists
    //   const existingUser = await prisma.user.findUnique({
    //     where: { email },
    //   })

    //   if (!existingUser) {
    //     // Create a new user
    //     await prisma.user.create({
    //       data: {
    //         email: user.email,
    //         name: user.name,
    //         image: user.image,
    //         accounts: {
    //           create: {
    //             provider: account.provider,
    //             providerAccountId: account.providerAccountId,
    //             refresh_token: account.refresh_token,
    //             access_token: account.access_token,
    //             expires_at: account.expires_at,
    //             token_type: account.token_type,
    //             scope: account.scope,
    //             id_token: account.id_token,
    //             session_state: account.session_state,
    //           },
    //         },
    //       },
    //     })
    //   }
    //   return true
    // },
    // async session({ session, token }) {
    //   if (token) {
    //     session.user.id = token.id
    //   }
    //   return session
    // },
  },
  // secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== 'production' ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
