import NextAuth from 'next-auth'
import type { Provider } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
// import { MongoDBAdapter } from '@auth/mongodb-adapter' // Disabled - using custom Prisma-based user management
// import client from '@lib/mongoDb' // Disabled - using custom Prisma-based user management
import { hashPassword, comparePassword } from '@app/utils/password'
import { AuthErrorCode, type AuthError } from '@app/auth/types'

// Re-export auth types for backward compatibility with server-side code
export { AuthErrorCode, type AuthError }

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/getting-started/providers/twitter
 */

// Helper function to throw auth errors that NextAuth can catch
function throwAuthError(
  code: AuthErrorCode,
  message: string,
  provider?: string
): never {
  const error = new Error(message) as Error & {
    code: AuthErrorCode
    provider?: string
  }
  error.code = code
  if (provider) error.provider = provider
  throw error
}

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

// Defensive guard: some server Responses (from auth core or edge cases)
// may have an empty body which causes Response.json() to throw
// with "Unexpected end of JSON input" when callers assume JSON.
// Patch Response.prototype.json early so server-side callers (NextAuth
// vendor code) get a safe null result instead of an exception.
try {
  if (
    typeof Response !== 'undefined' &&
    !(Response.prototype as any).__jsonPatched
  ) {
    const _origJson = Response.prototype.json
    Response.prototype.json = async function patchedJson() {
      try {
        // Prefer reading text first so we can short-circuit empty bodies
        const txt = await this.text()
        if (!txt) return null
        // Try parse JSON text; if it fails, fall back to original json
        try {
          return JSON.parse(txt)
        } catch (e) {
          // fallback to original implementation
        }
      } catch (e) {
        // ignore and fallback
      }
      return _origJson.call(this)
    }
    ;(Response.prototype as any).__jsonPatched = true
  }
} catch (e) {
  // If anything goes wrong patching, swallow the error to avoid
  // preventing the auth initializer from loading.
}

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
      if (!credentials) {
        console.warn('[AUTH] Authorize called with no credentials')
        return null
      }

      const email = credentials.email as string
      const password = credentials.password as string
      const isNewAccount = credentials.isNewAccount === 'true'

      console.log('[AUTH] Authorize attempt:', { email, isNewAccount })

      try {
        // Check if user exists
        const user = await prisma.userData.findUnique({
          where: { email: email },
        })

        // Handle new account creation
        if (isNewAccount) {
          if (user) {
            // User already exists - check which provider they're using
            console.log(
              '[AUTH] Account creation attempted for existing email:',
              email
            )

            const providerAccounts = await prisma.providerAccount.findMany({
              where: { userId: user.id },
              select: { provider: true },
            })

            if (providerAccounts.length === 0) {
              console.error(
                '[AUTH] User exists but has no provider accounts:',
                email
              )
              throwAuthError(
                AuthErrorCode.NO_PASSWORD_SET,
                'Account exists but no authentication method is configured',
                'unknown'
              )
            }

            const primaryProvider = providerAccounts[0].provider
            console.log('[AUTH] User exists with provider:', primaryProvider)

            if (primaryProvider === 'credentials') {
              throwAuthError(
                AuthErrorCode.EMAIL_EXISTS_CREDENTIALS,
                'This email is already registered. Please sign in or use "Forgot Password" to reset your password.',
                'credentials'
              )
            } else {
              // OAuth provider (google, github, etc.)
              const providerName =
                primaryProvider.charAt(0).toUpperCase() +
                primaryProvider.slice(1)
              throwAuthError(
                AuthErrorCode.EMAIL_EXISTS_OAUTH,
                `This email is registered with ${providerName}. Please sign in using the ${providerName} button.`,
                primaryProvider
              )
            }
          }

          // Create new user
          console.log('[AUTH] Creating new user account:', email)
          const newUser = await prisma.userData.create({
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

          // Create provider account with hashed password
          const hashedPassword = await hashPassword(password)
          await prisma.providerAccount.create({
            data: {
              userId: newUser.id,
              provider: 'credentials',
              providerAccountId: newUser.id,
              type: 'credentials',
              credentials_password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })

          console.log('[AUTH] New user account created successfully:', email)
          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          }
        }

        // Handle existing user login
        if (!user) {
          console.log('[AUTH] User not found for login attempt:', email)
          return null
        }

        console.log('[AUTH] User found, verifying credentials:', email)

        // Get provider account information
        const providerAccount = await prisma.providerAccount.findFirst({
          where: {
            userId: user.id,
            provider: 'credentials',
          },
          select: {
            provider: true,
            credentials_password: true,
          },
        })

        if (!providerAccount) {
          // User exists but has no credentials provider - likely OAuth only
          console.log(
            '[AUTH] User has no credentials provider, checking for OAuth providers:',
            email
          )

          const oauthProviders = await prisma.providerAccount.findMany({
            where: { userId: user.id },
            select: { provider: true },
          })

          if (oauthProviders.length > 0) {
            const primaryProvider = oauthProviders[0].provider
            const providerName =
              primaryProvider.charAt(0).toUpperCase() + primaryProvider.slice(1)
            console.log(
              '[AUTH] User registered with OAuth provider:',
              primaryProvider
            )
            throwAuthError(
              AuthErrorCode.EMAIL_EXISTS_OAUTH,
              `This email is registered with ${providerName}. Please sign in using the ${providerName} button.`,
              primaryProvider
            )
          }

          console.warn(
            '[AUTH] User has no configured authentication providers:',
            email
          )
          throwAuthError(
            AuthErrorCode.NO_PASSWORD_SET,
            'No password is set for this account. Please use social login or contact support.',
            'none'
          )
        }

        if (!providerAccount.credentials_password) {
          console.warn(
            '[AUTH] Credentials provider exists but no password hash found:',
            email
          )
          throwAuthError(
            AuthErrorCode.NO_PASSWORD_SET,
            'No password is set for this account. Please use "Forgot Password" to set a password.',
            'credentials'
          )
        }

        // Compare provided password with stored hash
        console.log('[AUTH] Comparing password for user:', email)
        const isValidPassword = await comparePassword(
          password,
          providerAccount.credentials_password
        )

        if (!isValidPassword) {
          console.log('[AUTH] Invalid password for user:', email)
          throwAuthError(
            AuthErrorCode.INVALID_PASSWORD,
            'Invalid email or password. Please try again or use "Forgot Password" to reset your password.',
            'credentials'
          )
        }

        console.log('[AUTH] Authentication successful for user:', email)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      } catch (error) {
        // Re-throw auth errors so NextAuth can handle them
        if (error instanceof Error && 'code' in error) {
          console.error('[AUTH] Authentication error:', {
            code: (error as any).code,
            message: error.message,
            provider: (error as any).provider,
          })
          throw error
        }

        // Log unexpected errors
        console.error(
          '[AUTH] Unexpected error in credentials authorize:',
          error
        )
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
  // adapter: MongoDBAdapter(client), // Disabled - using custom Prisma-based user management in signIn callback
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
      try {
        const email = user.email

        // Skip provider account linking for credentials provider
        if (account?.provider === 'credentials') {
          return true
        }

        const existingUser = await prisma.userData.findUnique({
          where: { email: email ?? undefined },
        })

        if (!existingUser && account) {
          // Create new user with OAuth provider
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
                    token_type: account.token_type ?? undefined,
                    scope: account.scope ?? undefined,
                    id_token: account.id_token ?? undefined,
                    session_state: JSON.stringify(account.session_state),
                    type: account.type,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                },
              },
            })
          } catch (error) {
            console.error('[AUTH] signIn: Error creating new user:', error)
            throw error
          }
        } else if (existingUser && account) {
          // User exists - check if this OAuth provider is already linked
          const existingProviderAccount =
            await prisma.providerAccount.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
              },
            })

          if (!existingProviderAccount) {
            // Link new OAuth provider to existing user account
            try {
              await prisma.providerAccount.create({
                data: {
                  userId: existingUser.id,
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
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              })
            } catch (error) {
              console.error(
                '[AUTH] signIn: Error linking OAuth provider to existing user:',
                error
              )
              throw error
            }
          }

          // Update existing user's OAuth provider image if it's missing
          if (user.image && !existingUser.image) {
            try {
              await prisma.userData.update({
                where: { email: email ?? undefined },
                data: {
                  image: user.image,
                  updatedAt: new Date(),
                },
              })
            } catch (error) {
              console.error(
                '[AUTH] signIn: Error updating user OAuth image:',
                error
              )
              // Don't throw - allow sign-in to continue even if update fails
            }
          }
        }
        return true
      } catch (error) {
        console.error(
          '[AUTH] signIn: Unhandled error in signIn callback:',
          error
        )
        throw error
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      if (!token || (token as any).userDeleted) {
        console.warn('[AUTH] Session invalidated due to missing user record.', {
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

      // Include role in session for authorization
      if (session?.user && token.role) {
        session.user.role = token.role as string
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
      if ((token as any).userDeleted) {
        return token
      }

      const now = Date.now()

      if (trigger === 'update') token.name = session.user.name

      // Set user ID from database if not already set
      if (!token.id && token.email) {
        const user = await prisma.userData.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true },
        })
        if (user) {
          token.id = user.id
          token.role = user.role || 'user'
          token.lastUserCheck = now
        } else {
          console.warn(
            '[AUTH] JWT token email has no matching user. Marking for sign-out.',
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
          select: { id: true, role: true },
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

        // Update role from database to catch role changes
        token.role = userExists.role || 'user'
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
