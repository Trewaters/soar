import { getPostureIdByName } from '@lib/postureService'

/**
 * Convert a posture reference from series data to a navigation URL
 * Series data stores postures as "PoseName;Description" format
 * This function extracts the name and converts it to an ObjectId-based URL
 */
export async function getPostureNavigationUrl(
  postureReference: string
): Promise<string> {
  try {
    // Extract posture name from "PoseName;Description" format
    const postureName = postureReference.split(';')[0]

    // Try to get the ObjectId for this posture name
    const postureId = await getPostureIdByName(postureName)

    if (postureId) {
      return `/navigator/asanaPostures/${postureId}`
    } else {
      // Fallback to name-based URL if ID lookup fails
      return `/navigator/asanaPostures/${encodeURIComponent(postureName)}`
    }
  } catch (error) {
    // Fallback to name-based URL on any error
    const postureName = postureReference.split(';')[0]
    return `/navigator/asanaPostures/${encodeURIComponent(postureName)}`
  }
}

/**
 * Synchronous version for use in components that can't handle async operations
 * This is a temporary solution - ideally we should refactor data storage to use IDs
 * For now, this will use the flexible getPosture function that handles both IDs and names
 */
export function getPostureNavigationUrlSync(postureReference: string): string {
  // Extract posture name from "PoseName;Description" format
  const postureName = postureReference.split(';')[0]

  // Return name-based URL that will be handled by the flexible getPosture function
  return `/navigator/asanaPostures/${encodeURIComponent(postureName)}`
}

/**
 * Get the display name from a posture reference
 */
export function getPostureDisplayName(postureReference: string): string {
  return postureReference.split(';')[0]
}

/**
 * Get the description from a posture reference
 */
export function getPostureDescription(postureReference: string): string {
  const parts = postureReference.split(';')
  return parts.length > 1 ? parts[1] : ''
}
