import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

const prisma = new PrismaClient()

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
  }),
  CredentialsProvider({
    // Add your credentials provider configuration here
    name: 'Credentials',
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      // Add your credentials provider logic here
      // Example:
      // const user = { id: 1, name: 'User', email: 'user@example.com' }
      // return user ?? null
      return null
    },
  }),
  // Add more providers here
]

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   // Do whatever you want here, before the request is passed down to `NextAuth`
//   const isDefaultSigninPage =
//     req.method === 'GET' && req.query.nextauth.includes('signin')

//   // Will hide the `GoogleProvider` when you visit `/api/auth/signin`
//   if (isDefaultSigninPage) providers.pop()

//   return await NextAuth(req, res, {
//     providers,
//     adapter: PrismaAdapter(prisma),
//     secret: process.env.NEXTAUTH_SECRET,
//     session: {
//       strategy: 'jwt',
//     },
//     callbacks: {
//       async session({ session, token, user }) {
//         console.log('NextAuth session', session)
//         if (session.user) {
//           session.user.id = token.sub ?? 'no-id'
//         }
//         return session
//       },
//       async jwt({ token, user }) {
//         if (user) {
//           token.sub = user.id
//           token.email = user.email
//         }
//         return token
//       },
//     },
//   })
// }

// export default NextAuth({
//   providers: providers,
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     async session({ session, token, user }) {
//       console.log('NextAuth session', session)
//       if (session.user) {
//         session.user.id = token.sub ?? 'no-id'
//       }
//       return session
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.sub = user.id
//         token.email = user.email
//       }
//       return token
//     },
//   },
// })
