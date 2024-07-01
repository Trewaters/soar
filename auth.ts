import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { type Adapter } from '@auth/core/adapters'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import authConfig from '@auth.config'
import clientPromise from '@lib/db'

/*  
Resource Links:

- https://authjs.dev/getting-started/adapters/prisma
- https://www.prisma.io/docs/orm/overview/databases/mongodb
- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-typescript-mongodb
- https://authjs.dev/getting-started/adapters/mongodb
- https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
- https://authjs.dev/reference/core/adapters#adapter
- https://authjs.dev/reference/nextjs/jwt
- https://authjs.dev/reference/mongodb-adapter

* example app using mongodb adapter:
- https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
- https://authjs.dev/getting-started/adapters/mongodb (this worked! 2024-06-30 20:36:59)
*/

const MyAdapter: Adapter = {
  ...MongoDBAdapter(clientPromise),
}

const config = {
  theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
  adapter: MyAdapter,
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
