import prisma from '@app/prisma/generated/client'
import {
  verifyAsanaOwnership,
  AsanaOwnershipError,
} from '@app/utils/asanaOwnership'
import { NextRequest, NextResponse } from 'next/server'
import { ImageReorderRequest, ImageReorderResponse } from 'types/images'
import { auth } from '../../../../../../auth'

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: postureId } = context.params
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'You must be logged in to reorder images.',
          code: 'UNAUTHENTICATED',
        },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { images }: ImageReorderRequest = body

    // Validate input
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        {
          error: 'Request body must contain an array of images.',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      )
    }

    const imageIds = images.map((img) => img.imageId)

    // Verify user owns the asana
    try {
      await verifyAsanaOwnership(postureId, session.user.id)
    } catch (error) {
      if (error instanceof AsanaOwnershipError) {
        return NextResponse.json(
          {
            error: error.message,
            code: 'FORBIDDEN',
          },
          { status: 403 }
        )
      }
      // Handle other potential errors from verifyAsanaOwnership
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          code: 'VERIFICATION_FAILED',
        },
        { status: 500 }
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

    // Check if all images belong to the same posture
    if (
      imageDetails.some(
        (img: { postureId: string | null }) => img.postureId !== postureId
      )
    ) {
      return NextResponse.json(
        {
          error: 'All images must belong to the same posture',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      )
    }

    // Perform the update in a transaction
    await prisma.$transaction(
      images.map((img) =>
        prisma.poseImage.update({
          where: { id: img.imageId },
          data: { displayOrder: img.displayOrder },
        })
      )
    )

    // Refetch the updated images to get the full data
    const updatedImages = await prisma.poseImage.findMany({
      where: {
        id: { in: imageIds },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })
    // Construct the response
    const response: ImageReorderResponse = {
      success: true,
      message: 'Image order updated successfully',
      images: updatedImages.map((img) => {
        const {
          altText,
          fileName,
          fileSize,
          postureId,
          postureName,
          localStorageId,
          ...rest
        } = img
        return {
          ...rest,
          altText: altText ?? undefined,
          fileName: fileName ?? undefined,
          fileSize: fileSize ?? undefined,
          postureId: postureId ?? undefined,
          postureName: postureName ?? undefined,
          // convert nullable DB fields (e.g. null) to undefined so they match PoseImageData types
          localStorageId: localStorageId ?? undefined,
        }
      }),
    }
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error reordering images:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
