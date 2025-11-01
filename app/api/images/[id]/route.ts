import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'
import { storageManager } from '../../../../lib/storage/manager'
import { AsanaOwnershipError } from '../../../utils/asanaOwnership'
import { ImageDeleteResponse } from '../../../../types/images'

// use shared prisma client

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
    // Fetch the full record (no `select`) to avoid mismatched generated client types
    // while renames (pose -> pose) are in progress.
    const image: any = await prisma.poseImage.findUnique({
      where: { id: imageId },
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

    // Resolve pose/pose IDs and relation object so we work with either schema
    // Support both `poseId`/`pose` and a renamed variant `asanaId`/`asana`.
    const attachedPoseId =
      (image as any).poseId ?? (image as any).asanaId ?? null

    const poseObj = (image as any).pose ?? (image as any).asana ?? null

    // For pose/pose images, verify user owns the asana
    if (attachedPoseId && poseObj) {
      console.log('🗑️ Asana check:', {
        poseId: attachedPoseId,
        isUserCreated: poseObj.isUserCreated,
        created_by: poseObj.created_by,
        sessionEmail: session.user.email,
        emailMatch: poseObj.created_by === session.user.email,
      })

      if (!poseObj.isUserCreated) {
        // Check if user created it by email match, even if isUserCreated is false
        if (poseObj.created_by === session.user.email) {
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

      if (poseObj.created_by !== session.user.email) {
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
    if (attachedPoseId) {
      await prisma.$transaction(async (tx: any) => {
        // Delete the image from database
        await tx.poseImage.delete({
          where: { id: imageId },
        })

        // Get remaining images for this pose (support both `poseId` and `asanaId`)
        const whereClause: any = {}
        if ((image as any).poseId) {
          whereClause.poseId = (image as any).poseId
        } else if ((image as any).asanaId) {
          whereClause.poseId = (image as any).asanaId
        }

        const remainingImages = await tx.poseImage.findMany({
          where: whereClause,
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

        // Update imageCount cache on the asana/pose.
        // Be tolerant of a Prisma model rename from `asana` -> `asanaPose` (or vice versa).
        if (attachedPoseId) {
          const newCount = remainingImages.length
          try {
            // Try the newer model name first (asanaPose)
            await tx.asanaPose.update({
              where: { id: attachedPoseId },
              data: { imageCount: newCount },
            })
          } catch (e1) {
            try {
              // Fallback to the original model name (asana)
              await tx.asana.update({
                where: { id: attachedPoseId },
                data: { imageCount: newCount },
              })
            } catch (e2) {
              // If both fail, log a warning but don't fail the whole transaction.
              console.warn(
                'Warning: failed to update asana/asanaPose.imageCount. Please ensure Prisma client matches schema rename.',
                e1,
                e2
              )
            }
          }
        }
      })

      // Fetch updated remaining images for response
      const updatedWhere: any = {}
      if ((image as any).poseId) {
        updatedWhere.poseId = (image as any).poseId
      } else if ((image as any).asanaId) {
        updatedWhere.poseId = (image as any).asanaId
      }

      const updatedRemainingImages = await prisma.poseImage.findMany({
        where: updatedWhere,
        orderBy: { displayOrder: 'asc' },
      })

      const response: ImageDeleteResponse = {
        success: true,
        remainingImages: updatedRemainingImages.map((img: any) => ({
          ...img,
          poseId: img.poseId ?? img.asanaId ?? undefined,
          poseName: img.poseName ?? img.asanaName ?? undefined,
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
      // For non-pose images, simple deletion
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
