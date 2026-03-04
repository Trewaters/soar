import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'

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

    // Find images that have poseName (may be orphaned). We'll look for missing poseId
    // Current Prisma schema uses `poseName`/`poseId`
    const imagesWithName = await prisma.poseImage.findMany({
      where: {
        userId: session.user.id, // Only fix current user's images
        poseName: {
          not: null,
        },
      },
    })

    // Filter images that are missing poseId
    const orphanedImages = imagesWithName.filter((img: any) => {
      return !img.poseId
    })

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
        const imageName = (image as any).poseName

        const matchingAsana = await prisma.asanaPose.findFirst({
          where: {
            sort_english_name: imageName,
          },
        })

        if (matchingAsana) {
          // Update the image with the poseId (schema uses poseId)
          await prisma.poseImage.update({
            where: { id: image.id },
            data: { poseId: matchingAsana.id.toString() } as any,
          })

          linkedCount++
          results.push({
            imageId: image.id,
            asanaName: matchingAsana.sort_english_name,
            asanaId: matchingAsana.id,
            status: 'linked',
          })
        } else {
          errorCount++
          results.push({
            imageId: image.id,
            poseName: imageName,
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
  }
}
