import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

// POST endpoint to save local image metadata to database
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

    const body = await request.json()
    const { localStorageId, fileName, fileSize, altText, url } = body

    // Validate inputs
    if (!localStorageId || !fileName || !fileSize) {
      return NextResponse.json(
        {
          error: 'Missing required fields: localStorageId, fileName, fileSize',
        },
        { status: 400 }
      )
    }

    // Save local image metadata to database
    const poseImage = await prisma.poseImage.create({
      data: {
        userId: session.user.id,
        url: url || `local://${localStorageId}`, // Special URL format for local images
        altText: altText || null,
        fileName,
        fileSize,
        storageType: 'LOCAL',
        localStorageId,
        isOffline: true,
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
      isOffline: poseImage.isOffline,
      localStorageId: poseImage.localStorageId,
    })
  } catch (error) {
    console.error('Local save error:', error)
    return NextResponse.json(
      { error: 'Failed to save local image metadata' },
      { status: 500 }
    )
  }
}

// PUT endpoint to sync local image to cloud
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

    const body = await request.json()
    const { imageId, cloudUrl } = body

    // Validate inputs
    if (!imageId || !cloudUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: imageId, cloudUrl' },
        { status: 400 }
      )
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

    // Update image to cloud storage
    const updatedImage = await prisma.poseImage.update({
      where: { id: imageId },
      data: {
        url: cloudUrl,
        storageType: 'CLOUD',
        isOffline: false,
      },
    })

    return NextResponse.json({
      id: updatedImage.id,
      url: updatedImage.url,
      storageType: updatedImage.storageType,
      isOffline: updatedImage.isOffline,
      message: 'Image successfully synced to cloud',
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync image to cloud' },
      { status: 500 }
    )
  }
}
