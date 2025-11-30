/**
 * Import AsanaActivity Collection from JSON
 *
 * Purpose: Import AsanaActivity documents from JSON export file into MongoDB
 *
 * Usage:
 *   ts-node scripts/migrations/import-asana-activity.ts
 *
 * Or add to package.json scripts:
 *   "import:asana-activity": "ts-node scripts/migrations/import-asana-activity.ts"
 */

import { MongoClient } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Configuration
const COLLECTION_NAME = 'AsanaActivity'
const JSON_FILE_PATH = path.join(
  'C:',
  'Users',
  'trewa',
  'OneDrive',
  '01-WORMHOLE',
  'Yoga',
  'app-Soar',
  'app data',
  'version 2 data',
  'version 2b Data-pose',
  'v2_UvuyoYogaDb.AsanaActivity.json'
)

// Get MongoDB connection string from environment
const MONGODB_URI = process.env.DATABASE_URL!

if (!MONGODB_URI) {
  console.error('❌ ERROR: DATABASE_URL environment variable not set')
  console.error('Please set DATABASE_URL in your .env file')
  process.exit(1)
}

interface AsanaActivityDocument {
  _id: { $oid: string }
  userId: { $oid: string }
  poseId: { $oid: string }
  poseName: string
  sort_english_name: string
  duration: { $numberLong: string }
  datePerformed: { $date: string }
  completionStatus: string
  createdAt: { $date: string }
  updatedAt: { $date: string }
  notes?: string
  sensations?: string
  difficulty?: string
}

/**
 * Transform MongoDB JSON export format to standard JavaScript objects
 */
function transformDocument(doc: AsanaActivityDocument): any {
  return {
    _id: doc._id.$oid,
    userId: doc.userId.$oid,
    poseId: doc.poseId.$oid,
    poseName: doc.poseName,
    sort_english_name: doc.sort_english_name,
    duration: parseInt(doc.duration.$numberLong, 10),
    datePerformed: new Date(doc.datePerformed.$date),
    completionStatus: doc.completionStatus,
    createdAt: new Date(doc.createdAt.$date),
    updatedAt: new Date(doc.updatedAt.$date),
    ...(doc.notes && { notes: doc.notes }),
    ...(doc.sensations && { sensations: doc.sensations }),
    ...(doc.difficulty && { difficulty: doc.difficulty }),
  }
}

async function importAsanaActivity() {
  console.log('='.repeat(60))
  console.log('AsanaActivity Collection Import')
  console.log('='.repeat(60))
  console.log()

  // Check if file exists
  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error('❌ ERROR: JSON file not found')
    console.error(`Path: ${JSON_FILE_PATH}`)
    process.exit(1)
  }

  console.log('📂 Reading JSON file...')
  console.log(`   Path: ${JSON_FILE_PATH}`)

  let jsonData: AsanaActivityDocument[]
  try {
    const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8')
    jsonData = JSON.parse(fileContent)
    console.log(`✓ Successfully read ${jsonData.length} documents from file`)
  } catch (error) {
    console.error('❌ ERROR: Failed to read or parse JSON file')
    console.error(error)
    process.exit(1)
  }

  console.log()
  console.log('🔌 Connecting to MongoDB...')

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✓ Connected to MongoDB')

    const db = client.db()
    const collection = db.collection(COLLECTION_NAME)

    // Check existing documents
    const existingCount = await collection.countDocuments()
    console.log()
    console.log('📊 Pre-import status:')
    console.log(`   Existing documents: ${existingCount}`)

    if (existingCount > 0) {
      console.log()
      console.log('⚠️  WARNING: Collection already contains documents.')
      console.log('   This will ADD to existing documents.')
      console.log('   To replace all data, drop the collection first.')
      console.log()

      // Uncomment the following lines to drop the collection before import
      // console.log('🗑️  Dropping existing collection...')
      // await collection.drop()
      // console.log('✓ Collection dropped')
    }

    // Transform documents
    console.log()
    console.log('🔄 Transforming documents...')
    const transformedDocs = jsonData.map(transformDocument)
    console.log(`✓ Transformed ${transformedDocs.length} documents`)

    // Insert documents
    console.log()
    console.log('💾 Inserting documents...')
    const startTime = Date.now()

    const result = await collection.insertMany(transformedDocs, {
      ordered: false, // Continue on duplicate key errors
    })

    const duration = (Date.now() - startTime) / 1000
    console.log(`✓ Import completed successfully`)
    console.log(`   Documents inserted: ${result.insertedCount}`)
    console.log(`   Duration: ${duration.toFixed(2)} seconds`)

    // Post-import verification
    const finalCount = await collection.countDocuments()
    console.log()
    console.log('📊 Post-import status:')
    console.log(`   Total documents: ${finalCount}`)
    console.log(`   New documents added: ${finalCount - existingCount}`)

    console.log()
    console.log('='.repeat(60))
    console.log('✅ Import completed successfully!')
    console.log('='.repeat(60))
  } catch (error: any) {
    console.error()
    console.error('❌ ERROR: Import failed')

    if (error.code === 11000) {
      console.error('   Duplicate key error - some documents may already exist')
      console.error('   Partial import may have succeeded')
    } else {
      console.error(`   ${error.message}`)
    }

    process.exit(1)
  } finally {
    await client.close()
    console.log('🔌 MongoDB connection closed')
  }
}

// Run the import
importAsanaActivity().catch(console.error)
