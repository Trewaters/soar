import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { type Adapter } from '@auth/core/adapters'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@lib/db'

const MyAdapter: Adapter = {
  ...MongoDBAdapter(clientPromise),
}

export default {
  providers: [GitHub, Google],
  adapter: MyAdapter,
} satisfies NextAuthConfig
