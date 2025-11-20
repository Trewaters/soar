/**
 * Client-side Asana Activity Service
 *
 * This service handles all API calls related to asana activities from the client side.
 * Components should use these functions instead of making direct fetch calls to APIs.
 */

export interface AsanaActivityData {
  id: string
  userId: string
  asanaId: string
  asanaName: string
  sort_english_name: string
  duration: number
  datePerformed: string
  completionStatus: string
  difficulty?: string
  notes?: string
  sensations?: string
  createdAt: string
  updatedAt: string
}

export interface WeeklyActivityData {
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

export interface CreateActivityInput {
  userId: string
  asanaId: string
  asanaName: string
  sort_english_name: string
  duration: number
  datePerformed: Date
  completionStatus: string
  difficulty?: string
  notes?: string
  sensations?: string
}

/**
 * Record a new asana activity
 */
export async function createAsanaActivity(
  input: CreateActivityInput
): Promise<AsanaActivityData> {
  try {
    const response = await fetch('/api/asanaActivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to record activity')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating asana activity:', error)
    throw error
  }
}

/**
 * Delete an asana activity for today (in user's local timezone)
 */
export async function deleteAsanaActivity(
  userId: string,
  asanaId: string
): Promise<void> {
  try {
    // Calculate today's date range in user's local timezone
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

    const response = await fetch('/api/asanaActivity', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        asanaId,
        startDate: startOfToday.toISOString(),
        endDate: endOfToday.toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to remove activity')
    }
  } catch (error) {
    console.error('Error deleting asana activity:', error)
    throw error
  }
}

/**
 * Check if an activity exists for a user and asana today (in user's local timezone)
 */
export async function checkActivityExists(
  userId: string,
  asanaId: string
): Promise<{ exists: boolean; activity?: AsanaActivityData }> {
  try {
    // Calculate today's date range in user's local timezone
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

    // Send date range as ISO strings (automatically converts to UTC)
    const response = await fetch(
      `/api/asanaActivity?userId=${encodeURIComponent(userId)}&asanaId=${encodeURIComponent(asanaId)}` +
        `&startDate=${encodeURIComponent(startOfToday.toISOString())}` +
        `&endDate=${encodeURIComponent(endOfToday.toISOString())}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to check activity')
    }

    return await response.json()
  } catch (error) {
    console.error('Error checking activity existence:', error)
    throw error
  }
}

/**
 * Get all activities for a user
 */
export async function getUserActivities(
  userId: string
): Promise<AsanaActivityData[]> {
  try {
    const response = await fetch(
      `/api/asanaActivity?userId=${encodeURIComponent(userId)}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch user activities')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user activities:', error)
    throw error
  }
}

/**
 * Get weekly activity data for a specific asana
 */
export async function getAsanaWeeklyActivity(
  userId: string,
  asanaId: string
): Promise<WeeklyActivityData> {
  try {
    const response = await fetch(
      `/api/asanaActivity/weekly?userId=${encodeURIComponent(userId)}&asanaId=${encodeURIComponent(asanaId)}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch weekly activity data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching weekly activity data:', error)
    throw error
  }
}

/**
 * Get weekly activity summary for all asanas for a user
 */
export async function getAllAsanasWeeklyActivity(userId: string): Promise<any> {
  try {
    const response = await fetch(
      `/api/asanaActivity/weekly?userId=${encodeURIComponent(userId)}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to fetch weekly activity summary'
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching weekly activity summary:', error)
    throw error
  }
}
