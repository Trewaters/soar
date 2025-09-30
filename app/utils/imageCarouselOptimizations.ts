import { PrismaClient } from '@prisma/client'

/**
 * Database optimization utilities for image carousel queries
 * Implements efficient queries for multi-image carousels with proper indexing
 */

interface ImageQueryOptions {
  postureId: string
  includeMetadata?: boolean
  limit?: number
  orderBy?: 'displayOrder' | 'uploadedAt'
}

interface ImageQueryResult {
  images: Array<{
    id: string
    url: string
    displayOrder: number
    altText?: string
    postureName?: string
    uploadedAt: Date
  }>
  totalCount: number
  hasMore: boolean
}

/**
 * Optimized query for carousel images with proper indexing
 * Uses composite index [postureId, displayOrder] for efficient sorting
 */
export async function getCarouselImages(
  prisma: PrismaClient,
  options: ImageQueryOptions
): Promise<ImageQueryResult> {
  const {
    postureId,
    includeMetadata = false,
    limit = 3,
    orderBy = 'displayOrder',
  } = options

  try {
    // Optimized query using composite index
    const images = await prisma.poseImage.findMany({
      where: {
        postureId,
      },
      select: {
        id: true,
        url: true,
        displayOrder: true,
        altText: includeMetadata,
        uploadedAt: includeMetadata,
        // Only include posture data if metadata is requested
        ...(includeMetadata && {
          posture: {
            select: {
              name: true,
              englishName: true,
            },
          },
        }),
      },
      orderBy: {
        [orderBy]: 'asc',
      },
      take: limit + 1, // Fetch one extra to check if there are more
    })

    const hasMore = images.length > limit
    const resultImages = hasMore ? images.slice(0, limit) : images

    // Transform the data for carousel consumption
    const transformedImages = resultImages.map((image: any) => ({
      id: image.id,
      url: image.url,
      displayOrder: image.displayOrder,
      altText: image.altText || undefined,
      postureName:
        includeMetadata && 'posture' in image
          ? image.posture?.englishName || image.posture?.name
          : undefined,
      uploadedAt: image.uploadedAt || new Date(),
    }))

    return {
      images: transformedImages,
      totalCount: transformedImages.length,
      hasMore,
    }
  } catch (error) {
    console.error('Error fetching carousel images:', error)
    throw new Error('Failed to fetch carousel images')
  }
}

/**
 * Efficient count query for image limit enforcement
 * Uses indexed postureId for fast counting
 */
export async function getImageCount(
  prisma: PrismaClient,
  postureId: string
): Promise<number> {
  try {
    const count = await prisma.poseImage.count({
      where: {
        postureId,
      },
    })
    return count
  } catch (error) {
    console.error('Error counting images:', error)
    return 0
  }
}

/**
 * Optimized reordering update with batch operations
 * Updates multiple displayOrder values efficiently
 */
export async function updateImageOrder(
  prisma: PrismaClient,
  reorderData: Array<{ imageId: string; newDisplayOrder: number }>
): Promise<boolean> {
  try {
    // Use transaction for atomic updates
    await prisma.$transaction(
      reorderData.map(({ imageId, newDisplayOrder }) =>
        prisma.poseImage.update({
          where: { id: imageId },
          data: { displayOrder: newDisplayOrder },
        })
      )
    )
    return true
  } catch (error) {
    console.error('Error updating image order:', error)
    return false
  }
}

/**
 * Efficient image deletion with order gap filling
 * Maintains proper displayOrder sequence (1, 2, 3) after deletion
 */
export async function deleteImageWithReorder(
  prisma: PrismaClient,
  imageId: string,
  postureId: string
): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx: any) => {
      // Get the displayOrder of the image being deleted
      const imageToDelete = await tx.poseImage.findUnique({
        where: { id: imageId },
        select: { displayOrder: true },
      })

      if (!imageToDelete) {
        throw new Error('Image not found')
      }

      // Delete the image
      await tx.poseImage.delete({
        where: { id: imageId },
      })

      // Update displayOrder of remaining images to fill the gap
      await tx.poseImage.updateMany({
        where: {
          postureId,
          displayOrder: {
            gt: imageToDelete.displayOrder,
          },
        },
        data: {
          displayOrder: {
            decrement: 1,
          },
        },
      })
    })

    return true
  } catch (error) {
    console.error('Error deleting image with reorder:', error)
    return false
  }
}

/**
 * Performance monitoring configuration
 */
const performanceMetrics = {
  slowQueryThreshold: 200,
  developmentLogging: true,
}

/**
 * Monitor query performance for debugging slow operations
 */
export function monitorImageQueryPerformance<T>(
  queryName: string,
  promise: Promise<T>
): Promise<T> {
  const startTime = performance.now()

  return promise
    .then((result) => {
      const duration = performance.now() - startTime

      if (
        performanceMetrics.developmentLogging &&
        process.env.NODE_ENV === 'development'
      ) {
        if (duration > performanceMetrics.slowQueryThreshold) {
          console.warn(
            `Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`
          )
        } else {
          console.log(
            `Query ${queryName} completed in ${duration.toFixed(2)}ms`
          )
        }
      }

      return result
    })
    .catch((error) => {
      const duration = performance.now() - startTime
      console.error(
        `Query ${queryName} failed after ${duration.toFixed(2)}ms:`,
        error
      )
      throw error
    })
}

/**
 * Database index recommendations for optimal performance
 * Call this during development to ensure proper indexing
 */
export function validateImageIndexes(): Array<{
  table: string
  index: string
  purpose: string
}> {
  return [
    {
      table: 'PoseImage',
      index: 'postureId_displayOrder_idx',
      purpose: 'Efficient carousel ordering queries',
    },
    {
      table: 'PoseImage',
      index: 'postureId_idx',
      purpose: 'Fast image counting and filtering',
    },
    {
      table: 'PoseImage',
      index: 'uploadedAt_idx',
      purpose: 'Time-based sorting and queries',
    },
  ]
}

const imageCarouselOptimizations = {
  getCarouselImages,
  getImageCount,
  updateImageOrder,
  deleteImageWithReorder,
  monitorImageQueryPerformance,
  validateImageIndexes,
  performanceMetrics,
}

export default imageCarouselOptimizations
