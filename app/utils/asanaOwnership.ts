/**
 * Asana Ownership Verification Utilities for Soar Yoga Application
 * Provides consistent ownership checks for multi-image management
 */

import { PrismaClient } from '../../prisma/generated/client'
import { Session } from 'next-auth'
import { AsanaPoseData } from '../../types/images'

const prisma = new PrismaClient()

/**
 * Verify if a user owns a specific asana
 * @param poseId - The ID of the asana to check
 * @param userIdentifier - The user identifier to verify ownership for. Can be either the user's email or their internal id.
 * @returns Promise<boolean> - True if user owns the asana
 */
export async function verifyAsanaOwnership(
  poseId: string,
  userIdentifier: string
): Promise<boolean> {
  try {
    const asana = await prisma.asanaPose.findUnique({
      where: { id: poseId },
      select: { created_by: true },
    })

    if (!asana) {
      return false
    }

    // created_by may be stored as email (preferred) or older records may contain user id
    return (
      asana.created_by === userIdentifier || // direct match (email or id)
      asana.created_by === (userIdentifier ?? '')
    )
  } catch (error) {
    console.error('Error verifying asana ownership:', error)
    return false
  }
}

/**
 * Check if a user can manage images for a specific asana
 * @param asana - The asana data to check
 * @param session - The user's authentication session
 * @returns boolean - True if user can manage images
 */
export function canManageImages(
  asana: AsanaPoseData,
  session: Session | null
): boolean {
  // Require an authenticated session
  if (!session?.user) {
    return false
  }

  // Backwards compatible: if user owns the asana (by email/id match), treat as user-created
  // regardless of isUserCreated flag
  const sessionEmail = session.user.email
  const sessionId = (session.user as any).id

  // Ensure we always return a boolean (avoid returning undefined when one side is falsy)
  const emailMatch = sessionEmail ? asana.created_by === sessionEmail : false
  const idMatch = sessionId ? asana.created_by === sessionId : false

  return emailMatch || idMatch
}

/**
 * Check if an asana is user-created (as opposed to system/default asana)
 * @param asana - The asana data to check
 * @returns boolean - True if asana is user-created
 */
export function isUserCreatedAsana(asana: AsanaPoseData): boolean {
  return asana.isUserCreated === true
}

/**
 * Get image management permissions for a user and asana
 * @param asana - The asana to check permissions for
 * @param session - The user's authentication session
 * @returns Object with permission details
 */
export function getImageManagementPermissions(
  asana: AsanaPoseData,
  session: Session | null
) {
  const canManage = canManageImages(asana, session)
  const isOwner =
    (session?.user?.email && session.user.email === asana.created_by) ||
    (session?.user && (session.user as any).id === asana.created_by)
  const isUserCreated = isUserCreatedAsana(asana)
  const currentCount = asana.imageCount || 0
  const maxImages = isUserCreated ? 3 : 1 // User-created asanas can have 3 images
  const remainingSlots = Math.max(0, maxImages - currentCount)

  return {
    canUpload: canManage && remainingSlots > 0,
    canDelete: canManage && currentCount > 0,
    canReorder: canManage && currentCount > 1,
    canManage,
    isOwner,
    isUserCreated,
    maxImages,
    currentCount,
    remainingSlots,
  }
}

/**
 * Verify ownership of multiple images
 * @param imageIds - Array of image IDs to check
 * @param userId - The user ID to verify ownership for
 * @returns Promise<boolean> - True if user owns all images
 */
export async function verifyMultipleImageOwnership(
  imageIds: string[],
  userId: string
): Promise<boolean> {
  try {
    const images = await prisma.poseImage.findMany({
      where: {
        id: { in: imageIds },
      },
      select: { id: true, userId: true },
    })

    // Check if all images exist and belong to the user
    if (images.length !== imageIds.length) {
      return false
    }

    return images.every((image) => image.userId === userId)
  } catch (error) {
    console.error('Error verifying multiple image ownership:', error)
    return false
  }
}

/**
 * Check if an asana can have multiple images
 * @param asana - The asana to check
 * @returns boolean - True if asana supports multiple images
 */
export function canHaveMultipleImages(asana: AsanaPoseData): boolean {
  return isUserCreatedAsana(asana)
}

/**
 * Get the next available display order for an asana
 * @param poseId - The asana ID to check
 * @returns Promise<number> - The next available display order (1-3)
 */
export async function getNextDisplayOrder(poseId: string): Promise<number> {
  try {
    // Support migration: some records may use `postureId` while newer records use `poseId`.
    const whereClause: any = { OR: [{ poseId }, { postureId: poseId }] }

    // Fetch minimal fields without a typed `select` to avoid Prisma client type mismatches
    const existingImages: any[] = await prisma.poseImage.findMany({
      where: whereClause,
      orderBy: { displayOrder: 'asc' },
    })

    const existingOrders = existingImages.map((img: any) => img.displayOrder)

    // Find the first available slot (1, 2, or 3)
    for (let order = 1; order <= 3; order++) {
      if (!existingOrders.includes(order)) {
        return order
      }
    }

    // If all slots are taken, this should not happen due to limit checking
    throw new Error('No available display order slots')
  } catch (error) {
    console.error('Error getting next display order:', error)
    throw error
  }
}

/**
 * Validate display order array for reordering
 * @param orders - Array of display orders to validate
 * @returns boolean - True if orders are valid (unique, 1-3 range)
 */
export function validateDisplayOrders(orders: number[]): boolean {
  // Check for duplicates
  const uniqueOrders = new Set(orders)
  if (uniqueOrders.size !== orders.length) {
    return false
  }

  // Check range (1-3)
  return orders.every((order) => order >= 1 && order <= 3)
}

/**
 * Error classes for ownership-related errors
 */
export class AsanaOwnershipError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = 'AsanaOwnershipError'
  }
}

export class ImageLimitError extends Error {
  private _limit: number
  private _current: number

  constructor(message: string, limit: number, current: number) {
    super(message)
    this.name = 'ImageLimitError'
    this._limit = limit
    this._current = current
  }

  // Preserve legacy public properties via getters
  public get limit(): number {
    return this._limit
  }

  public get current(): number {
    return this._current
  }
}

export class SystemAsanaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SystemAsanaError'
  }
}
