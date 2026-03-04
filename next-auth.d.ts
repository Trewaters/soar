import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Extended User interface with role support
   * Role is optional during initial authentication but will be set from database
   */
  interface User extends DefaultUser {
    id: string
    role?: string
  }

  /**
   * Extended Session interface with role support
   * Role is included in the session for client-side authorization checks
   */
  interface Session {
    user: {
      id: string
      role: string
      name: string
      email: string
      image?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface with role support
   * Role is stored in JWT token and synced from database
   */
  interface JWT {
    id: string
    role: string
    email: string
    name?: string
  }
}
