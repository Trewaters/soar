/**
 * MongoDB Backup Restore Script for Soar Yoga App
 *
 * Restores a previously created backup to local development database.
 *
 * Usage: npm run restore:backup <backup-folder-name>
 * Example: npm run restore:backup backup-2024-11-17T10-30-00-000Z
 */

import { MongoClient } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const LOCAL_URI = process.env.MONGODB_URI || process.env.NEXTAUTH_URL
const BACKUP_DIR = process.env.BACKUP_DIR || './backups'

if (!LOCAL_URI) {
  console.error('❌ Missing MONGODB_URI in .env.local')
  process.exit(1)
}

async function restoreBackup(backupFolderName: string): Promise<void> {
  let localClient: MongoClient | null = null

  try {
    const backupPath = path.join(BACKUP_DIR, backupFolderName)

    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Backup folder not found: ${backupPath}`)
      console.log('\nAvailable backups:')
      const backups = fs
        .readdirSync(BACKUP_DIR)
        .filter((f) => f.startsWith('backup-'))
      backups.forEach((b) => console.log(`   - ${b}`))
      process.exit(1)
    }

    console.log(`📂 Restoring from: ${backupPath}\n`)

    // Read metadata
    const metadataPath = path.join(backupPath, '_backup-metadata.json')
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      console.log(
        `📋 Backup created: ${new Date(metadata.timestamp).toLocaleString()}`
      )
      console.log(`📦 Collections: ${metadata.totalCollections}`)
      console.log(`📄 Documents: ${metadata.totalDocuments}\n`)
    }

    console.log('🔌 Connecting to local database...')
    localClient = new MongoClient(LOCAL_URI as string)
    await localClient.connect()
    const localDb = localClient.db()

    console.log('✅ Connected successfully!\n')

    // Get all JSON files in backup directory
    const files = fs
      .readdirSync(backupPath)
      .filter((f) => f.endsWith('.json') && !f.startsWith('_'))

    console.log(`🔄 Restoring ${files.length} collections...\n`)

    for (const file of files) {
      const collectionName = path.basename(file, '.json')
      const filePath = path.join(backupPath, file)

      console.log(`💾 Restoring collection: ${collectionName}`)

      const documents = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      console.log(`   └─ ${documents.length} documents to restore`)

      if (documents.length === 0) {
        console.log(`   └─ ⚠️  Collection is empty, skipping\n`)
        continue
      }

      const collection = localDb.collection(collectionName)

      // Drop existing collection
      try {
        await collection.drop()
        console.log(`   └─ 🗑️  Dropped existing local collection`)
      } catch (error: any) {
        if (error.code !== 26) {
          throw error
        }
        console.log(`   └─ ℹ️  Collection doesn't exist locally yet`)
      }

      // Insert documents
      await collection.insertMany(documents)
      console.log(`   └─ ✅ Restored ${documents.length} documents\n`)
    }

    console.log('✨ Restore completed successfully!')
  } catch (error) {
    console.error('\n❌ Restore failed:', error)
    process.exit(1)
  } finally {
    if (localClient) {
      await localClient.close()
      console.log('\n🔌 Closed local connection')
    }
  }
}

// Get backup folder from command line argument
const backupFolder = process.argv[2]

if (!backupFolder) {
  console.error('❌ Please provide a backup folder name')
  console.log('\nUsage: npm run restore:backup <backup-folder-name>')
  console.log('\nAvailable backups:')
  if (fs.existsSync(BACKUP_DIR)) {
    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => f.startsWith('backup-'))
    backups.forEach((b) => console.log(`   - ${b}`))
  }
  process.exit(1)
}

restoreBackup(backupFolder)
