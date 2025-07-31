import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'
import { storageManager } from '../../../../lib/storage/manager'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires query parameters and authentication
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
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
    const postureId = formData.get('postureId') as string
    const postureName = formData.get('postureName') as string
    const imageType = (formData.get('imageType') as string) || 'posture'

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Upload using storage manager (handles provider switching automatically)
    const uploadResult = await storageManager.upload(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    console.log('Storage upload successful:', {
      provider: storageManager.getActiveProvider().name,
      url: uploadResult.url,
      size: uploadResult.size,
      fileName: uploadResult.fileName,
    })

    // Save to database with cloud storage info
    const poseImage = await prisma.poseImage.create({
      data: {
        userId,
        postureId: postureId || null,
        postureName: postureName || null,
        url: uploadResult.url,
        altText: altText || null,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.size,
        storageType: 'CLOUD',
        cloudflareId: uploadResult.metadata?.cloudflareId || null, // Store provider-specific ID
        isOffline: false,
        imageType,
      },
    })

    return NextResponse.json({
      id: poseImage.id,
      url: poseImage.url,
      altText: poseImage.altText,
      fileName: poseImage.fileName,
      fileSize: poseImage.fileSize,
      uploadedAt: poseImage.uploadedAt,
      storageType: poseImage.storageType,
      imageType: poseImage.imageType,
    })
  } catch (error) {
    console.error('Storage upload error:', error)

    // Return error with fallback option (keeps your existing fallback system)
    return NextResponse.json(
      {
        error: 'Cloud storage upload failed',
        canFallbackToLocal: true,
        details:
          'Upload to cloud storage failed. You can save this image locally instead.',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve user's uploaded images
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const postureId = searchParams.get('postureId')
    const postureName = searchParams.get('postureName')
    const imageType = searchParams.get('imageType')

    // Build where clause
    const whereClause: any = {
      userId: session.user.id,
    }

    // Add posture filter if provided
    if (postureId) {
      whereClause.postureId = postureId
    } else if (postureName) {
      whereClause.postureName = postureName
    }
    if (imageType) {
      whereClause.imageType = imageType
    }

    const images = await prisma.poseImage.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.poseImage.count({
      where: whereClause,
    })

    return NextResponse.json({
      images,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Get images error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove an image
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    // Find the image and verify ownership
    const image = await prisma.poseImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (image.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete from cloud storage using storage manager
    try {
      await storageManager.delete(image.url)
      console.log('Successfully deleted from cloud storage:', image.url)
    } catch (error) {
      console.error('Failed to delete from cloud storage:', error)
      // Continue with database deletion even if cloud deletion fails
    }

    // Delete from database
    await prisma.poseImage.delete({
      where: { id: imageId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
