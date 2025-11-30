/**
 * MongoDB Production to Local Sync Script
 *
 * Copies all collections from production to local development database.
 * Safe to run - preserves your local Google OAuth session since you use
 * the same account in both environments.
 *
 * Usage: npm run sync:db
 */

import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PROD_URI = process.env.MONGODB_PROD_URI
const LOCAL_URI = process.env.MONGODB_URI

if (!PROD_URI || !LOCAL_URI) {
  console.error('❌ Missing required environment variables:')
  console.error('   - MONGODB_PROD_URI (production connection string)')
  console.error('   - MONGODB_URI (local connection string)')
  process.exit(1)
}

async function syncDatabase() {
  let prodClient: MongoClient | null = null
  let localClient: MongoClient | null = null

  try {
    console.log('🔌 Connecting to production database...')
    prodClient = new MongoClient(PROD_URI as string)
    await prodClient.connect()
    const prodDb = prodClient.db()

    console.log('🔌 Connecting to local database...')
    localClient = new MongoClient(LOCAL_URI as string)
    await localClient.connect()
    const localDb = localClient.db()

    // Get all collection names from production
    const collections = await prodDb.listCollections().toArray()
    console.log(`\n📦 Found ${collections.length} collections in production\n`)

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name

      // Skip system collections
      if (collectionName.startsWith('system.')) {
        console.log(`⏭️  Skipping system collection: ${collectionName}`)
        continue
      }

      console.log(`📋 Processing collection: ${collectionName}`)

      const prodCollection = prodDb.collection(collectionName)
      const localCollection = localDb.collection(collectionName)

      // Count documents
      const docCount = await prodCollection.countDocuments()
      console.log(`   └─ ${docCount} documents found`)

      if (docCount === 0) {
        console.log(`   └─ ⚠️  Collection is empty, skipping`)
        continue
      }

      // Drop existing local collection
      try {
        await localCollection.drop()
        console.log(`   └─ 🗑️  Dropped existing local collection`)
      } catch (error: any) {
        if (error.code !== 26) {
          // 26 = NamespaceNotFound
          throw error
        }
        console.log(`   └─ ℹ️  Collection doesn't exist locally yet`)
      }

      // Copy all documents
      const documents = await prodCollection.find({}).toArray()
      if (documents.length > 0) {
        await localCollection.insertMany(documents)
        console.log(`   └─ ✅ Copied ${documents.length} documents\n`)
      }
    }

    console.log('✨ Database sync completed successfully!\n')
    console.log('📊 Summary:')
    console.log(`   - Collections synced: ${collections.length}`)
    console.log(`   - Production URI: ${PROD_URI?.substring(0, 20)}...`)
    console.log(`   - Local URI: ${LOCAL_URI}`)
  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    process.exit(1)
  } finally {
    // Clean up connections
    if (prodClient) {
      await prodClient.close()
      console.log('\n🔌 Closed production connection')
    }
    if (localClient) {
      await localClient.close()
      console.log('🔌 Closed local connection')
    }
  }
}

// Run the sync
syncDatabase()
