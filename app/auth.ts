import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const providers = [Google]

/*  
setting up version 5 of NextAuth, next-auth v5
https://authjs.dev/getting-started/installation
*/

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async session({ session, token, user }) {
      // TODO swap for a prisma User in the future
      session.user = token.user as any
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user
      }
      if (trigger === 'update' && session) {
        token = { ...token, user: session }
        return token
      }
      return token
    },
  },
})
