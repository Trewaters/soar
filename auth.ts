import NextAuth from 'next-auth'
import type { Provider } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
// import { MongoDBAdapter } from '@auth/mongodb-adapter' // Disabled - using custom Prisma-based user management
// import client from '@lib/mongoDb' // Disabled - using custom Prisma-based user management
import { hashPassword, comparePassword } from '@app/utils/password'

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/getting-started/providers/twitter
 */

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

// Log Prisma client initialization
console.log('[AUTH] Prisma client initialized')
console.log('[AUTH] NEXTAUTH_SECRET present:', !!process.env.NEXTAUTH_SECRET)
console.log('[AUTH] AUTH_SECRET present:', !!process.env.AUTH_SECRET)
console.log('[AUTH] AUTH_GOOGLE_ID present:', !!process.env.AUTH_GOOGLE_ID)
console.log(
  '[AUTH] AUTH_GOOGLE_SECRET present:',
  !!process.env.AUTH_GOOGLE_SECRET
)

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
      console.log('[AUTH] Credentials authorize called')

      if (!credentials) {
        console.log('[AUTH] No credentials provided')
        return null
      }

      const email = credentials.email as string
      const password = credentials.password as string
      const isNewAccount = credentials.isNewAccount === 'true'

      console.log('[AUTH] Attempting auth for:', {
        email,
        isNewAccount,
        hasPassword: !!password,
      })

      try {
        console.log('[AUTH] Looking up user in database...')
        let user = await prisma.userData.findUnique({
          where: { email: email },
        })
        console.log(
          '[AUTH] User lookup result:',
          user ? { id: user.id, email: user.email } : 'not found'
        )

        // Handle new account creation
        if (isNewAccount && !user) {
          console.log('[AUTH] Creating new user account...')
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

          // Create provider account with hashed password
          console.log('[AUTH] User created, creating provider account...')
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

          console.log('[AUTH] New account created successfully:', {
            id: user.id,
            email: user.email,
          })
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }

        // Handle existing user login
        if (!user) {
          console.log('[AUTH] User not found for login:', email)
          return null
        }

        // Verify password for credentials provider
        console.log('[AUTH] Looking up provider account for user:', user.id)
        const providerAccount = await prisma.providerAccount.findFirst({
          where: {
            userId: user.id,
            provider: 'credentials',
          },
        })

        console.log(
          '[AUTH] Provider account lookup:',
          providerAccount
            ? {
                provider: providerAccount.provider,
                hasPassword: !!providerAccount.credentials_password,
              }
            : 'not found'
        )

        if (!providerAccount || !providerAccount.credentials_password) {
          console.log('[AUTH] No credentials provider found for user:', email)
          return null
        }

        // Compare provided password with stored hash
        console.log('[AUTH] Comparing passwords...')
        const isValidPassword = await comparePassword(
          password,
          providerAccount.credentials_password
        )
        console.log('[AUTH] Password validation result:', isValidPassword)

        if (!isValidPassword) {
          console.log('[AUTH] Invalid password for user:', email)
          return null
        }

        console.log('[AUTH] Login successful for user:', {
          id: user.id,
          email: user.email,
        })
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      } catch (error) {
        console.error('[AUTH] Error in credentials authorize:', error)
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
      console.log('[AUTH] signIn callback called:', {
        email: user?.email,
        provider: account?.provider,
      })

      try {
        const email = user.email

        // Skip provider account linking for credentials provider
        if (account?.provider === 'credentials') {
          console.log('[AUTH] signIn: Credentials provider, returning true')
          return true
        }

        console.log(
          '[AUTH] signIn: OAuth provider, looking up existing user by email:',
          email
        )
        const existingUser = await prisma.userData.findUnique({
          where: { email: email ?? undefined },
        })
        console.log(
          '[AUTH] signIn: Existing user lookup result:',
          existingUser
            ? { id: existingUser.id, email: existingUser.email }
            : 'not found'
        )

        if (!existingUser && account) {
          // Create new user with OAuth provider
          console.log(
            '[AUTH] signIn: Creating new user with OAuth provider:',
            account.provider
          )
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
            console.log('[AUTH] signIn: New OAuth user created successfully:', {
              id: newUser.id,
              email: newUser.email,
            })
          } catch (error) {
            console.error('[AUTH] signIn: Error creating new user:', error)
            throw error
          }
        } else if (existingUser && account) {
          // User exists - check if this OAuth provider is already linked
          console.log(
            '[AUTH] signIn: User exists, checking for existing provider account'
          )
          const existingProviderAccount =
            await prisma.providerAccount.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
              },
            })
          console.log(
            '[AUTH] signIn: Existing provider account:',
            existingProviderAccount ? 'found' : 'not found'
          )

          if (!existingProviderAccount) {
            // Link new OAuth provider to existing user account
            console.log(
              '[AUTH] signIn: Linking new OAuth provider to existing user'
            )
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
              console.log(
                `[AUTH] signIn: Linked ${account.provider} account to existing user: ${email}`
              )
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
            console.log(
              '[AUTH] signIn: Updating user image from OAuth provider'
            )
            try {
              await prisma.userData.update({
                where: { email: email ?? undefined },
                data: {
                  image: user.image,
                  updatedAt: new Date(),
                },
              })
              console.log(
                `[AUTH] signIn: Updated OAuth provider image for existing user: ${email}`
              )
            } catch (error) {
              console.error(
                '[AUTH] signIn: Error updating user OAuth image:',
                error
              )
              // Don't throw - allow sign-in to continue even if update fails
            }
          }
        }
        console.log(
          '[AUTH] signIn: OAuth flow completed successfully, returning true'
        )
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
      console.log('[AUTH] Session callback called:', {
        hasToken: !!token,
        tokenId: token?.id,
        tokenEmail: token?.email,
      })

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
      console.log('[AUTH] JWT callback called:', {
        trigger,
        tokenEmail: token?.email,
        hasAccount: !!account,
      })

      if ((token as any).userDeleted) {
        console.log('[AUTH] JWT: Token marked as userDeleted, returning early')
        return token
      }

      const now = Date.now()

      if (trigger === 'update') token.name = session.user.name

      // Set user ID from database if not already set
      if (!token.id && token.email) {
        console.log('[AUTH] JWT: Looking up user by email:', token.email)
        const user = await prisma.userData.findUnique({
          where: { email: token.email as string },
        })
        if (user) {
          console.log('[AUTH] JWT: Found user, setting token.id:', user.id)
          token.id = user.id
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
        console.log('[AUTH] JWT: Google provider, adding access token to JWT')
        return { ...token, accessToken: account.access_token }
      }
      if (account?.provider === 'github') {
        console.log('[AUTH] JWT: GitHub provider, adding access token to JWT')
        return { ...token, accessToken: account.access_token }
      }
      console.log('[AUTH] JWT: Returning token:', {
        id: token.id,
        email: token.email,
      })
      return token
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('[AUTH] redirect callback:', { url, baseUrl })
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
  // Ensure cookie settings are compatible with local development (http://localhost)
  // NextAuth may set cookies with `secure: true` when it detects a production URL,
  // which prevents the browser from storing cookies on http://localhost and
  // causes CSRF/token mismatches (MissingCSRF). Force non-secure cookies in
  // development so credentials and OAuth flows work locally.
  cookies: {
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    sessionToken: {
      // Use standard NextAuth session cookie name so other parts keep working
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}

// @ts-expect-error - NextAuth v5 beta type resolution issue
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig)
