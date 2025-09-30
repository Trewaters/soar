import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'
import {
  verifyAsanaOwnership,
  verifyMultipleImageOwnership,
  validateDisplayOrders,
  AsanaOwnershipError,
} from '../../../utils/asanaOwnership'
import {
  ImageReorderRequest,
  ImageReorderResponse,
} from '../../../../types/images'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { images }: ImageReorderRequest = body

    // Validate input
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Images array is required' },
        { status: 400 }
      )
    }

    // Validate each image entry
    for (const img of images) {
      if (!img.imageId || typeof img.displayOrder !== 'number') {
        return NextResponse.json(
          { error: 'Each image must have imageId and displayOrder' },
          { status: 400 }
        )
      }
    }

    // Extract image IDs and display orders
    const imageIds = images.map((img) => img.imageId)
    const displayOrders = images.map((img) => img.displayOrder)

    // Validate display orders (unique, 1-3 range)
    if (!validateDisplayOrders(displayOrders)) {
      return NextResponse.json(
        {
          error: 'Display orders must be unique and between 1-3',
        },
        { status: 400 }
      )
    }

    // Verify user owns all the images
    const ownsAllImages = await verifyMultipleImageOwnership(
      imageIds,
      session.user.id
    )

    if (!ownsAllImages) {
      return NextResponse.json(
        {
          error: 'You can only reorder images you own',
          code: 'UNAUTHORIZED',
        },
        { status: 403 }
      )
    }

    // Get the images to verify they belong to the same posture
    const imageDetails = await prisma.poseImage.findMany({
      where: {
        id: { in: imageIds },
      },
      select: {
        id: true,
        postureId: true,
        userId: true,
      },
    })

    // Check if all images exist
    if (imageDetails.length !== imageIds.length) {
      return NextResponse.json(
        { error: 'Some images not found' },
        { status: 404 }
      )
    }

    // Verify all images belong to the same posture
    const postureIds = new Set(imageDetails.map((img) => img.postureId))
    if (postureIds.size > 1) {
      return NextResponse.json(
        {
          error: 'All images must belong to the same asana',
        },
        { status: 400 }
      )
    }

    const postureId = imageDetails[0].postureId
    if (!postureId) {
      return NextResponse.json(
        {
          error: 'Cannot reorder images not associated with an asana',
        },
        { status: 400 }
      )
    }

    // Verify user owns the asana
    const ownsAsana = await verifyAsanaOwnership(postureId, session.user.id)
    if (!ownsAsana) {
      return NextResponse.json(
        {
          error: 'You can only reorder images for asanas you created',
          code: 'UNAUTHORIZED',
        },
        { status: 403 }
      )
    }

    // Perform the reordering in a transaction
    await prisma.$transaction(async (tx) => {
      // Update each image with its new display order
      for (const img of images) {
        await tx.poseImage.update({
          where: { id: img.imageId },
          data: { displayOrder: img.displayOrder },
        })
      }
    })

    // Fetch the updated images for response
    const updatedImages = await prisma.poseImage.findMany({
      where: {
        postureId,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    const response: ImageReorderResponse = {
      success: true,
      images: updatedImages.map((img) => ({
        ...img,
        postureId: img.postureId || undefined,
        postureName: img.postureName || undefined,
        altText: img.altText || undefined,
        fileName: img.fileName || undefined,
        fileSize: img.fileSize || undefined,
        localStorageId: img.localStorageId || undefined,
      })),
      message: 'Images reordered successfully',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Image reorder error:', error)

    // Handle specific error types
    if (error instanceof AsanaOwnershipError) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'UNAUTHORIZED',
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error during image reordering',
        success: false,
      },
      { status: 500 }
    )
  }
}
