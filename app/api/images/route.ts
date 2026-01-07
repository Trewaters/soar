import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '../../lib/prismaClient'

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
    const imageType = searchParams.get('imageType')
    const includeOwnership = searchParams.get('includeOwnership') === 'true'
    const orderBy = searchParams.get('orderBy') || 'uploadedAt'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build base where clause for filtering by owner (user)
    const baseWhere: any = {
      userId: session.user.id,
    }

    // Filter by imageType if provided (e.g., 'profile', 'pose', 'gallery')
    if (imageType) {
      baseWhere.imageType = imageType
    }

    // If caller provided a poseId, use it for server-side filtering.
    // Note: The PoseImage model uses `poseId` as the field name (not `poseId`)
    // to maintain compatibility during the pose->pose migration.
    // If caller provided a poseName, avoid relation-based filtering here because
    // the relation name changed during migration (pose -> pose) and referencing
    // a non-existent relation will cause Prisma to throw. We'll filter by name
    // in JavaScript after fetching the DB records.
    const useServerSideIdFilter = Boolean(poseId)

    if (poseId) {
      // Prefer poseId (new schema); keep poseId for backward compatibility
      baseWhere.OR = [{ poseId }, { poseId: poseId }]
    }

    // Fetch images with optional pose/pose relation populated. Use full record
    // (no select) to tolerate schema changes during the pose->pose rename.
    // Note: Both pose and pose relations use the same poseId field, so we
    // fetch images first, then manually populate the relations in a second pass.
    let images: any[] = []

    try {
      if (useServerSideIdFilter) {
        images = await prisma.poseImage.findMany({
          where: baseWhere,
          orderBy:
            orderBy === 'displayOrder'
              ? { displayOrder: 'asc' }
              : { uploadedAt: 'desc' },
          take: limit,
          skip: offset,
        })
      } else {
        // No poseId provided (maybe poseName). Fetch a superset and apply
        // text-based filtering locally to avoid Prisma relation name errors.
        images = await prisma.poseImage.findMany({
          where: baseWhere,
          orderBy:
            orderBy === 'displayOrder'
              ? { displayOrder: 'asc' }
              : { uploadedAt: 'desc' },
        })
      }

      // Manually populate pose relations for each image
      for (const image of images) {
        if (image.poseId ?? image.poseId) {
          const idToLookup = image.poseId ?? image.poseId
          const pose = await prisma.asanaPose.findUnique({
            where: { id: idToLookup },
          })
          if (pose) {
            image.pose = pose
          }
        }
      }
    } catch (error) {
      console.error('Error fetching images from database:', error)
      throw error
    }

    // Get total count for pagination (when using server-side filtering, this is
    // accurate; when using client-side filtering we will recompute after filtering)
    let totalCount = 0
    if (useServerSideIdFilter) {
      totalCount = await prisma.poseImage.count({ where: baseWhere })
    } else {
      totalCount = images.length
    }

    // Transform data for response
    // If poseName was provided, apply a text filter against pose fields
    const filteredImages = poseName
      ? images.filter((image: any) => {
          const name = image.pose?.sort_english_name
          const englishNames = image.pose?.english_names
          const sanskritNames = image.pose?.sanskrit_names

          const lower = (s: any) => (s ? String(s).toLowerCase() : '')
          const needle = poseName.toLowerCase()

          if (lower(name).includes(needle)) return true
          if (Array.isArray(englishNames)) {
            if (englishNames.some((n: string) => lower(n).includes(needle)))
              return true
          } else if (lower(englishNames).includes(needle)) return true
          if (Array.isArray(sanskritNames)) {
            if (sanskritNames.some((n: string) => lower(n).includes(needle)))
              return true
          } else if (lower(sanskritNames).includes(needle)) return true
          return false
        })
      : images

    const transformedImages: PoseImage[] = filteredImages.map((image: any) => ({
      id: image.id,
      url: image.url,
      altText: image.altText || undefined,
      fileName: image.fileName || undefined,
      fileSize: image.fileSize || undefined,
      uploadedAt: image.uploadedAt.toISOString(),
      poseId: image.poseId ?? image.poseId ?? undefined,
      poseName:
        image.pose?.sort_english_name ||
        (Array.isArray(image.pose?.english_names)
          ? image.pose?.english_names[0]
          : image.pose?.english_names) ||
        undefined,
      displayOrder: image.displayOrder || 1,
    }))

    // Calculate ownership info if requested
    let ownership = undefined
    if (includeOwnership && poseId) {
      const pose = await prisma.asanaPose.findUnique({
        where: { id: poseId },
        select: { isUserCreated: true, created_by: true },
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
