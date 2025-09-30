import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'
import { storageManager } from '../../../../lib/storage/manager'
import { AsanaOwnershipError } from '../../../utils/asanaOwnership'
import { ImageDeleteResponse } from '../../../../types/images'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const imageId = resolvedParams.id

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    // Find the image and verify ownership
    const image = await prisma.poseImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        userId: true,
        postureId: true,
        url: true,
        displayOrder: true,
        posture: {
          select: {
            id: true,
            isUserCreated: true,
            created_by: true,
          },
        },
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (image.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // For posture images, verify user owns the asana
    if (image.postureId && image.posture) {
      if (!image.posture.isUserCreated) {
        return NextResponse.json(
          {
            error: 'Cannot delete images from system asanas',
            code: 'SYSTEM_ASANA',
          },
          { status: 400 }
        )
      }

      if (image.posture.created_by !== session.user.id) {
        return NextResponse.json(
          {
            error: 'You can only delete images from asanas you created',
            code: 'UNAUTHORIZED',
          },
          { status: 403 }
        )
      }
    }

    // Delete from cloud storage using storage manager
    try {
      await storageManager.delete(image.url)
    } catch (error) {
      console.error('Failed to delete from cloud storage:', error)
      // Continue with database deletion even if cloud deletion fails
    }

    // For multi-image scenarios, we need to reorder remaining images
    if (image.postureId) {
      await prisma.$transaction(async (tx) => {
        // Delete the image from database
        await tx.poseImage.delete({
          where: { id: imageId },
        })

        // Get remaining images for this posture
        const remainingImages = await tx.poseImage.findMany({
          where: { postureId: image.postureId },
          orderBy: { displayOrder: 'asc' },
        })

        // Reorder remaining images to fill gaps (1, 2, 3 sequence)
        for (let i = 0; i < remainingImages.length; i++) {
          const newDisplayOrder = i + 1
          if (remainingImages[i].displayOrder !== newDisplayOrder) {
            await tx.poseImage.update({
              where: { id: remainingImages[i].id },
              data: { displayOrder: newDisplayOrder },
            })
          }
        }

        // Update imageCount cache on the asana
        if (image.postureId) {
          await tx.asanaPosture.update({
            where: { id: image.postureId },
            data: { imageCount: remainingImages.length },
          })
        }
      })

      // Fetch updated remaining images for response
      const updatedRemainingImages = await prisma.poseImage.findMany({
        where: { postureId: image.postureId },
        orderBy: { displayOrder: 'asc' },
      })

      const response: ImageDeleteResponse = {
        success: true,
        remainingImages: updatedRemainingImages.map((img) => ({
          ...img,
          postureId: img.postureId || undefined,
          postureName: img.postureName || undefined,
          altText: img.altText || undefined,
          fileName: img.fileName || undefined,
          fileSize: img.fileSize || undefined,
          localStorageId: img.localStorageId || undefined,
        })),
        newImageCount: updatedRemainingImages.length,
        message: `Image deleted successfully. ${updatedRemainingImages.length} images remaining.`,
      }

      return NextResponse.json(response)
    } else {
      // For non-posture images, simple deletion
      await prisma.poseImage.delete({
        where: { id: imageId },
      })

      const response: ImageDeleteResponse = {
        success: true,
        remainingImages: [],
        newImageCount: 0,
        message: 'Image deleted successfully',
      }

      return NextResponse.json(response)
    }
  } catch (error) {
    console.error('Delete image error:', error)

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
        error: 'Internal server error during image deletion',
        success: false,
      },
      { status: 500 }
    )
  }
}
