/**
 * List all collections in production database
 *
 * Usage: npx tsx scripts/syncDb/list-prod-collections.ts
 */

import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PROD_URI = process.env.MONGODB_PROD_URI

if (!PROD_URI) {
  console.error('❌ Missing MONGODB_PROD_URI environment variable')
  process.exit(1)
}

async function listCollections() {
  let prodClient: MongoClient | null = null

  try {
    console.log('🔌 Connecting to production database...')
    prodClient = new MongoClient(PROD_URI as string)
    await prodClient.connect()
    const prodDb = prodClient.db()

    const collections = await prodDb.listCollections().toArray()

    console.log(`\n📦 Found ${collections.length} collections in production:\n`)

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name
      const collection = prodDb.collection(collectionName)
      const docCount = await collection.countDocuments()

      console.log(`   ${collectionName.padEnd(30)} (${docCount} documents)`)
    }

    console.log('\n')
  } catch (error) {
    console.error('\n❌ Failed to list collections:', error)
    process.exit(1)
  } finally {
    if (prodClient) {
      await prodClient.close()
      console.log('🔌 Closed production connection')
    }
  }
}

listCollections()
