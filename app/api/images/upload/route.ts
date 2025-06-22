import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

// Cloudflare Images API configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const CLOUDFLARE_IMAGES_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`

interface CloudflareImageResponse {
  success: boolean
  result?: {
    id: string
    filename: string
    uploaded: string
    requireSignedURLs: boolean
    variants: string[]
  }
  errors?: Array<{ code: number; message: string }>
}

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasAccountId: !!CLOUDFLARE_ACCOUNT_ID,
      hasApiToken: !!CLOUDFLARE_API_TOKEN,
      accountIdValue: CLOUDFLARE_ACCOUNT_ID
        ? `${CLOUDFLARE_ACCOUNT_ID.substring(0, 8)}...`
        : 'undefined',
      apiTokenValue: CLOUDFLARE_API_TOKEN
        ? `${CLOUDFLARE_API_TOKEN.substring(0, 8)}...`
        : 'undefined',
      cloudflareUrl: CLOUDFLARE_IMAGES_URL,
    })

    // Check environment variables
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      console.error('Missing Cloudflare configuration:', {
        hasAccountId: !!CLOUDFLARE_ACCOUNT_ID,
        hasApiToken: !!CLOUDFLARE_API_TOKEN,
      })
      return NextResponse.json(
        {
          error:
            'Server configuration error: Cloudflare credentials not configured',
          details:
            'Please check CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables',
        },
        { status: 500 }
      )
    }

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

    // Upload to Cloudflare Images
    const cloudflareForm = new FormData()
    cloudflareForm.append('file', file)
    cloudflareForm.append(
      'metadata',
      JSON.stringify({
        userId,
        uploadedAt: new Date().toISOString(),
        altText: altText || '',
      })
    )

    const cloudflareResponse = await fetch(CLOUDFLARE_IMAGES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: cloudflareForm,
    })

    const cloudflareData: CloudflareImageResponse =
      await cloudflareResponse.json()

    if (!cloudflareData.success || !cloudflareData.result) {
      console.error('Cloudflare upload failed:', {
        status: cloudflareResponse.status,
        errors: cloudflareData.errors,
        url: CLOUDFLARE_IMAGES_URL,
      })

      // Return specific error information for client-side fallback handling
      const errorResponse = {
        error: 'Cloudflare upload failed',
        canFallbackToLocal: true,
        details:
          'Image upload to cloud storage failed. You can save this image locally instead.',
        cloudflareError: {
          status: cloudflareResponse.status,
          errors: cloudflareData.errors,
        },
      }

      // Handle specific error cases
      if (cloudflareData.errors?.some((error) => error.code === 5403)) {
        errorResponse.error =
          'Cloudflare Images permission denied. Please check your API token permissions.'
        errorResponse.details =
          'Your API token needs "Account:Cloudflare Images:Edit" permission. Visit https://dash.cloudflare.com/profile/api-tokens to create a new token with the correct permissions.'
      }

      return NextResponse.json(errorResponse, { status: 503 }) // Service Unavailable
    }

    // Get the public URL for the image
    const imageUrl = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${cloudflareData.result.id}/public`

    // Save to database with cloud storage info
    const poseImage = await prisma.poseImage.create({
      data: {
        userId,
        url: imageUrl,
        altText: altText || null,
        fileName: file.name,
        fileSize: file.size,
        storageType: 'CLOUD',
        cloudflareId: cloudflareData.result.id,
        isOffline: false,
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
    })
  } catch (error) {
    console.error('Upload error:', error)

    // Return error with fallback option
    return NextResponse.json(
      {
        error: 'Internal server error during upload',
        canFallbackToLocal: true,
        details:
          'An unexpected error occurred. You can save this image locally instead.',
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

    const images = await prisma.poseImage.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.poseImage.count({
      where: {
        userId: session.user.id,
      },
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

    // Extract Cloudflare image ID from URL
    const urlParts = image.url.split('/')
    const cloudflareImageId = urlParts[urlParts.length - 2]

    // Delete from Cloudflare
    if (cloudflareImageId && cloudflareImageId !== 'public') {
      try {
        await fetch(`${CLOUDFLARE_IMAGES_URL}/${cloudflareImageId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
        })
      } catch (error) {
        console.error('Failed to delete from Cloudflare:', error)
        // Continue with database deletion even if Cloudflare deletion fails
      }
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
