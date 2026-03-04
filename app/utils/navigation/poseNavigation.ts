import { NAV_PATHS } from './constants'

/**
 * Convert a pose reference to a navigation URL.
 * Series data stores poses as "PoseName;Description" format.
 * Uses name-based routing which handles both IDs and names via the flexible getPose function.
 */
export function getPoseNavigationUrlSync(poseReference: string): string {
  // Extract pose name from "PoseName;Description" format
  const poseName = poseReference.split(';')[0]

  // Return name-based detail URL
  return `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(poseName)}`
}
