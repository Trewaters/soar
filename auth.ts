import NextAuth from 'next-auth'

import type { NextAuthConfig } from 'next-auth'
// import { type Adapter } from '@auth/core/adapters'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import { PrismaClient } from '@prisma/generated/client'
import authConfig from '@auth.config'

// const prisma = new PrismaClient()

// const MyAdapter: Adapter = {
// ...PrismaAdapter(prisma),
// Add your custom methods here
// }

const config = {
  theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
  // adapter: PrismaAdapter(prisma),
  // adapter: MyAdapter,
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
  },
  ...authConfig,
  session: { strategy: 'jwt' },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== 'production' ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
