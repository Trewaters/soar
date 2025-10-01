import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { PrismaClient } from '../../../prisma/generated/client'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

interface ImageGalleryResponse {
  images: PoseImage[]
  total: number
  hasMore: boolean
  ownership?: {
    canManage: boolean
    isOwner: boolean
    isUserCreated: boolean
  }
}

interface PoseImage {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string
  postureId?: string
  postureName?: string
  displayOrder: number
}

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
    const postureId = searchParams.get('postureId')
    const postureName = searchParams.get('postureName')
    const includeOwnership = searchParams.get('includeOwnership') === 'true'
    const orderBy = searchParams.get('orderBy') || 'uploadedAt'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause for filtering
    const where: any = {
      userId: session.user.id,
    }

    if (postureId) {
      where.postureId = postureId
    } else if (postureName) {
      where.posture = {
        OR: [
          { sort_english_name: { contains: postureName, mode: 'insensitive' } },
          { english_names: { contains: postureName, mode: 'insensitive' } },
          { sanskrit_names: { contains: postureName, mode: 'insensitive' } },
        ],
      }
    }

    // Fetch images with optional posture data
    const images = await prisma.poseImage.findMany({
      where,
      select: {
        id: true,
        url: true,
        altText: true,
        fileName: true,
        fileSize: true,
        uploadedAt: true,
        displayOrder: true,
        postureId: true,
        posture: {
          select: {
            id: true,
            sort_english_name: true,
            english_names: true,
            isUserCreated: true,
            created_by: true,
          },
        },
      },
      orderBy:
        orderBy === 'displayOrder'
          ? { displayOrder: 'asc' }
          : { uploadedAt: 'desc' },
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const totalCount = await prisma.poseImage.count({ where })

    // Transform data for response
    const transformedImages: PoseImage[] = images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText || undefined,
      fileName: image.fileName || undefined,
      fileSize: image.fileSize || undefined,
      uploadedAt: image.uploadedAt.toISOString(),
      postureId: image.postureId || undefined,
      postureName:
        image.posture?.sort_english_name ||
        (Array.isArray(image.posture?.english_names)
          ? image.posture?.english_names[0]
          : image.posture?.english_names) ||
        undefined,
      displayOrder: image.displayOrder || 1,
    }))

    // Calculate ownership info if requested
    let ownership = undefined
    if (includeOwnership && postureId) {
      const posture = await prisma.asanaPosture.findUnique({
        where: { id: postureId },
        select: {
          isUserCreated: true,
          created_by: true,
        },
      })

      if (posture) {
        ownership = {
          canManage:
            posture.isUserCreated && posture.created_by === session.user.id,
          isOwner: posture.created_by === session.user.id,
          isUserCreated: posture.isUserCreated,
        }
      }
    }

    const response: ImageGalleryResponse = {
      images: transformedImages,
      total: totalCount,
      hasMore: totalCount > offset + limit,
      ownership,
    }

    console.log('📸 GET /api/images: Returning images', {
      postureId,
      postureName,
      imageCount: transformedImages.length,
      totalCount,
      hasMore: response.hasMore,
      ownership,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
