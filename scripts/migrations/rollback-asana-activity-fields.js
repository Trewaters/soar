/**
 * MongoDB Migration Rollback Script: Rollback AsanaActivity Fields
 *
 * Purpose: Rollback field naming from asanaId/asanaName to poseId/poseName
 *
 * Changes:
 * - asanaId → poseId
 * - asanaName → poseName
 *
 * Usage:
 *   node scripts/migrations/rollback-asana-activity-fields.js
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

async function runRollback() {
  const client = new MongoClient(uri)

  try {
    console.log('='.repeat(60))
    console.log(
      'AsanaActivity Field ROLLBACK: asanaId/asanaName → poseId/poseName'
    )
    console.log('='.repeat(60))
    console.log('')

    // Connect to MongoDB
    await client.connect()
    console.log('✅ Connected to MongoDB')
    console.log('')

    const db = client.db()
    const collection = db.collection(COLLECTION_NAME)

    // Step 1: Pre-rollback verification
    console.log('Step 1: Pre-rollback verification')
    console.log('-'.repeat(40))

    const totalDocsBefore = await collection.countDocuments({})
    console.log(`Total documents in ${COLLECTION_NAME}: ${totalDocsBefore}`)

    const docsWithNewFields = await collection.countDocuments({
      $or: [{ asanaId: { $exists: true } }, { asanaName: { $exists: true } }],
    })
    console.log(
      `Documents with new field names (asanaId/asanaName): ${docsWithNewFields}`
    )

    const docsWithOldFields = await collection.countDocuments({
      $or: [{ poseId: { $exists: true } }, { poseName: { $exists: true } }],
    })
    console.log(
      `Documents with old field names (poseId/poseName): ${docsWithOldFields}`
    )

    if (docsWithNewFields === 0) {
      console.log('')
      console.log('⚠️  WARNING: No documents found with new field names.')
      console.log('Rollback may have already been run or collection is empty.')
      console.log('')
      await client.close()
      return
    }

    console.log('')

    // Step 2: Execute rollback
    console.log('Step 2: Executing field rename rollback')
    console.log('-'.repeat(40))

    const startTime = new Date()

    // Use MongoDB's atomic $rename operator
    const result = await collection.updateMany(
      {},
      {
        $rename: {
          asanaId: 'poseId',
          asanaName: 'poseName',
        },
      }
    )

    const endTime = new Date()
    const duration = (endTime - startTime) / 1000

    console.log('✓ Rollback completed successfully')
    console.log(`  - Documents matched: ${result.matchedCount}`)
    console.log(`  - Documents modified: ${result.modifiedCount}`)
    console.log(`  - Duration: ${duration.toFixed(2)} seconds`)
    console.log('')

    // Step 3: Post-rollback verification
    console.log('Step 3: Post-rollback verification')
    console.log('-'.repeat(40))

    const totalDocsAfter = await collection.countDocuments({})
    console.log(`Total documents in ${COLLECTION_NAME}: ${totalDocsAfter}`)

    const docsWithNewFieldsAfter = await collection.countDocuments({
      $or: [{ asanaId: { $exists: true } }, { asanaName: { $exists: true } }],
    })
    console.log(
      `Documents with new field names (asanaId/asanaName): ${docsWithNewFieldsAfter}`
    )

    const docsWithOldFieldsAfter = await collection.countDocuments({
      $or: [{ poseId: { $exists: true } }, { poseName: { $exists: true } }],
    })
    console.log(
      `Documents with old field names (poseId/poseName): ${docsWithOldFieldsAfter}`
    )

    console.log('')

    // Step 4: Validation checks
    console.log('Step 4: Validation checks')
    console.log('-'.repeat(40))

    let validationPassed = true

    // Check 1: Document count unchanged
    if (totalDocsBefore !== totalDocsAfter) {
      console.log('✗ VALIDATION FAILED: Document count changed during rollback')
      console.log(`  Before: ${totalDocsBefore}, After: ${totalDocsAfter}`)
      validationPassed = false
    } else {
      console.log('✓ Document count unchanged')
    }

    // Check 2: No new field names remain
    if (docsWithNewFieldsAfter > 0) {
      console.log(
        '✗ VALIDATION FAILED: Some documents still have new field names'
      )
      console.log(
        `  ${docsWithNewFieldsAfter} documents still have asanaId/asanaName`
      )
      validationPassed = false
    } else {
      console.log('✓ All new field names removed')
    }

    // Check 3: Old field names present (if there were documents to rollback)
    if (docsWithNewFields > 0 && docsWithOldFieldsAfter === 0) {
      console.log(
        '✗ VALIDATION FAILED: Old field names not found after rollback'
      )
      validationPassed = false
    } else if (docsWithNewFields > 0) {
      console.log('✓ All documents have old field names restored')
    }

    // Check 4: Sample document inspection
    console.log('')
    console.log('Sample document after rollback:')
    const sampleDoc = await collection.findOne({})
    if (sampleDoc) {
      console.log(
        JSON.stringify(
          {
            id: sampleDoc._id,
            userId: sampleDoc.userId,
            poseId: sampleDoc.poseId,
            poseName: sampleDoc.poseName,
            hasNewAsanaId: 'asanaId' in sampleDoc,
            hasNewAsanaName: 'asanaName' in sampleDoc,
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
      console.log('✅ ROLLBACK SUCCESSFUL')
      console.log('')
      console.log('Summary:')
      console.log(`  - ${result.modifiedCount} documents rolled back`)
      console.log(`  - All validations passed`)
      console.log(`  - asanaId → poseId`)
      console.log(`  - asanaName → poseName`)
      console.log('')
      console.log(
        '⚠️  WARNING: Remember to revert your application code as well!'
      )
      console.log('   The application expects the old field names now.')
    } else {
      console.log('⚠️  ROLLBACK COMPLETED WITH WARNINGS')
      console.log('')
      console.log('Please review the validation failures above.')
      console.log('Manual intervention may be required.')
    }

    console.log('='.repeat(60))
  } catch (error) {
    console.error('')
    console.error('✗ ERROR: Rollback failed!')
    console.error(`  Error message: ${error.message}`)
    console.error('')
    console.error('Rollback aborted. Please review the error and try again.')
    throw error
  } finally {
    await client.close()
    console.log('')
    console.log('Database connection closed.')
  }
}

// Run the rollback
runRollback()
  .then(() => {
    console.log('Rollback script completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Rollback script failed:', error)
    process.exit(1)
  })
