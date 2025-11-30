/**
 * Migration Script: Sync Series Images
 *
 * This script synchronizes the legacy `image` field with the first image
 * from the `images` array for all AsanaSeries documents in the database.
 *
 * Run this script to fix existing series that have images uploaded but
 * the legacy `image` field wasn't synced.
 *
 * Usage:
 *   npx ts-node scripts/sync-series-images.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function syncSeriesImages() {
  console.log('🔄 Starting series image synchronization...\n')

  try {
    // Find all series with images array
    const allSeries = await prisma.asanaSeries.findMany({
      select: {
        id: true,
        seriesName: true,
        image: true,
        images: true,
      },
    })

    console.log(`📊 Found ${allSeries.length} total series\n`)

    let updatedCount = 0
    let skippedCount = 0
    let clearedCount = 0

    for (const series of allSeries) {
      const images = series.images || []
      const firstImage = images[0] || null
      const currentImage = series.image || null

      // Case 1: Images array has content but image field is out of sync
      if (images.length > 0 && firstImage !== currentImage) {
        await prisma.asanaSeries.update({
          where: { id: series.id },
          data: {
            image: firstImage,
            updatedAt: new Date(),
          },
        })
        console.log(`✅ Updated: ${series.seriesName}`)
        console.log(`   Image field set to: ${firstImage}\n`)
        updatedCount++
      }
      // Case 2: Images array is empty but image field has a value
      else if (images.length === 0 && currentImage !== null) {
        await prisma.asanaSeries.update({
          where: { id: series.id },
          data: {
            image: null,
            updatedAt: new Date(),
          },
        })
        console.log(`🧹 Cleared: ${series.seriesName}`)
        console.log(`   Image field cleared (no images in array)\n`)
        clearedCount++
      }
      // Case 3: Already in sync
      else {
        skippedCount++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📈 Synchronization Summary:')
    console.log('='.repeat(60))
    console.log(`✅ Updated:  ${updatedCount} series`)
    console.log(`🧹 Cleared:  ${clearedCount} series`)
    console.log(`⏭️  Skipped:  ${skippedCount} series (already synced)`)
    console.log(`📊 Total:    ${allSeries.length} series`)
    console.log('='.repeat(60) + '\n')

    console.log('✨ Series image synchronization completed successfully!\n')
  } catch (error) {
    console.error('❌ Error during synchronization:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
syncSeriesImages()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
