import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { type Adapter } from '@auth/core/adapters'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import authConfig from '@auth.config'
import clientPromise from '@lib/db'
import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

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
    async signIn({ user, account, profile }) {
      const email = user.email

      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email ?? undefined },
      })
      console.log('existingUser:', existingUser)
      console.log('account:', account)

      if (!existingUser && account) {
        // Create a new user
        // await prisma.user.create({
        //   data: {
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //   },
        // })
        try {
          const newUser = await prisma.user.create({
            data: {
              provider_id: user.id,
              name: user.name,
              email: user.email,
              image: user.id,
              profile: JSON.stringify(profile),
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token ?? undefined,
                  access_token: account.access_token ?? undefined,
                  expires_at: account.expires_at ?? undefined,
                  token_type: account.token_type ?? undefined,
                  scope: account.scope ?? undefined,
                  id_token: account.id_token ?? undefined,
                  session_state: JSON.stringify(account.session_state),
                  type: account.type,
                },
              },
            },
          })
          console.log('New user created:', newUser)
        } catch (error) {
          console.error('Error creating new user:', error)
          throw error
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    jwt({ token, trigger, session, account, user }) {
      if (trigger === 'update') token.name = session.user.name
      if (account?.provider === 'google') {
        return { ...token, accessToken: account.access_token }
      }
      if (account?.provider === 'github') {
        return { ...token, accessToken: account.access_token }
      }
      if (user) {
        token.id = user.id
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

export const { auth, handlers, signIn, signOut } = NextAuth(config)
