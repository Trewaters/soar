import NextAuth from 'next-auth'
import 'next-auth/jwt'
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

      // Check if the user already exists
      const existingUser = await prisma.userData.findUnique({
        where: { email: email ?? undefined },
      })

      // console.log('existingUser:', existingUser)
      // console.log('user:', user)
      // console.log('account:', account)
      // console.log('profile:', profile)

      if (!existingUser && account) {
        try {
          const newUser = await prisma.userData.create({
            data: {
              provider_id: user.id,
              name: user.name,
              email: user.email,
              emailVerified: new Date(),
              image: user.id,
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
              accounts: {
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
                },
              },
              // create a way to add generic profile schema for unknown providers
              // profile: {
              //   create: { ...profile },
              // },

              // create a new profile schema for each provider.
              //   profile_github: {
              //     create: {
              //       login: profile.login,
              //       profile_id: profile.id,
              //       node_id: profile.node_id,
              //       avatar_url: profile.avatar_url,
              //       gravatar_id: profile.gravatar_id,
              //       url: profile.url,
              //       html_url: profile.html_url,
              //       followers_url: profile.followers_url,
              //       following_url: profile.following_url,
              //       gists_url: profile.gists_url,
              //       starred_url: profile.starred_url,
              //       subscriptions_url: profile.subscriptions_url,
              //       organizations_url: profile.organizations_url,
              //       repos_url: profile.repos_url,
              //       events_url: profile.events_url,
              //       received_events_url: profile.received_events_url,
              //       type: profile.type,
              //       site_admin: profile.site_admin,
              //       name: profile.name,
              //       company: profile.company,
              //       blog: profile.blog,
              //       location: profile.location,
              //       email: profile.email,
              //       hireable: profile.hireable,
              //       bio: profile.bio,
              //       twitter_username: profile.twitter_username,
              //       public_repos: profile.public_repos,
              //       public_gists: profile.public_gists,
              //       followers: profile.followers,
              //       following: profile.following,
              //       created_at: profile.created_at,
              //       updated_at: profile.updated_at,
              //       private_gists: profile.private_gists,
              //       total_private_repos: profile.total_private_repos,
              //       owned_private_repos: profile.owned_private_repos,
              //       disk_usage: profile.disk_usage,
              //       collaborators: profile.collaborators,
              //       two_factor_authentication: profile.two_factor_authentication,
              //       plan: {
              //         create: {
              //           name: profile.plan.name,
              //           space: profile.plan.space,
              //           collaborators: profile.plan.collaborators,
              //           private_repos: profile.plan.private_repos,
              //         },
              //     },
              //   },

              //   profile_google: {
              //     create: {
              //       iss: profile.iss,
              //       azp: profile.azp,
              //       aud: profile.aud,
              //       sub: profile.sub,
              //       email: profile.email,
              //       email_verified: profile.email_verified,
              //       at_hash: profile.at_hash,
              //       name: profile.name,
              //       picture: profile.picture,
              //       given_name: profile.given_name,
              //       family_name: profile.family_name,
              //       iat: profile.iat,
              //       exp: profile.exp,
              //   },
              // },
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
      // console.log('config session:', session)
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
