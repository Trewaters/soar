/**
 * MongoDB Production Backup Script for Soar Yoga App
 *
 * Creates a timestamped backup of production MongoDB data to local machine.
 * Backups are stored as JSON files that can be easily restored or inspected.
 *
 * Usage: npm run backup:prod
 */

import { MongoClient } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PROD_URI = process.env.MONGODB_PROD_URI
const BACKUP_DIR = process.env.BACKUP_DIR || './backups'

if (!PROD_URI) {
  console.error('❌ Missing MONGODB_PROD_URI in .env.local')
  process.exit(1)
}

interface BackupStats {
  totalCollections: number
  totalDocuments: number
  collectionStats: Array<{
    name: string
    count: number
  }>
  backupPath: string
  timestamp: string
}

async function backupDatabase(): Promise<void> {
  let prodClient: MongoClient | null = null

  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true })
      console.log(`📁 Created backup directory: ${BACKUP_DIR}\n`)
    }

    // Generate timestamped backup folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`)
    fs.mkdirSync(backupPath, { recursive: true })

    console.log('🔌 Connecting to production database...')
    prodClient = new MongoClient(PROD_URI as string)
    await prodClient.connect()
    const prodDb = prodClient.db()

    console.log('✅ Connected successfully!\n')

    // Get all collection names
    const collections = await prodDb.listCollections().toArray()
    console.log(`📦 Found ${collections.length} collections in production\n`)

    const stats: BackupStats = {
      totalCollections: 0,
      totalDocuments: 0,
      collectionStats: [],
      backupPath,
      timestamp: new Date().toISOString(),
    }

    // Backup each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name

      // Skip system collections
      if (collectionName.startsWith('system.')) {
        console.log(`⏭️  Skipping system collection: ${collectionName}`)
        continue
      }

      console.log(`💾 Backing up collection: ${collectionName}`)

      const collection = prodDb.collection(collectionName)
      const documents = await collection.find({}).toArray()

      console.log(`   └─ ${documents.length} documents found`)

      if (documents.length === 0) {
        console.log(
          `   └─ ⚠️  Collection is empty, creating empty backup file\n`
        )
      }

      // Save collection to JSON file
      const filePath = path.join(backupPath, `${collectionName}.json`)
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2), 'utf-8')

      console.log(`   └─ ✅ Saved to: ${filePath}\n`)

      stats.totalCollections++
      stats.totalDocuments += documents.length
      stats.collectionStats.push({
        name: collectionName,
        count: documents.length,
      })
    }

    // Save backup metadata
    const metadataPath = path.join(backupPath, '_backup-metadata.json')
    fs.writeFileSync(metadataPath, JSON.stringify(stats, null, 2), 'utf-8')

    // Create a summary file
    const summaryPath = path.join(backupPath, '_backup-summary.txt')
    const summary = generateSummary(stats)
    fs.writeFileSync(summaryPath, summary, 'utf-8')

    console.log('✨ Backup completed successfully!\n')
    console.log('📊 Backup Summary:')
    console.log(`   - Collections backed up: ${stats.totalCollections}`)
    console.log(`   - Total documents: ${stats.totalDocuments}`)
    console.log(`   - Backup location: ${backupPath}`)
    console.log(`   - Timestamp: ${stats.timestamp}`)
    console.log('\n📄 Collection Details:')
    stats.collectionStats.forEach(({ name, count }) => {
      console.log(`   - ${name}: ${count} documents`)
    })
  } catch (error) {
    console.error('\n❌ Backup failed:', error)
    process.exit(1)
  } finally {
    if (prodClient) {
      await prodClient.close()
      console.log('\n🔌 Closed production connection')
    }
  }
}

function generateSummary(stats: BackupStats): string {
  const lines = [
    '='.repeat(60),
    'SOAR YOGA APP - MONGODB PRODUCTION BACKUP',
    '='.repeat(60),
    '',
    `Backup Date: ${new Date(stats.timestamp).toLocaleString()}`,
    `Backup Location: ${stats.backupPath}`,
    '',
    'SUMMARY',
    '-'.repeat(60),
    `Total Collections: ${stats.totalCollections}`,
    `Total Documents: ${stats.totalDocuments}`,
    '',
    'COLLECTION DETAILS',
    '-'.repeat(60),
  ]

  stats.collectionStats.forEach(({ name, count }) => {
    lines.push(`${name.padEnd(40)} ${count.toString().padStart(10)} docs`)
  })

  lines.push('')
  lines.push('='.repeat(60))
  lines.push('NOTES')
  lines.push('-'.repeat(60))
  lines.push('- Each collection is saved as a separate JSON file')
  lines.push('- Files can be imported using the restore script')
  lines.push('- Backup metadata is stored in _backup-metadata.json')
  lines.push('='.repeat(60))

  return lines.join('\n')
}

// Run the backup
backupDatabase()
