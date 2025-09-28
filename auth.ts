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

const USER_EXISTENCE_CHECK_INTERVAL_MS = 1000 * 60 * 5

const providers: Provider[] = [
  GitHub,
  Google,
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      isNewAccount: { label: 'Is New Account', type: 'text' },
    },
    authorize: async (credentials) => {
      if (!credentials) return null

      const email = credentials.email as string
      const password = credentials.password as string
      const isNewAccount = credentials.isNewAccount === 'true'

      console.log('Credentials authorize called:', { email, isNewAccount })

      try {
        let user = await prisma.userData.findUnique({
          where: { email: email },
        })

        // Handle new account creation
        if (isNewAccount && !user) {
          console.log('Creating new user account for:', email)

          // Create new user
          user = await prisma.userData.create({
            data: {
              email: email,
              name: email.split('@')[0], // Use email prefix as initial name
              provider_id: `credentials_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique ID for credentials users
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
            },
          })

          console.log('New user created:', user.id)

          // Create provider account with hashed password
          const hashedPassword = await hashPassword(password)
          await prisma.providerAccount.create({
            data: {
              userId: user.id,
              provider: 'credentials',
              providerAccountId: user.id,
              type: 'credentials',
              credentials_password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })

          console.log('Provider account created for user:', user.id)

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }

        // Handle existing user login
        if (!user) {
          console.log('User not found for login:', email)
          return null
        }

        const providerAccount = await prisma.providerAccount.findUnique({
          where: { userId: user.id },
        })

        if (!providerAccount) {
          console.log('Provider account not found for user:', user.id)
          return null
        }

        if (!providerAccount.credentials_password) {
          console.log('No password found for credentials account:', user.id)
          return null
        }

        const isValidPassword = await comparePassword(
          password,
          providerAccount.credentials_password
        )

        if (!isValidPassword) {
          console.log('Invalid password for user:', email)
          return null
        }

        console.log('User authenticated successfully:', user.id)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      } catch (error) {
        console.error('Error in credentials authorize:', error)
        return null
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

      if (!token || (token as any).userDeleted) {
        console.warn('Session invalidated due to missing user record.', {
          tokenEmail: token?.email,
        })
        return null
      }

      if (session?.user && token.id) {
        session.user.id = token.id as string
      }

      if (session?.user && token.email) {
        session.user.email = token.email as string
      }

      if (session?.user && token.name) {
        session.user.name = token.name as string
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

      if ((token as any).userDeleted) {
        return token
      }

      const now = Date.now()

      if (trigger === 'update') token.name = session.user.name

      // Set user ID from database if not already set
      if (!token.id && token.email) {
        const user = await prisma.userData.findUnique({
          where: { email: token.email as string },
        })
        if (user) {
          token.id = user.id
          token.lastUserCheck = now
        } else {
          console.warn(
            'JWT token email has no matching user. Marking for sign-out.',
            {
              tokenEmail: token.email,
            }
          )

          token.userDeleted = true
          token.lastUserCheck = now

          return token
        }
      }

      const lastUserCheck =
        typeof token.lastUserCheck === 'number' ? token.lastUserCheck : 0
      const shouldCheckUser =
        trigger === 'signIn' ||
        trigger === 'signUp' ||
        now - lastUserCheck > USER_EXISTENCE_CHECK_INTERVAL_MS

      if (token.id && shouldCheckUser) {
        const userExists = await prisma.userData.findUnique({
          where: { id: token.id as string },
          select: { id: true },
        })

        if (!userExists) {
          console.warn(
            'JWT token detected missing user. Marking for sign-out.',
            {
              tokenEmail: token.email,
              tokenId: token.id,
            }
          )

          token.userDeleted = true
          token.id = undefined
          token.lastUserCheck = now

          return token
        }

        token.lastUserCheck = now
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
      if (user?.email) {
        try {
          // IMPORTANT: Get the UserData record to use the correct internal ID
          // instead of the OAuth provider ID (user.id)
          const userData = await prisma.userData.findUnique({
            where: { email: user.email },
          })

          if (userData) {
            // Use the UserData.id (MongoDB ObjectId) for consistency with session
            const loginRecord = {
              userId: userData.id, // This is the key fix - use userData.id instead of user.id
              loginDate: new Date(),
              provider: account?.provider || 'unknown',
              // In a full implementation, you'd capture these from the request
              ipAddress: null as string | null,
              userAgent: null as string | null,
            }

            await prisma.userLogin.create({
              data: loginRecord,
            })

            // Also update the user's lastLogin timestamp
            await prisma.userData.update({
              where: { id: userData.id },
              data: { updatedAt: new Date() },
            })

            console.log(
              'Login event recorded successfully for user:',
              user.email,
              'with userId:',
              userData.id
            )
          } else {
            console.warn('UserData not found for login event:', user.email)
          }
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
