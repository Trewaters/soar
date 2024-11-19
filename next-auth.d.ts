import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    role?: string
  }

  // ! extend Session correctly
  interface Session {
    user: {
      id: string | null
      role?: string | null
      status?: string | null
      value?: string | null
      expires?: string | null
    } & DefaultSession['user']
    lastLogin?: string | null
  }
}
