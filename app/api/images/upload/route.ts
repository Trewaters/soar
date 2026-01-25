import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'
import { storageManager } from '../../../../lib/storage/manager'
import {
  getNextDisplayOrder,
  ImageLimitError,
  AsanaOwnershipError,
  SystemAsanaError,
} from '../../../utils/asanaOwnership'
import {
  MAX_IMAGES_PER_ASANA,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ImageUploadResponse,
} from '../../../../types/images'

// use shared prisma client

// Force this route to be dynamic since it requires query parameters and authentication
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters for image status
    const { searchParams } = new URL(request.url)
    const poseId = searchParams.get('poseId')

    if (!poseId) {
      return NextResponse.json({ error: 'poseId required' }, { status: 400 })
    }

    // Get the asana to check ownership and image count
    const asana = await prisma.asanaPose.findUnique({
      where: { id: poseId },
      select: {
        id: true,
        isUserCreated: true,
        imageCount: true,
        created_by: true,
      },
    })

    if (!asana) {
      return NextResponse.json({ error: 'Asana not found' }, { status: 404 })
    }

    // Use backwards compatible ownership check
    const sessionEmail = session.user.email
    const isUserOwned = asana.created_by === sessionEmail

    // Check if user can manage images (user-created or user is the creator)
    const canManage = isUserOwned && Boolean(asana.created_by)

    if (!canManage) {
      return NextResponse.json(
        { error: 'You can only manage images for your own asanas' },
        { status: 403 }
      )
    }

    // Return image status
    return NextResponse.json({
      canUpload: true,
      currentCount: asana.imageCount || 0,
      maxImages: MAX_IMAGES_PER_ASANA,
      remainingSlots: MAX_IMAGES_PER_ASANA - (asana.imageCount || 0),
    })
  } catch (error) {
    console.error('Error getting image status:', error)
    return NextResponse.json(
      { error: 'Failed to get image status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Debug environment variables
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string
    const userId = formData.get('userId') as string
    const poseId = formData.get('poseId') as string
    const poseName = formData.get('poseName') as string
    const imageType = (formData.get('imageType') as string) || 'pose'
    const displayOrderParam = formData.get('displayOrder') as string

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (userId !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Validate file type using constants
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Only ${ALLOWED_IMAGE_TYPES.join(', ')} are allowed.`,
        },
        { status: 400 }
      )
    }

    // Validate file size using constants
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        },
        { status: 400 }
      )
    }

    // For pose images, validate multi-image constraints
    if (poseId && imageType === 'pose') {
      // Get the asana to check if it's user-created and current image count
      const asana = await prisma.asanaPose.findUnique({
        where: { id: poseId },
        select: {
          id: true,
          isUserCreated: true,
          imageCount: true,
          created_by: true,
        },
      })

      if (!asana) {
        return NextResponse.json({ error: 'Asana not found' }, { status: 404 })
      }

      // Use backwards compatible ownership check
      const sessionEmail = session.user.email
      const isUserOwned = asana.created_by === sessionEmail

      // Backwards compatible system asana detection
      const isSystemAsana = !Boolean(asana.created_by)

      // Check if this is a system asana (no images allowed)
      if (isSystemAsana) {
        throw new SystemAsanaError(
          'Cannot upload images to system asanas. Only user-created asanas support images.'
        )
      }

      // Check ownership
      if (!isUserOwned) {
        throw new AsanaOwnershipError(
          'You can only upload images to your own asanas.',
          'OWNERSHIP_ERROR'
        )
      }

      // Calculate maxImages using backwards compatible logic
      const maxImages = Boolean(asana.created_by) ? MAX_IMAGES_PER_ASANA : 0

      // Check image limit
      const currentImageCount = asana.imageCount || 0
      if (currentImageCount >= maxImages) {
        throw new ImageLimitError(
          `Maximum of ${maxImages} images allowed per asana`,
          currentImageCount,
          maxImages
        )
      }
    }

    // Determine the display order
    let displayOrder = 1
    if (displayOrderParam) {
      displayOrder = parseInt(displayOrderParam)
    } else if (poseId && imageType === 'pose') {
      displayOrder = await getNextDisplayOrder(poseId)
    }

    // Convert file to buffer for upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const filename = `${imageType}_${timestamp}_${randomString}.${fileExtension}`

    // Upload to storage
    const uploadResult = await storageManager.upload(filename, buffer, {
      access: 'public',
    })

    // Get the user's ObjectId from the database using their email
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Save image metadata to database
    const imageData = {
      userId: user.id, // Use the ObjectId, not the email
      created_by: user.id, // Set ownership
      fileName: filename,
      altText: altText || `${poseName || imageType} image`,
      fileSize: file.size,
      imageType: imageType,
      url: uploadResult.url,
      displayOrder: displayOrder,
      ...(poseId && { poseId }),
      ...(poseName && { poseName }),
    }

    const savedImage = await prisma.poseImage.create({
      data: imageData,
    })

    // Update asana image count if this is a pose image
    if (poseId && imageType === 'pose') {
      await prisma.asanaPose.update({
        where: { id: poseId },
        data: {
          imageCount: {
            increment: 1,
          },
        },
      })
    }

    const response: ImageUploadResponse = {
      id: savedImage.id,
      url: savedImage.url,
      altText: savedImage.altText || undefined,
      fileName: savedImage.fileName || undefined,
      fileSize: savedImage.fileSize || undefined,
      uploadedAt: savedImage.uploadedAt,
      storageType: savedImage.storageType,
      imageType: savedImage.imageType,
      displayOrder: savedImage.displayOrder,
      remainingSlots: MAX_IMAGES_PER_ASANA - 1,
      totalImages: 1,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Enhanced image upload error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      errorObject: error,
    })

    // Handle specific error types
    if (error instanceof ImageLimitError) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'LIMIT_EXCEEDED',
          current: error.current,
          limit: error.limit,
        },
        { status: 400 }
      )
    }

    if (error instanceof AsanaOwnershipError) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'UNAUTHORIZED',
        },
        { status: 403 }
      )
    }

    if (error instanceof SystemAsanaError) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'SYSTEM_ASANA',
        },
        { status: 400 }
      )
    }

    // Return error with more detailed information for debugging
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      {
        error: 'Image upload failed',
        details: errorMessage,
        canFallbackToLocal: true,
        debugInfo:
          process.env.NODE_ENV === 'development'
            ? {
                errorType: typeof error,
                errorMessage: errorMessage,
                timestamp: new Date().toISOString(),
              }
            : undefined,
      },
      { status: 500 }
    )
  }
}
