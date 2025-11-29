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

    const result = await response.json()
    console.debug('[createAsanaActivity] created activity', {
      userId: input.userId,
      asanaId: input.asanaId,
      resultId: result?.id,
    })

    // Best-effort cache-busting revalidation: after creating activity, trigger
    // a no-store GET for today's activity for this user/asana so that service
    // worker or intermediate caches update quickly. Also ask the service
    // worker to invalidate the cached URL if present. Fire-and-forget.
    ;(async () => {
      try {
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

        const qs =
          `userId=${encodeURIComponent(input.userId)}&asanaId=${encodeURIComponent(
            input.asanaId
          )}` +
          `&startDate=${encodeURIComponent(startOfToday.toISOString())}` +
          `&endDate=${encodeURIComponent(endOfToday.toISOString())}`

        const rel = `/api/asanaActivity?${qs}`
        console.debug('[createAsanaActivity] revalidating', { rel })
        await fetch(rel, { cache: 'no-store' })

        // Ask the service worker to invalidate any cached copy of this URL.
        try {
          const absolute = new URL(rel, location.href).toString()
          console.debug('[createAsanaActivity] sending SW invalidate', {
            absolute,
          })
          if (navigator.serviceWorker) {
            if (
              navigator.serviceWorker.controller &&
              navigator.serviceWorker.controller.postMessage
            ) {
              console.debug(
                '[createAsanaActivity] using serviceWorker.controller'
              )
              navigator.serviceWorker.controller.postMessage({
                command: 'INVALIDATE_URLS',
                urls: [absolute],
              })
            } else if (navigator.serviceWorker.ready) {
              console.debug(
                '[createAsanaActivity] waiting for serviceWorker.ready'
              )
              navigator.serviceWorker.ready.then((reg: any) => {
                try {
                  if (reg && reg.active && reg.active.postMessage) {
                    reg.active.postMessage({
                      command: 'INVALIDATE_URLS',
                      urls: [absolute],
                    })
                  }
                } catch (e) {
                  console.warn(
                    '[createAsanaActivity] SW ready postMessage failed',
                    e
                  )
                }
              })
            }
          } else {
            console.debug(
              '[createAsanaActivity] navigator.serviceWorker not available'
            )
          }
        } catch (e) {
          console.warn('[createAsanaActivity] SW messaging setup failed', e)
        }
      } catch (e) {
        // Non-fatal: revalidation is best-effort
        console.warn('[createAsanaActivity] cache revalidation failed', e)
      }
    })()

    return result
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

    // Best-effort cache-busting revalidation after delete
    ;(async () => {
      try {
        const qs =
          `userId=${encodeURIComponent(userId)}&asanaId=${encodeURIComponent(
            asanaId
          )}` +
          `&startDate=${encodeURIComponent(startOfToday.toISOString())}` +
          `&endDate=${encodeURIComponent(endOfToday.toISOString())}`

        const rel = `/api/asanaActivity?${qs}`
        console.debug('[deleteAsanaActivity] revalidating', { rel })
        await fetch(rel, { cache: 'no-store' })

        // Tell SW to invalidate cached URL if available
        try {
          const absolute = new URL(rel, location.href).toString()
          console.debug('[deleteAsanaActivity] sending SW invalidate', {
            absolute,
          })
          if (navigator.serviceWorker) {
            if (
              navigator.serviceWorker.controller &&
              navigator.serviceWorker.controller.postMessage
            ) {
              console.debug(
                '[deleteAsanaActivity] using serviceWorker.controller'
              )
              navigator.serviceWorker.controller.postMessage({
                command: 'INVALIDATE_URLS',
                urls: [absolute],
              })
            } else if (navigator.serviceWorker.ready) {
              console.debug(
                '[deleteAsanaActivity] waiting for serviceWorker.ready'
              )
              navigator.serviceWorker.ready.then((reg: any) => {
                try {
                  if (reg && reg.active && reg.active.postMessage) {
                    reg.active.postMessage({
                      command: 'INVALIDATE_URLS',
                      urls: [absolute],
                    })
                  }
                } catch (e) {
                  console.warn(
                    '[deleteAsanaActivity] SW ready postMessage failed',
                    e
                  )
                }
              })
            }
          } else {
            console.debug(
              '[deleteAsanaActivity] navigator.serviceWorker not available'
            )
          }
        } catch (e) {
          console.warn('[deleteAsanaActivity] SW messaging setup failed', e)
        }
      } catch (e) {
        console.warn('[deleteAsanaActivity] cache revalidation failed', e)
      }
    })()
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
    const url =
      `/api/asanaActivity?userId=${encodeURIComponent(userId)}&asanaId=${encodeURIComponent(
        asanaId
      )}` +
      `&startDate=${encodeURIComponent(startOfToday.toISOString())}` +
      `&endDate=${encodeURIComponent(endOfToday.toISOString())}`

    const response = await fetch(url, { cache: 'no-store' })

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
      `/api/asanaActivity?userId=${encodeURIComponent(userId)}`,
      {
        cache: 'no-store',
      }
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
    // Calculate user's local Monday-Sunday week range and pass to API
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday
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
      `userId=${encodeURIComponent(userId)}&asanaId=${encodeURIComponent(asanaId)}` +
      `&startDate=${encodeURIComponent(startOfWeek.toISOString())}` +
      `&endDate=${encodeURIComponent(endOfWeek.toISOString())}`

    const response = await fetch(`/api/asanaActivity/weekly?${qs}`)

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
