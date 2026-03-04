/**
 * Timezone helper utilities for activity tracking
 *
 * These utilities help convert between server time and user's local time
 * to ensure activity tracking respects the user's calendar day regardless
 * of where the server is hosted.
 */

/**
 * Get the start and end of today in the user's timezone
 *
 * @param timezoneOffset - User's timezone offset in minutes (from Date.getTimezoneOffset())
 *                         Positive values are behind UTC, negative values are ahead
 *                         e.g., -480 for UTC+8, 300 for UTC-5
 * @returns Object with startOfToday and endOfToday as Date objects in server time
 */
export function getUserTodayRange(timezoneOffset?: number): {
  startOfToday: Date
  endOfToday: Date
} {
  const now = new Date()

  // If timezone offset is provided, adjust the date to user's timezone
  let userNow: Date
  if (timezoneOffset !== undefined) {
    // Convert server time to user's timezone
    // timezoneOffset is in minutes (e.g., -480 for UTC+8)
    // getTimezoneOffset() returns minutes, but opposite sign
    const serverOffset = now.getTimezoneOffset()
    const offsetDiff = serverOffset - timezoneOffset
    userNow = new Date(now.getTime() + offsetDiff * 60000)
  } else {
    userNow = now
  }

  // Get start and end of day in user's timezone
  const startOfToday = new Date(
    userNow.getFullYear(),
    userNow.getMonth(),
    userNow.getDate(),
    0,
    0,
    0,
    0
  )

  const endOfToday = new Date(
    userNow.getFullYear(),
    userNow.getMonth(),
    userNow.getDate(),
    23,
    59,
    59,
    999
  )

  // If we adjusted for timezone, convert back to server time for database query
  if (timezoneOffset !== undefined) {
    const serverOffset = now.getTimezoneOffset()
    const offsetDiff = serverOffset - timezoneOffset
    startOfToday.setTime(startOfToday.getTime() - offsetDiff * 60000)
    endOfToday.setTime(endOfToday.getTime() - offsetDiff * 60000)
  }

  return { startOfToday, endOfToday }
}
