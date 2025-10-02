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
    console.log('🗑️ DELETE /api/images/[id] called')

    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('🗑️ User email:', session.user.email)

    // Find the user to get their ObjectID

    const resolvedParams = await params
    const imageId = resolvedParams.id

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    // Find the image first so we can return image-specific errors before
    // attempting to resolve the user record.
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

    // Find the user to get their ObjectID
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('🗑️ User ObjectID:', user.id)

    console.log('🗑️ Ownership check:', {
      imageUserId: image.userId,
      userObjectId: user.id,
      match: image.userId === user.id,
    })

    if (image.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // For posture images, verify user owns the asana
    if (image.postureId && image.posture) {
      console.log('🗑️ Asana check:', {
        postureId: image.postureId,
        isUserCreated: image.posture.isUserCreated,
        created_by: image.posture.created_by,
        sessionEmail: session.user.email,
        emailMatch: image.posture.created_by === session.user.email,
      })

      if (!image.posture.isUserCreated) {
        // Check if user created it by email match, even if isUserCreated is false
        if (image.posture.created_by === session.user.email) {
          console.log(
            '🗑️ Allowing deletion: user created asana even though isUserCreated is false'
          )
        } else {
          return NextResponse.json(
            {
              error: 'Cannot delete images from system asanas',
              code: 'SYSTEM_ASANA',
            },
            { status: 400 }
          )
        }
      }

      if (image.posture.created_by !== session.user.email) {
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
      await prisma.$transaction(async (tx: any) => {
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
        remainingImages: updatedRemainingImages.map((img: any) => ({
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
