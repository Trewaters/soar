// lib/mongodb.ts

import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URL ?? ''
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
