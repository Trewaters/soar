import NextAuth from 'next-auth'
import 'next-auth/jwt'
import type { NextAuthConfig } from 'next-auth'
import { type Adapter } from '@auth/core/adapters'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import authConfig from '@auth.config'
import clientPromise from '@lib/db'
import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

const MyAdapter: Adapter = {
  ...MongoDBAdapter(clientPromise),
}

const config = {
  ...authConfig,
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

      const existingUser = await prisma.userData.findUnique({
        where: { email: email ?? undefined },
      })

      if (!existingUser && account) {
        try {
          const newUser = await prisma.userData.create({
            data: {
              provider_id: user.id,
              name: user.name,
              email: user.email,
              emailVerified: new Date(),
              image: user.image,
              pronouns: '',
              profile: JSON.stringify(profile),
              createdAt: new Date(),
              updatedAt: new Date(),
              firstName: '',
              lastName: '',
              bio: '',
              headline: '',
              location: '',
              websiteURL: '',
              providerAccounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token ?? undefined,
                  access_token: account.access_token ?? undefined,
                  expires_at: account.expires_at ?? undefined,
                  // add to schema
                  // expires_in: account.expires_in ?? undefined,
                  token_type: account.token_type ?? undefined,
                  scope: account.scope ?? undefined,
                  id_token: account.id_token ?? undefined,
                  session_state: JSON.stringify(account.session_state),
                  type: account.type,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
              // create a way to add generic profile schema for unknown providers
              // profile: {
              //   create: { ...profile },
              // },
            },
          })
          // console.log('New user created:', newUser)
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
  // secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== 'production' ? true : false,
} satisfies NextAuthConfig

export const { auth, handlers, signIn, signOut } = NextAuth(config)
