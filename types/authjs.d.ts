import { type DefaultSession, Session } from "next-auth"

declare module "next-auth" {
  interface Session {
    // Add or modify properties here
    user: {
      yoga: string
    } & DefaultSession["user"]
    status: string
    value: string
  }
}
