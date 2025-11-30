/**
 * MongoDB Migration Script: Rename AsanaActivity Fields
 *
 * Purpose: Standardize field naming from legacy poseId/poseName to asanaId/asanaName
 * to align with SeriesActivity and SequenceActivity naming conventions.
 *
 * Changes:
 * - poseId → asanaId
 * - poseName → asanaName
 *
 * Usage:
 *   node scripts/migrations/rename-asana-activity-fields.js
 */

const { MongoClient } = require('mongodb')
require('dotenv').config()

// Configuration
const COLLECTION_NAME = 'AsanaActivity'

const uri =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI_v2 ||
  process.env.MONGODB_URI

if (!uri) {
  console.error(
    '❌ Error: Missing DATABASE_URL, MONGODB_URI_v2, or MONGODB_URI environment variable'
  )
  process.exit(1)
}

async function runMigration() {
  const client = new MongoClient(uri)

  try {
    console.log('='.repeat(60))
    console.log(
      'AsanaActivity Field Migration: poseId/poseName → asanaId/asanaName'
    )
    console.log('='.repeat(60))
    console.log('')

    // Connect to MongoDB
    await client.connect()
    console.log('✅ Connected to MongoDB')
    console.log('')

    const db = client.db()
    const collection = db.collection(COLLECTION_NAME)

    // Step 1: Pre-migration verification
    console.log('Step 1: Pre-migration verification')
    console.log('-'.repeat(40))

    const totalDocsBefore = await collection.countDocuments({})
    console.log(`Total documents in ${COLLECTION_NAME}: ${totalDocsBefore}`)

    const docsWithOldFields = await collection.countDocuments({
      $or: [{ poseId: { $exists: true } }, { poseName: { $exists: true } }],
    })
    console.log(
      `Documents with old field names (poseId/poseName): ${docsWithOldFields}`
    )

    const docsWithNewFields = await collection.countDocuments({
      $or: [{ asanaId: { $exists: true } }, { asanaName: { $exists: true } }],
    })
    console.log(
      `Documents with new field names (asanaId/asanaName): ${docsWithNewFields}`
    )

    if (docsWithOldFields === 0) {
      console.log('')
      console.log('⚠️  WARNING: No documents found with old field names.')
      console.log('Migration may have already been run or collection is empty.')
      console.log('')
      await client.close()
      return
    }

    console.log('')

    // Step 2: Execute migration
    console.log('Step 2: Executing field rename operation')
    console.log('-'.repeat(40))

    const startTime = new Date()

    // Use MongoDB's atomic $rename operator
    const result = await collection.updateMany(
      {},
      {
        $rename: {
          poseId: 'asanaId',
          poseName: 'asanaName',
        },
      }
    )

    const endTime = new Date()
    const duration = (endTime - startTime) / 1000

    console.log('✓ Migration completed successfully')
    console.log(`  - Documents matched: ${result.matchedCount}`)
    console.log(`  - Documents modified: ${result.modifiedCount}`)
    console.log(`  - Duration: ${duration.toFixed(2)} seconds`)
    console.log('')

    // Step 3: Post-migration verification
    console.log('Step 3: Post-migration verification')
    console.log('-'.repeat(40))

    const totalDocsAfter = await collection.countDocuments({})
    console.log(`Total documents in ${COLLECTION_NAME}: ${totalDocsAfter}`)

    const docsWithOldFieldsAfter = await collection.countDocuments({
      $or: [{ poseId: { $exists: true } }, { poseName: { $exists: true } }],
    })
    console.log(
      `Documents with old field names (poseId/poseName): ${docsWithOldFieldsAfter}`
    )

    const docsWithNewFieldsAfter = await collection.countDocuments({
      $or: [{ asanaId: { $exists: true } }, { asanaName: { $exists: true } }],
    })
    console.log(
      `Documents with new field names (asanaId/asanaName): ${docsWithNewFieldsAfter}`
    )

    console.log('')

    // Step 4: Validation checks
    console.log('Step 4: Validation checks')
    console.log('-'.repeat(40))

    let validationPassed = true

    // Check 1: Document count unchanged
    if (totalDocsBefore !== totalDocsAfter) {
      console.log(
        '✗ VALIDATION FAILED: Document count changed during migration'
      )
      console.log(`  Before: ${totalDocsBefore}, After: ${totalDocsAfter}`)
      validationPassed = false
    } else {
      console.log('✓ Document count unchanged')
    }

    // Check 2: No old field names remain
    if (docsWithOldFieldsAfter > 0) {
      console.log(
        '✗ VALIDATION FAILED: Some documents still have old field names'
      )
      console.log(
        `  ${docsWithOldFieldsAfter} documents still have poseId/poseName`
      )
      validationPassed = false
    } else {
      console.log('✓ All old field names removed')
    }

    // Check 3: New field names present (if there were documents to migrate)
    if (docsWithOldFields > 0 && docsWithNewFieldsAfter === 0) {
      console.log(
        '✗ VALIDATION FAILED: New field names not found after migration'
      )
      validationPassed = false
    } else if (docsWithOldFields > 0) {
      console.log('✓ All documents have new field names')
    }

    // Check 4: Sample document inspection
    console.log('')
    console.log('Sample document after migration:')
    const sampleDoc = await collection.findOne({})
    if (sampleDoc) {
      console.log(
        JSON.stringify(
          {
            id: sampleDoc._id,
            userId: sampleDoc.userId,
            asanaId: sampleDoc.asanaId,
            asanaName: sampleDoc.asanaName,
            hasOldPoseId: 'poseId' in sampleDoc,
            hasOldPoseName: 'poseName' in sampleDoc,
          },
          null,
          2
        )
      )
    } else {
      console.log('  (No documents in collection)')
    }

    console.log('')
    console.log('='.repeat(60))

    if (validationPassed) {
      console.log('✅ MIGRATION SUCCESSFUL')
      console.log('')
      console.log('Summary:')
      console.log(`  - ${result.modifiedCount} documents updated`)
      console.log(`  - All validations passed`)
      console.log(`  - poseId → asanaId`)
      console.log(`  - poseName → asanaName`)
    } else {
      console.log('⚠️  MIGRATION COMPLETED WITH WARNINGS')
      console.log('')
      console.log('Please review the validation failures above.')
      console.log('Manual intervention may be required.')
    }

    console.log('='.repeat(60))
  } catch (error) {
    console.error('')
    console.error('✗ ERROR: Migration failed!')
    console.error(`  Error message: ${error.message}`)
    console.error('')
    console.error('Migration aborted. Please review the error and try again.')
    throw error
  } finally {
    await client.close()
    console.log('')
    console.log('Database connection closed.')
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('Migration script completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1)
  })
