import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'auth'
import { Session } from 'next-auth'
import { prisma } from '../../lib/prismaClient'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

export interface ImageGalleryResponse {
  images: PoseImage[]
  total: number
  hasMore: boolean
  ownership?: {
    canManage: boolean
    isOwner: boolean
    isUserCreated: boolean
  }
}

export interface PoseImage {
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
  // Declare session outside try-catch for error logging access
  let session: Session | null = null

  // Declare search params outside try-catch for error logging access
  let poseId: string | null = null
  let poseName: string | null = null
  let imageType: string | null = null
  let limit = 50
  let offset = 0

  try {
    // Check authentication
    session = await auth()

    const { searchParams } = new URL(request.url)
    poseId = searchParams.get('poseId')
    poseName = searchParams.get('poseName')
    imageType = searchParams.get('imageType')
    const includeOwnership = searchParams.get('includeOwnership') === 'true'
    const orderBy = searchParams.get('orderBy') || 'uploadedAt'
    limit = parseInt(searchParams.get('limit') || '50')
    offset = parseInt(searchParams.get('offset') || '0')
    const showAll = searchParams.get('showAll') === 'true' // Admin flag to show all content

    // Build base where clause for filtering by owner (user)
    const baseWhere: any = {}

    // Authentication is required for general image fetching unless a specific pose is targeted
    const isSpecificPoseTargeted = Boolean(poseId || poseName)

    if (!session?.user?.id && !isSpecificPoseTargeted) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get admin status
    const { isAdmin: checkIsAdmin } = await import('@app/utils/authorization')
    const userIsAdmin = session?.user?.id ? await checkIsAdmin() : false

    // If no userId is in the filter, it returns nothing for regular users
    // unless they target a specific pose to see its public images.
    if (showAll && userIsAdmin) {
      // No userId filter - return everything for admins
    } else if (session?.user?.id) {
      // Logged in users see their own images by default
      if (!isSpecificPoseTargeted) {
        baseWhere.userId = session.user.id
      }
    } else if (!isSpecificPoseTargeted) {
      // Guest users must target a specific pose
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
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
      // Filter by poseId field in PoseImage model
      baseWhere.poseId = poseId
    }

    // Fetch images with optional pose/pose relation populated. Use full record
    // (no select) to tolerate schema changes during the pose->pose rename.
    // Note: Both pose and pose relations use the same poseId field, so we
    // fetch images first, then manually populate the relations in a second pass.
    let images: any[] = []

    try {
      // Select only the fields we need to avoid Prisma type conversion errors
      const selectFields = {
        id: true,
        url: true,
        altText: true,
        fileName: true,
        fileSize: true,
        uploadedAt: true,
        poseId: true,
        poseName: true,
        displayOrder: true,
        userId: true,
        imageType: true,
      }

      if (useServerSideIdFilter) {
        images = await prisma.poseImage.findMany({
          where: baseWhere,
          orderBy:
            orderBy === 'displayOrder'
              ? { displayOrder: 'asc' }
              : { uploadedAt: 'desc' },
          take: limit,
          skip: offset,
          select: selectFields,
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
          select: selectFields,
        })
      }

      // Manually populate pose relations for each image
      // Only fetch the fields we actually need to avoid issues with nullable fields
      for (const image of images) {
        const possibleId = image.poseId || image.pose?.id || null
        if (possibleId) {
          try {
            const pose = await prisma.asanaPose.findUnique({
              where: { id: possibleId },
              select: {
                id: true,
                sort_english_name: true,
                english_names: true,
                sanskrit_names: true,
                isUserCreated: true,
                created_by: true,
              },
            })
            if (pose) image.pose = pose
          } catch (lookupErr) {
            console.warn('Warning: failed to lookup pose for image', {
              imageId: image.id,
              possibleId,
              err: lookupErr instanceof Error ? lookupErr.message : lookupErr,
            })
            // don't abort the whole images request for a single lookup failure
            continue
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

    // Transformed data for response
    // If poseName was provided, apply a text filter against pose fields
    const filteredImages = poseName
      ? images.filter((image: any) => {
          const name = image.pose?.sort_english_name
          const englishNames = image.pose?.english_names
          const sanskritNames = image.pose?.sanskrit_names

          const lower = (s: any) => (s ? String(s).toLowerCase() : '')
          const needle = poseName?.toLowerCase() ?? ''

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

    const transformedImages: PoseImage[] = filteredImages.map((image: any) => {
      // Safely normalize uploadedAt to ISO string
      const uploadedAt = image.uploadedAt
        ? new Date(image.uploadedAt).toISOString()
        : new Date(0).toISOString()

      // Resolve poseName safely
      const resolvedPoseName =
        image.pose?.sort_english_name ||
        (Array.isArray(image.pose?.english_names)
          ? image.pose?.english_names[0]
          : image.pose?.english_names) ||
        undefined

      return {
        id: image.id,
        url: image.url,
        altText: image.altText || undefined,
        fileName: image.fileName || undefined,
        fileSize: image.fileSize || undefined,
        uploadedAt,
        poseId: image.poseId ?? image.poseId ?? undefined,
        poseName: resolvedPoseName,
        displayOrder: image.displayOrder || 1,
      }
    })

    // Calculate ownership info if requested
    let ownershipValue = undefined
    if (includeOwnership && poseId) {
      const { canModifyContent } = await import('@app/utils/authorization')
      const pose = await prisma.asanaPose.findUnique({
        where: { id: poseId },
        select: { isUserCreated: true, created_by: true },
      })

      if (pose) {
        const canManage = await canModifyContent(pose.created_by || '')
        const isOwner =
          session?.user?.email && pose.created_by === session.user.email
        ownershipValue = {
          canManage: Boolean(canManage),
          isOwner: Boolean(isOwner),
          isUserCreated: pose.isUserCreated,
        }
      }
    }

    const response: ImageGalleryResponse = {
      images: transformedImages,
      total: totalCount,
      hasMore: totalCount > offset + limit,
      ownership: ownershipValue,
    }

    return NextResponse.json(response)
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('❌ Error fetching images - Full details:', {
      error: errMsg,
      stack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : undefined,
      userId: session?.user?.id,
      params: { poseId, poseName, imageType, limit, offset },
    })
    // Return the original error message to the client for easier debugging
    return NextResponse.json(
      {
        error: errMsg || 'Failed to fetch images',
      },
      { status: 500 }
    )
  }
}
