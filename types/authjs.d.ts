import { Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    // Add or modify properties here
    status: string
    value: string
  }
}
