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

    // Build base where clause for filtering by owner (user)
    const baseWhere: any = {
      userId: session.user.id,
    }

    // If caller provided a poseId, use it for server-side filtering.
    // Note: The PoseImage model uses `postureId` as the field name (not `poseId`)
    // to maintain compatibility during the posture->pose migration.
    // If caller provided a poseName, avoid relation-based filtering here because
    // the relation name changed during migration (posture -> pose) and referencing
    // a non-existent relation will cause Prisma to throw. We'll filter by name
    // in JavaScript after fetching the DB records.
    const useServerSideIdFilter = Boolean(poseId)

    if (poseId) {
      baseWhere.postureId = poseId // Use the actual DB field name
    }

    // Fetch images with optional pose/posture relation populated. Use full record
    // (no select) to tolerate schema changes during the posture->pose rename.
    // Note: Both pose and posture relations use the same postureId field, so we
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

      // Manually populate pose/posture relations for each image
      // Try new AsanaPose first, fall back to AsanaPosture
      for (const image of images) {
        if (image.postureId) {
          try {
            const pose = await prisma.asanaPose.findUnique({
              where: { id: image.postureId },
            })
            if (pose) {
              image.pose = pose
            }
          } catch (e) {
            // Try fallback to AsanaPosture
            try {
              const posture = await prisma.asanaPosture.findUnique({
                where: { id: image.postureId },
              })
              if (posture) {
                image.posture = posture
              }
            } catch (e2) {
              // Both failed, leave as null
            }
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
    // If poseName was provided, apply a text filter against pose/posture fields
    const filteredImages = poseName
      ? images.filter((image: any) => {
          const name =
            image.pose?.sort_english_name ?? image.posture?.sort_english_name
          const englishNames =
            image.pose?.english_names ?? image.posture?.english_names
          const sanskritNames =
            image.pose?.sanskrit_names ?? image.posture?.sanskrit_names

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
      // Try the new model first, fall back to the deprecated AsanaPosture model
      let pose: any = null
      try {
        pose = await prisma.asanaPose.findUnique({
          where: { id: poseId },
          select: { isUserCreated: true, created_by: true },
        })
      } catch (e) {
        // ignore and try fallback
      }

      if (!pose) {
        try {
          pose = await prisma.asanaPosture.findUnique({
            where: { id: poseId },
            select: { isUserCreated: true, created_by: true },
          })
        } catch (e) {
          // ignore - ownership will remain undefined
        }
      }

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
