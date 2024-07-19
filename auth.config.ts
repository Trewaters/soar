import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
// import Facebook from 'next-auth/providers/facebook'
import Twitter from 'next-auth/providers/twitter'

export default {
  providers: [GitHub, Google, Twitter],
} satisfies NextAuthConfig

/*
 * use auth/core Facebook, https://authjs.dev/reference/core/providers/facebook
 * use auth/core Twitter, https://authjs.dev/reference/core/providers/twitter
 */

/* 
use auth/core instead of next-auth
*/
// import { Auth, type AuthConfig } from '@auth/core'

// import Google from '@auth/core/providers/google'
// import GitHub from '@auth/core/providers/github'
// import Facebook from '@auth/core/providers/facebook'

// const request = new Request('https://www.happyyoga.app')
// const response = Auth(request, {
//   providers: [GitHub, Google, Facebook],
//   trustHost: true,
// })

// // true
// console.log(response instanceof Response)
