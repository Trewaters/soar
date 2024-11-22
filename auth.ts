import NextAuth from '@node_modules/next-auth'
import type { Provider } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/generated/client'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@lib/mongoDb'
import { hashPassword } from '@app/utils/password'

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/getting-started/providers/twitter
 */

const prisma = new PrismaClient()

const providers: Provider[] = [
  GitHub,
  Google,
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: {},
      password: {},
    },
    // authorize: async (credentials) => {
    //   // logic to salt and hash password
    //   // const pwHash = hashPassword(credentials.password as string)

    //   const email = credentials.email as string

    //   // logic to verify if the user exists
    //   // user = await getUserFromDb(credentials.email, pwHash)

    //   const existingUser = await prisma.userData.findUnique({
    //     where: { email: email ?? undefined },
    //   })

    //   // if (!existingUser) {
    //   //   try {
    //   //     const newUser = await prisma.userData.create({
    //   //       data: {
    //   //         provider_id: user.id,
    //   //         name: user.name,
    //   //         email: user.email,
    //   //         emailVerified: new Date(),
    //   //         image: user.image,
    //   //         pronouns: '',
    //   //         profile: JSON.stringify(profile),
    //   //         createdAt: new Date(),
    //   //         updatedAt: new Date(),
    //   //         firstName: '',
    //   //         lastName: '',
    //   //         bio: '',
    //   //         headline: '',
    //   //         location: '',
    //   //         websiteURL: '',
    //   //         shareQuick: '',
    //   //         yogaStyle: '',
    //   //         yogaExperience: '',
    //   //         company: '',
    //   //         socialURL: '',
    //   //         isLocationPublic: '',
    //   //         providerAccounts: {
    //   //           create: {
    //   //             provider: account.provider,
    //   //             providerAccountId: account.providerAccountId,
    //   //             refresh_token: account.refresh_token ?? undefined,
    //   //             access_token: account.access_token ?? undefined,
    //   //             expires_at: account.expires_at ?? undefined,
    //   //             // add to schema
    //   //             // expires_in: account.expires_in ?? undefined,
    //   //             token_type: account.token_type ?? undefined,
    //   //             scope: account.scope ?? undefined,
    //   //             id_token: account.id_token ?? undefined,
    //   //             session_state: JSON.stringify(account.session_state),
    //   //             type: account.type,
    //   //             createdAt: new Date(),
    //   //             updatedAt: new Date(),
    //   //           },
    //   //         },
    //   //         // create a way to add generic profile schema for unknown providers
    //   //         // profile: {
    //   //         //   create: { ...profile },
    //   //         // },
    //   //       },
    //   //     })
    //   //   } catch (error) {
    //   //     console.error('Error creating new user:', error)
    //   //     throw error
    //   //   }
    //   // }

    //   //     if (!existingUser) {
    //   // No user found, so this is their first attempt to login
    //   // Optionally, this is also the place you could do a user registration
    //   //       throw new Error('Invalid credentials.')
    //   //     }
    //   //     /*         if (!user) {
    //   // No user found, so this is their first attempt to login
    //   // Optionally, this is also the place you could do a user registration
    //   //       throw new Error('Invalid credentials.')
    //   //     } */

    //   // return user object with their profile data
    //   // return user
    //   //     return existingUser
    // },
  }),
]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== 'credentials')

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
  adapter: MongoDBAdapter(client),
  basePath: '/api/auth',
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any
      account: any
      profile?: any
    }) {
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
    async session({ session, token }: { session: any; token: any }) {
      console.log('session token', token)
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({
      token,
      trigger,
      session,
      account,
    }: {
      token: any
      trigger?: 'signIn' | 'signUp' | 'update'
      session?: any
      account?: any
    }) {
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Ensure the redirect is to a valid location
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith('/')) return `${baseUrl}${url}`
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  events: {
    signIn: async (message: any) => {
      console.log('signIn', message)
    },
    signOut: async (message: any) => {
      console.log('signOut', message)
      await prisma.$disconnect()
    },
  },
  // experimental: {
  //   enableWebAuthn: true,
  // },
  debug: process.env.NODE_ENV !== 'production' ? true : false,
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    signOut: '/auth/signout', // Custom sign-out page
    /*  
    error: "/auth/error", // Error page
    verifyRequest: "/auth/verify-request", // Verification request (email login)
    newUser: "/auth/new-user", // New users (optional)
    */
  },
})
