/**
 * MongoDB Import Script: AsanaActivity Collection
 *
 * Purpose: Import AsanaActivity documents from JSON export file into dev database
 *
 * Usage:
 *   mongoimport --uri="YOUR_DATABASE_URL" \
 *     --collection=AsanaActivity \
 *     --file="C:\Users\trewa\OneDrive\01-WORMHOLE\Yoga\app-Soar\app data\version 2 data\version 2b Data-pose\v2_UvuyoYogaDb.AsanaActivity.json" \
 *     --jsonArray \
 *     --drop
 *
 * Or use this script with mongosh:
 *   mongosh "YOUR_DATABASE_URL" < scripts/migrations/import-asana-activity.js
 *
 * Note: Make sure to update the FILE_PATH constant below if running with mongosh
 */

// Configuration
const COLLECTION_NAME = 'AsanaActivity'
const FILE_PATH =
  'C:\\Users\\trewa\\OneDrive\\01-WORMHOLE\\Yoga\\app-Soar\\app data\\version 2 data\\version 2b Data-pose\\v2_UvuyoYogaDb.AsanaActivity.json'

print('='.repeat(60))
print('AsanaActivity Collection Import')
print('='.repeat(60))
print('')

// Get database reference
const db = db.getSiblingDB(db.getName())

// Step 1: Pre-import verification
print('Step 1: Pre-import verification')
print('-'.repeat(40))

const existingDocs = db[COLLECTION_NAME].countDocuments({})
print(`Current documents in ${COLLECTION_NAME}: ${existingDocs}`)

if (existingDocs > 0) {
  print('')
  print('⚠️  WARNING: Collection already contains documents.')
  print('This script will ADD to existing documents, not replace them.')
  print('If you want to replace all data, drop the collection first:')
  print(`  db.${COLLECTION_NAME}.drop()`)
  print('')
}

print('')

// Step 2: Information message
print('Step 2: Import instructions')
print('-'.repeat(40))
print('To import the AsanaActivity data, run ONE of these commands:')
print('')
print('Option 1 - Using mongoimport (RECOMMENDED):')
print('-'.repeat(40))
print('mongoimport --uri="YOUR_DATABASE_URL" \\')
print(`  --collection=${COLLECTION_NAME} \\`)
print(`  --file="${FILE_PATH}" \\`)
print('  --jsonArray \\')
print('  --drop')
print('')
print('Option 2 - Using mongoimport without dropping existing data:')
print('-'.repeat(40))
print('mongoimport --uri="YOUR_DATABASE_URL" \\')
print(`  --collection=${COLLECTION_NAME} \\`)
print(`  --file="${FILE_PATH}" \\`)
print('  --jsonArray')
print('')
print('Option 3 - Using Node.js script (see import-asana-activity.ts):')
print('-'.repeat(40))
print('npm run import:asana-activity')
print('')

print('='.repeat(60))
print('Script execution completed.')
print('='.repeat(60))
