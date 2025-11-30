/**
 * MongoDB Production Database Inspector
 *
 * Lists all databases and collections with document counts to help identify
 * where production data actually lives.
 *
 * Usage: npm run inspect:prod
 */

import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PROD_URI = process.env.MONGODB_PROD_URI

if (!PROD_URI) {
  console.error('❌ Missing MONGODB_PROD_URI in .env.local')
  process.exit(1)
}

async function inspectProduction() {
  let prodClient: MongoClient | null = null

  try {
    console.log('🔌 Connecting to production...')
    prodClient = new MongoClient(PROD_URI as string)
    await prodClient.connect()

    console.log('✅ Connected successfully!\n')

    // Get list of all databases
    const adminDb = prodClient.db().admin()
    const { databases } = await adminDb.listDatabases()

    console.log('📚 Available Databases:\n')
    console.log('='.repeat(80))

    for (const dbInfo of databases) {
      const dbName = dbInfo.name
      const dbSize = ((dbInfo.sizeOnDisk || 0) / 1024 / 1024).toFixed(2)

      // Skip system databases
      if (['admin', 'local', 'config'].includes(dbName)) {
        console.log(`⏭️  ${dbName} (system database) - ${dbSize} MB`)
        continue
      }

      console.log(`\n📦 Database: ${dbName}`)
      console.log(`   Size: ${dbSize} MB`)
      console.log('   Collections:')

      const db = prodClient.db(dbName)
      const collections = await db.listCollections().toArray()

      if (collections.length === 0) {
        console.log('   └─ (empty database)')
        continue
      }

      for (const collInfo of collections) {
        const collName = collInfo.name

        // Skip system collections
        if (collName.startsWith('system.')) {
          continue
        }

        const collection = db.collection(collName)
        const count = await collection.countDocuments()
        const sample = count > 0 ? await collection.findOne() : null

        console.log(`   ├─ ${collName}: ${count} documents`)

        // Show sample document structure
        if (sample) {
          const fields = Object.keys(sample).filter((k) => k !== '_id')
          console.log(
            `   │  Fields: ${fields.slice(0, 5).join(', ')}${fields.length > 5 ? '...' : ''}`
          )
        }
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log(
      '\n💡 Tip: Update MONGODB_PROD_URI to include the correct database name'
    )
    console.log(
      '   Format: mongodb+srv://user:pass@cluster.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority'
    )
  } catch (error) {
    console.error('\n❌ Inspection failed:', error)
    process.exit(1)
  } finally {
    if (prodClient) {
      await prodClient.close()
      console.log('\n🔌 Closed production connection')
    }
  }
}

// Run the inspection
inspectProduction()
