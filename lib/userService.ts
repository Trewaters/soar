import { logServiceError } from './errorLogger'

export type UserData = {
  id: string
  email: string
  name?: string
  provider_id?: string
  createdAt: Date
  updatedAt: Date
}

export type UserStreakData = {
  currentStreak: number
  longestStreak: number
  lastLoginDate: string | null
  isActiveToday: boolean
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserData | null> {
  try {
    const response = await fetch(
      `/api/user?email=${encodeURIComponent(email)}`,
      {
        cache: 'no-store',
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    const result = await response.json()
    // API may return { data: null } for missing users
    return result.data ?? null
  } catch (error) {
    logServiceError(error, 'userService', 'getUserByEmail', {
      operation: 'fetch_user_by_email',
      email,
    })
    throw error
  }
}

/**
 * Get user login streak data
 * This function automatically records today's login activity if not already recorded
 * and returns the most up-to-date streak information
 */
export async function getUserLoginStreak(
  userId: string
): Promise<UserStreakData> {
  try {
    // Use recordActivityAndGetStreak to ensure login streak is always up-to-date
    const result = await recordActivityAndGetStreak(userId, 'view_login_streak')
    return result.streakData
  } catch (error) {
    logServiceError(error, 'userService', 'getUserLoginStreak', {
      operation: 'fetch_user_login_streak',
      userId,
    })
    throw error
  }
}

/**
 * Update practitioner data
 */
export async function updatePractitionerData(
  practitionerData: Record<string, any>
): Promise<{ message: string }> {
  try {
    const response = await fetch('/api/user/updatePractitioner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(practitionerData),
    })

    if (!response.ok) {
      throw new Error('Failed to update practitioner data')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userService', 'updatePractitionerData', {
      operation: 'update_practitioner_data',
      practitionerData,
    })
    throw error
  }
}

/**
 * Get user account data
 */
export async function getUserAccount(
  userId?: string,
  email?: string
): Promise<any | null> {
  try {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (email) params.append('email', email)

    const response = await fetch(
      `/api/user/fetchAccount?${params.toString()}`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch account data')
    }

    const result = await response.json()
    return result.data ?? null
  } catch (error) {
    logServiceError(error, 'userService', 'getUserAccount', {
      operation: 'fetch_user_account',
      userId,
      email,
    })
    throw error
  }
}

/**
 * Get practitioner data
 */
export async function getPractitionerData(id: string): Promise<UserData> {
  try {
    const response = await fetch(
      `/api/user/fetchPractitioner?id=${encodeURIComponent(id)}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch practitioner data')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    logServiceError(error, 'userService', 'getPractitionerData', {
      operation: 'fetch_practitioner_data',
      id,
    })
    throw error
  }
}

/**
 * Record user activity and get updated login streak data
 * This function automatically records today's login activity if not already recorded
 * and returns the most up-to-date streak information
 */
export async function recordActivityAndGetStreak(
  userId: string,
  activityType: string = 'view_streaks'
): Promise<{
  success: boolean
  loginRecorded: boolean
  streakData: UserStreakData
}> {
  try {
    const response = await fetch('/api/user/recordActivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, activityType }),
    })

    if (!response.ok) {
      throw new Error('Failed to record activity')
    }

    const result = await response.json()

    return {
      success: result.success,
      loginRecorded: result.loginRecorded,
      streakData: result.streakData,
    }
  } catch (error) {
    logServiceError(error, 'userService', 'recordActivityAndGetStreak', {
      operation: 'record_activity_and_get_streak',
      userId,
      activityType,
    })
    throw error
  }
}
