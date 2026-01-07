/**
 * Client-side Series Activity Service
 *
 * This service handles all API calls related to series activities from the client side.
 * Components should use these functions instead of making direct fetch calls to APIs.
 */

export interface SeriesActivityData {
  id: string
  userId: string
  seriesId: string
  seriesName: string
  datePerformed: string
  difficulty?: string
  completionStatus: string
  duration: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSeriesActivityInput {
  userId: string
  seriesId: string
  seriesName: string
  difficulty?: string
  completionStatus?: string
  duration?: number
  notes?: string
}

export interface WeeklySeriesActivityData {
  count: number
  activities: Array<{
    id: string
    datePerformed: string
    duration: number
    completionStatus: string
    difficulty?: string
  }>
  dateRange: {
    start: string
    end: string
  }
}

/**
 * Create a new series activity
 */
export async function createSeriesActivity(
  input: CreateSeriesActivityInput
): Promise<SeriesActivityData> {
  try {
    const response = await fetch('/api/seriesActivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create series activity')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating series activity:', error)
    throw error
  }
}

/**
 * Delete a series activity
 */
export async function deleteSeriesActivity(
  userId: string,
  seriesId: string
): Promise<void> {
  try {
    // Calculate date range in user's local timezone
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    )
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    const response = await fetch('/api/seriesActivity', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        seriesId,
        startDate: startOfToday.toISOString(),
        endDate: endOfToday.toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete series activity')
    }
  } catch (error) {
    console.error('Error deleting series activity:', error)
    throw error
  }
}

/**
 * Check if a series activity exists for today
 */
export async function checkSeriesActivityExists(
  userId: string,
  seriesId: string
): Promise<{ exists: boolean; activity?: SeriesActivityData }> {
  try {
    // Calculate date range in user's local timezone
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    )
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )

    const response = await fetch(
      `/api/seriesActivity?userId=${encodeURIComponent(userId)}&seriesId=${encodeURIComponent(seriesId)}&startDate=${encodeURIComponent(startOfToday.toISOString())}&endDate=${encodeURIComponent(endOfToday.toISOString())}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to check series activity')
    }

    return await response.json()
  } catch (error) {
    console.error('Error checking series activity existence:', error)
    throw error
  }
}

/**
 * Get all series activities for a user
 */
export async function getUserSeriesActivities(
  userId: string
): Promise<SeriesActivityData[]> {
  try {
    const response = await fetch(
      `/api/seriesActivity?userId=${encodeURIComponent(userId)}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to fetch user series activities'
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user series activities:', error)
    throw error
  }
}

/**
 * Get weekly series activity data for a specific series
 */
export async function getSeriesWeeklyActivity(
  userId: string,
  seriesId: string
): Promise<WeeklySeriesActivityData> {
  try {
    // Calculate user's local Monday-Sunday week range and pass to API
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysFromMonday,
      0,
      0,
      0,
      0
    )
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const qs =
      `userId=${encodeURIComponent(userId)}&seriesId=${encodeURIComponent(seriesId)}` +
      `&startDate=${encodeURIComponent(startOfWeek.toISOString())}` +
      `&endDate=${encodeURIComponent(endOfWeek.toISOString())}`

    const response = await fetch(`/api/seriesActivity/weekly?${qs}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to fetch weekly series activity data'
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching weekly series activity data:', error)
    throw error
  }
}

/**
 * Get weekly series activity summary for all series for a user
 */
export async function getAllSeriesWeeklyActivity(userId: string): Promise<any> {
  try {
    const response = await fetch(
      `/api/seriesActivity/weekly?userId=${encodeURIComponent(userId)}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to fetch weekly series activity summary'
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching weekly series activity summary:', error)
    throw error
  }
}
