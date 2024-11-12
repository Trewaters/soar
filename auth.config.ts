import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/generated/client'
import { type Adapter } from '@auth/core/adapters'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@lib/db'
import { hashPassword } from '@app/utils/password'
import Credentials from 'next-auth/providers/credentials'

const prisma = new PrismaClient()

const MyAdapter: Adapter = {
  ...MongoDBAdapter(clientPromise),
}

export default {
  providers: [
    GitHub,
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // logic to salt and hash password
        // const pwHash = hashPassword(credentials.password as string)

        const email = credentials.email as string

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash)

        const existingUser = await prisma.userData.findUnique({
          where: { email: email ?? undefined },
        })

        // if (!existingUser) {
        //   try {
        //     const newUser = await prisma.userData.create({
        //       data: {
        //         provider_id: user.id,
        //         name: user.name,
        //         email: user.email,
        //         emailVerified: new Date(),
        //         image: user.image,
        //         pronouns: '',
        //         profile: JSON.stringify(profile),
        //         createdAt: new Date(),
        //         updatedAt: new Date(),
        //         firstName: '',
        //         lastName: '',
        //         bio: '',
        //         headline: '',
        //         location: '',
        //         websiteURL: '',
        //         shareQuick: '',
        //         yogaStyle: '',
        //         yogaExperience: '',
        //         company: '',
        //         socialURL: '',
        //         isLocationPublic: '',
        //         providerAccounts: {
        //           create: {
        //             provider: account.provider,
        //             providerAccountId: account.providerAccountId,
        //             refresh_token: account.refresh_token ?? undefined,
        //             access_token: account.access_token ?? undefined,
        //             expires_at: account.expires_at ?? undefined,
        //             // add to schema
        //             // expires_in: account.expires_in ?? undefined,
        //             token_type: account.token_type ?? undefined,
        //             scope: account.scope ?? undefined,
        //             id_token: account.id_token ?? undefined,
        //             session_state: JSON.stringify(account.session_state),
        //             type: account.type,
        //             createdAt: new Date(),
        //             updatedAt: new Date(),
        //           },
        //         },
        //         // create a way to add generic profile schema for unknown providers
        //         // profile: {
        //         //   create: { ...profile },
        //         // },
        //       },
        //     })
        //   } catch (error) {
        //     console.error('Error creating new user:', error)
        //     throw error
        //   }
        // }

        if (!existingUser) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error('Invalid credentials.')
        }
        /*         if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error('Invalid credentials.')
        } */

        // return user object with their profile data
        // return user
        return existingUser
      },
    }),
  ],
  theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
  adapter: MyAdapter,
  basePath: '/auth',
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('signIn user', user)
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
              shareQuick: '',
              yogaStyle: '',
              yogaExperience: '',
              company: '',
              socialURL: '',
              isLocationPublic: '',
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
        } catch (error) {
          console.error('Error creating new user:', error)
          throw error
        }
      }
      return true
    },
    async session({ session, token }) {
      console.log('session token', token)
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({ token, trigger, session, account }) {
      console.log('jwt token', token)
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
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  events: {
    signIn: async (message) => {
      console.log('signIn', message)
    },
    signOut: async (message) => {
      console.log('signOut', message)
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== 'production' ? true : false,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
} satisfies NextAuthConfig

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/getting-started/providers/twitter
 */
