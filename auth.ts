import NextAuth from 'next-auth'
import type { Provider } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from './prisma/generated/client'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@lib/mongoDb'
import { comparePassword, hashPassword } from '@app/utils/password'

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/getting-started/providers/twitter
 */

const prisma = new PrismaClient()

const providers: Provider[] = [
  GitHub,
  Google,
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      if (!credentials) return null

      let user = await prisma.userData.findUnique({
        where: { email: credentials.email as string },
      })

      if (credentials.password === 'new account' && !user) {
        user = await prisma.userData.create({
          data: {
            email: credentials.email as string,
            name:
              typeof credentials.email === 'string' ? credentials.email : '',
            createdAt: new Date(),
            updatedAt: new Date(),
            firstName: 'New Account',
            lastName: 'New Account',
            bio: '',
            headline: '',
            location: '',
            websiteURL: '',
          },
        })
      }

      if (!user) return null

      let providerAccount = await prisma.providerAccount.findUnique({
        where: { userId: user.id },
      })

      if (!providerAccount) {
        providerAccount = await prisma.providerAccount.create({
          data: {
            userId: user.id,
            provider: 'credentials',
            providerAccountId: user.id,
            type: 'credentials',
            credentials_password:
              typeof credentials.password === 'string'
                ? await hashPassword(credentials.password)
                : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      }

      if (!providerAccount.credentials_password) return null

      const isValidPassword = await comparePassword(
        credentials.password as string,
        providerAccount.credentials_password
      )

      if (!isValidPassword) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    },
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

const authConfig = {
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
              role: 'user',
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
          console.log('newUser', newUser)
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

      // Set user ID from database if not already set
      if (!token.id && token.email) {
        const user = await prisma.userData.findUnique({
          where: { email: token.email as string },
        })
        if (user) {
          token.id = user.id
        }
      }

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
    signIn: async ({ user, account }: { user: any; account: any }) => {
      console.log('signIn event triggered for user:', user?.email)

      // Record login event for streak tracking
      if (user?.id) {
        try {
          // Get request headers for IP and User Agent (if available in server context)
          const loginRecord = {
            userId: user.id,
            loginDate: new Date(),
            provider: account?.provider || 'unknown',
            // In a full implementation, you'd capture these from the request
            ipAddress: null as string | null,
            userAgent: null as string | null,
          }

          await prisma.userLogin.create({
            data: loginRecord,
          })

          // Also update the user's lastLogin timestamp in the session
          await prisma.userData.update({
            where: { id: user.id },
            data: { updatedAt: new Date() },
          })

          console.log('Login event recorded successfully for user:', user.email)
        } catch (error) {
          console.error('Error recording login event:', error)
          // Don't throw here as we don't want to break the login process
        }
      }
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
}

// @ts-expect-error - NextAuth v5 beta type resolution issue
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig)
