#!/usr/bin/env node

/**
 * Migration Script: Fix UserLogin Records with Wrong UserId
 *
 * This script migrates existing UserLogin records that were created with
 * OAuth provider IDs to use the correct UserData MongoDB ObjectIds.
 */

const { PrismaClient } = require('../prisma/generated/client')

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
  errorFormat: 'pretty',
})

async function migrateUserLoginRecords() {
  try {
    console.log('🔄 UserLogin Records Migration')
    console.log('=' * 50)
    console.log('🕐 Migration Time:', new Date().toISOString())
    console.log('')

    // Step 1: Find all UserData records with provider_id
    console.log('Step 1: Finding UserData records with provider_id...')
    const usersWithProviderIds = await prisma.userData.findMany({
      where: {
        provider_id: { not: null },
      },
      select: {
        id: true,
        email: true,
        provider_id: true,
      },
    })

    console.log(`Found ${usersWithProviderIds.length} users with provider_id`)
    console.log('')

    if (usersWithProviderIds.length === 0) {
      console.log('✅ No migration needed - no users with provider_id found')
      return
    }

    // Step 2: Check for mismatched UserLogin records
    console.log('Step 2: Checking for UserLogin records to migrate...')
    let totalMigrated = 0
    let totalErrors = 0

    for (const user of usersWithProviderIds) {
      console.log(`\nProcessing user: ${user.email}`)
      console.log(`  UserData ID: ${user.id}`)
      console.log(`  Provider ID: ${user.provider_id}`)

      // Check if there are UserLogin records with provider_id
      const wrongRecords = await prisma.userLogin.findMany({
        where: { userId: user.provider_id },
      })

      // Check if there are already correct records with userData.id
      const correctRecords = await prisma.userLogin.findMany({
        where: { userId: user.id },
      })

      console.log(
        `  UserLogin records with provider_id: ${wrongRecords.length}`
      )
      console.log(
        `  UserLogin records with userData.id: ${correctRecords.length}`
      )

      if (wrongRecords.length === 0) {
        console.log('  ✅ No migration needed for this user')
        continue
      }

      if (correctRecords.length > 0) {
        console.log(
          '  ⚠️  User already has correct records. Need to decide what to do.'
        )
        console.log('  Options: merge, keep newest, or manual review')

        // For safety, we'll skip automatic migration if correct records exist
        console.log('  🛑 Skipping automatic migration - manual review needed')
        continue
      }

      // Migrate the records
      console.log(`  🔄 Migrating ${wrongRecords.length} records...`)

      try {
        // Update all records from provider_id to userData.id
        const updateResult = await prisma.userLogin.updateMany({
          where: { userId: user.provider_id },
          data: { userId: user.id },
        })

        console.log(`  ✅ Successfully migrated ${updateResult.count} records`)
        totalMigrated += updateResult.count

        // Verify the migration
        const verifyCount = await prisma.userLogin.count({
          where: { userId: user.id },
        })
        console.log(
          `  ✅ Verification: ${verifyCount} records now use correct userId`
        )
      } catch (error) {
        console.error(
          `  ❌ Migration failed for user ${user.email}:`,
          error.message
        )
        totalErrors++
      }
    }

    console.log('')
    console.log('Migration Summary:')
    console.log('=' * 30)
    console.log(`Total records migrated: ${totalMigrated}`)
    console.log(`Migration errors: ${totalErrors}`)
    console.log('')

    if (totalMigrated > 0) {
      console.log('✅ Migration completed successfully!')
      console.log('🔄 Next steps:')
      console.log('1. Test the login streak functionality')
      console.log('2. Deploy the updated auth.ts to production')
      console.log('3. Monitor for any remaining issues')
    } else {
      console.log('ℹ️  No records needed migration.')
    }

    // Step 3: Final verification
    console.log('')
    console.log('Step 3: Final verification...')

    for (const user of usersWithProviderIds) {
      const finalCount = await prisma.userLogin.count({
        where: { userId: user.id },
      })

      if (finalCount > 0) {
        const latest = await prisma.userLogin.findFirst({
          where: { userId: user.id },
          orderBy: { loginAt: 'desc' },
        })

        console.log(
          `✅ ${user.email}: ${finalCount} records, latest: ${latest.loginAt.toISOString()}`
        )
      } else {
        console.log(`❌ ${user.email}: No UserLogin records found!`)
      }
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.error('Error details:', error.message)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Safety check - require confirmation
const args = process.argv.slice(2)
if (!args.includes('--confirm')) {
  console.log(
    '⚠️  IMPORTANT: This script will modify UserLogin records in the database!'
  )
  console.log('')
  console.log('This migration will:')
  console.log('1. Find UserLogin records using OAuth provider IDs')
  console.log('2. Update them to use the correct UserData MongoDB ObjectIds')
  console.log('3. This fixes the login streak functionality in production')
  console.log('')
  console.log('To run the migration, add --confirm flag:')
  console.log(
    'DATABASE_URL="your-url" node scripts/migrate-userlogin-records.js --confirm'
  )
  console.log('')
  console.log('⚠️  BACKUP YOUR DATABASE BEFORE RUNNING THIS MIGRATION!')
  process.exit(0)
}

console.log('Starting UserLogin records migration...')
migrateUserLoginRecords().catch(console.error)
