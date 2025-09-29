import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

/**
 * POST /api/images/fix-orphaned
 * Links orphaned images to their corresponding asanas
 */
export async function POST() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log(
      '🔍 Looking for orphaned images that need to be linked to asanas...'
    )

    // Find images that have postureName but no postureId
    const orphanedImages = await prisma.poseImage.findMany({
      where: {
        userId: session.user.id, // Only fix current user's images
        postureId: null,
        postureName: {
          not: null,
        },
      },
    })

    console.log(
      `Found ${orphanedImages.length} orphaned images for user ${session.user.id}`
    )

    if (orphanedImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orphaned images found',
        linkedCount: 0,
        errorCount: 0,
      })
    }

    let linkedCount = 0
    let errorCount = 0
    const results = []

    for (const image of orphanedImages) {
      try {
        // Find the asana with matching name
        const matchingAsana = await prisma.asanaPosture.findFirst({
          where: {
            sort_english_name: image.postureName!,
          },
        })

        if (matchingAsana) {
          // Update the image with the postureId
          await prisma.poseImage.update({
            where: {
              id: image.id,
            },
            data: {
              postureId: matchingAsana.id.toString(),
            },
          })

          console.log(
            `✅ Linked image ${image.id} to asana "${matchingAsana.sort_english_name}" (ID: ${matchingAsana.id})`
          )
          linkedCount++
          results.push({
            imageId: image.id,
            asanaName: matchingAsana.sort_english_name,
            asanaId: matchingAsana.id,
            status: 'linked',
          })
        } else {
          console.log(
            `❌ No matching asana found for image ${image.id} with postureName: "${image.postureName}"`
          )
          errorCount++
          results.push({
            imageId: image.id,
            postureName: image.postureName,
            status: 'no_match',
          })
        }
      } catch (error) {
        console.error(`❌ Error processing image ${image.id}:`, error)
        errorCount++
        results.push({
          imageId: image.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    console.log('\n📊 Summary:')
    console.log(`  - Successfully linked: ${linkedCount} images`)
    console.log(`  - Errors: ${errorCount} images`)
    console.log(`  - Total processed: ${orphanedImages.length} images`)

    return NextResponse.json({
      success: true,
      message: `Processed ${orphanedImages.length} orphaned images`,
      linkedCount,
      errorCount,
      results,
    })
  } catch (error) {
    console.error('❌ Error in fix-orphaned images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
