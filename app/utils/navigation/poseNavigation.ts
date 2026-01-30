import { getPoseIdByName } from '@lib/poseService'
import { NAV_PATHS } from './constants'

/**
 * Convert a pose reference from series data to a navigation URL
 * Series data stores poses as "PoseName;Description" format
 * This function extracts the name and converts it to an ObjectId-based URL
 */
export async function getPoseNavigationUrl(
  poseReference: string
): Promise<string> {
  try {
    // Extract pose name from "PoseName;Description" format
    const poseName = poseReference.split(';')[0]

    // Try to get the ObjectId for this pose name
    const poseId = await getPoseIdByName(poseName)

    if (poseId) {
      return `${NAV_PATHS.PRACTICE_ASANAS}?id=${poseId}`
    } else {
      // Fallback to name-based detail URL if ID lookup fails
      return `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(poseName)}`
    }
  } catch (error) {
    // Fallback to name-based detail URL on any error
    const poseName = poseReference.split(';')[0]
    return `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(poseName)}`
  }
}

/**
 * Synchronous version for use in components that can't handle async operations
 * This is a temporary solution - ideally we should refactor data storage to use IDs
 * For now, this will use the flexible getPose function that handles both IDs and names
 */
export function getPoseNavigationUrlSync(poseReference: string): string {
  // Extract pose name from "PoseName;Description" format
  const poseName = poseReference.split(';')[0]

  // Return name-based detail URL
  return `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(poseName)}`
}

/**
 * Get the display name from a pose reference
 */
export function getPoseDisplayName(poseReference: string): string {
  return poseReference.split(';')[0]
}

/**
 * Get the description from a pose reference
 */
export function getPoseDescription(poseReference: string): string {
  const parts = poseReference.split(';')
  return parts.length > 1 ? parts[1] : ''
}
