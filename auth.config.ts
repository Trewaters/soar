import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
// import Facebook from 'next-auth/providers/facebook'
// import Twitter from 'next-auth/providers/twitter'

export default {
  // providers: [GitHub, Google, Twitter],
  providers: [GitHub, Google],
} satisfies NextAuthConfig

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/getting-started/providers/twitter
 */
