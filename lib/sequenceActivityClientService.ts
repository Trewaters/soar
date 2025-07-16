/**
 * Client-side Sequence Activity Service
 *
 * This service handles all API calls related to sequence activities from the client side.
 * Components should use these functions instead of making direct fetch calls to APIs.
 */

export interface SequenceActivityData {
  id: string
  userId: string
  sequenceId: string
  sequenceName: string
  datePerformed: string
  difficulty?: string
  completionStatus: string
  duration: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSequenceActivityInput {
  userId: string
  sequenceId: string
  sequenceName: string
  difficulty?: string
  completionStatus?: string
  duration?: number
  notes?: string
}

export interface WeeklySequenceActivityData {
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
 * Create a new sequence activity
 */
export async function createSequenceActivity(
  input: CreateSequenceActivityInput
): Promise<SequenceActivityData> {
  try {
    const response = await fetch('/api/sequenceActivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create sequence activity')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating sequence activity:', error)
    throw error
  }
}

/**
 * Delete a sequence activity
 */
export async function deleteSequenceActivity(
  userId: string,
  sequenceId: string
): Promise<void> {
  try {
    const response = await fetch('/api/sequenceActivity', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, sequenceId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete sequence activity')
    }
  } catch (error) {
    console.error('Error deleting sequence activity:', error)
    throw error
  }
}

/**
 * Check if a sequence activity exists for today
 */
export async function checkSequenceActivityExists(
  userId: string,
  sequenceId: string
): Promise<{ exists: boolean; activity?: SequenceActivityData }> {
  try {
    const response = await fetch(
      `/api/sequenceActivity?userId=${userId}&sequenceId=${sequenceId}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to check sequence activity')
    }

    return await response.json()
  } catch (error) {
    console.error('Error checking sequence activity:', error)
    throw error
  }
}

/**
 * Get all sequence activities for a user
 */
export async function getUserSequenceActivities(
  userId: string
): Promise<SequenceActivityData[]> {
  try {
    const response = await fetch(`/api/sequenceActivity?userId=${userId}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch sequence activities')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching sequence activities:', error)
    throw error
  }
}

/**
 * Get weekly sequence activity data for a specific sequence
 */
export async function getSequenceWeeklyActivity(
  userId: string,
  sequenceId: string
): Promise<WeeklySequenceActivityData> {
  try {
    const response = await fetch(
      `/api/sequenceActivity/weekly?userId=${userId}&sequenceId=${sequenceId}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to fetch weekly sequence activity'
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching weekly sequence activity:', error)
    throw error
  }
}

/**
 * Get weekly sequence activity summary for all sequences for a user
 */
export async function getAllSequenceWeeklyActivity(
  userId: string
): Promise<any> {
  try {
    const response = await fetch(
      `/api/sequenceActivity/weekly?userId=${userId}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to fetch all weekly sequence activities'
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching all weekly sequence activities:', error)
    throw error
  }
}
