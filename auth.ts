import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import authConfig from '@auth.config'

const config: NextAuthConfig = {
  ...authConfig,
}

export const { auth, handlers, signIn, signOut } = NextAuth(config)
