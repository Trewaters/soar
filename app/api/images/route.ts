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
  poseId?: string
  poseName?: string
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
    const poseId = searchParams.get('poseId')
    const poseName = searchParams.get('poseName')
    const includeOwnership = searchParams.get('includeOwnership') === 'true'
    const orderBy = searchParams.get('orderBy') || 'uploadedAt'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause for filtering
    const where: any = {
      userId: session.user.id,
    }

    if (poseId) {
      where.poseId = poseId
    } else if (poseName) {
      where.pose = {
        OR: [
          { sort_english_name: { contains: poseName, mode: 'insensitive' } },
          { english_names: { contains: poseName, mode: 'insensitive' } },
          { sanskrit_names: { contains: poseName, mode: 'insensitive' } },
        ],
      }
    }

    // Fetch images with optional pose/posture data. Use full record (no select)
    // to tolerate schema changes during the posture->pose rename.
    const images: any = await prisma.poseImage.findMany({
      where,
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
    const transformedImages: PoseImage[] = images.map((image: any) => ({
      id: image.id,
      url: image.url,
      altText: image.altText || undefined,
      fileName: image.fileName || undefined,
      fileSize: image.fileSize || undefined,
      uploadedAt: image.uploadedAt.toISOString(),
      poseId: image.poseId ?? image.postureId ?? undefined,
      poseName:
        (image.pose?.sort_english_name ?? image.posture?.sort_english_name) ||
        (Array.isArray(image.pose?.english_names)
          ? image.pose?.english_names[0]
          : image.pose?.english_names) ||
        (Array.isArray(image.posture?.english_names)
          ? image.posture?.english_names[0]
          : image.posture?.english_names) ||
        undefined,
      displayOrder: image.displayOrder || 1,
    }))

    // Calculate ownership info if requested
    let ownership = undefined
    if (includeOwnership && poseId) {
      const pose = await prisma.asanaPose.findUnique({
        where: { id: poseId },
        select: {
          isUserCreated: true,
          created_by: true,
        },
      })

      if (pose) {
        ownership = {
          canManage: pose.isUserCreated && pose.created_by === session.user.id,
          isOwner: pose.created_by === session.user.id,
          isUserCreated: pose.isUserCreated,
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
      poseId,
      poseName,
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
