import { prisma } from './prismaClient'
import { logDatabaseError, logServiceError } from './errorLogger'

export interface SequenceActivityData {
  id: string
  userId: string
  sequenceId: string
  sequenceName: string
  datePerformed: Date
  difficulty?: string
  completionStatus: string
  duration: number
  notes?: string
  createdAt: Date
  updatedAt: Date
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
    start: Date
    end: Date
  }
}

/**
 * Create a new sequence activity record
 */
export async function createSequenceActivity(
  input: CreateSequenceActivityInput
): Promise<SequenceActivityData> {
  try {
    const activity = await prisma.sequenceActivity.create({
      data: {
        userId: input.userId,
        sequenceId: input.sequenceId,
        sequenceName: input.sequenceName,
        datePerformed: new Date(),
        difficulty: input.difficulty,
        completionStatus: input.completionStatus || 'complete',
        duration: input.duration || 0,
        notes: input.notes,
      },
    })

    return {
      id: activity.id,
      userId: activity.userId,
      sequenceId: activity.sequenceId,
      sequenceName: activity.sequenceName,
      datePerformed: activity.datePerformed,
      difficulty: activity.difficulty ?? undefined,
      completionStatus: activity.completionStatus,
      duration: activity.duration,
      notes: activity.notes ?? undefined,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    }
  } catch (error) {
    logDatabaseError(error, 'create', 'SequenceActivity', input)
    logServiceError(
      error,
      'sequenceActivityService',
      'createSequenceActivity',
      input
    )
    throw error
  }
}

/**
 * Get all sequence activities for a user
 */
export async function getUserSequenceHistory(
  userId: string
): Promise<SequenceActivityData[]> {
  try {
    const activities = await prisma.sequenceActivity.findMany({
      where: { userId },
      orderBy: { datePerformed: 'desc' },
    })

    return activities.map((activity) => ({
      id: activity.id,
      userId: activity.userId,
      sequenceId: activity.sequenceId,
      sequenceName: activity.sequenceName,
      datePerformed: activity.datePerformed,
      difficulty: activity.difficulty ?? undefined,
      completionStatus: activity.completionStatus,
      duration: activity.duration,
      notes: activity.notes ?? undefined,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    }))
  } catch (error) {
    logServiceError(
      error,
      'sequenceActivityService',
      'getUserSequenceHistory',
      {
        userId,
      }
    )
    throw error
  }
}

/**
 * Check if a sequence activity exists for a specific date range
 * Date range should be calculated by the client in user's local timezone.
 * Falls back to server's local time if dates not provided (backward compatibility).
 *
 * @param userId - User ID
 * @param sequenceId - Sequence ID
 * @param startDate - Optional ISO date string for start of day (from client)
 * @param endDate - Optional ISO date string for end of day (from client)
 */
export async function checkExistingSequenceActivity(
  userId: string,
  sequenceId: string,
  startDate?: string,
  endDate?: string
): Promise<SequenceActivityData | null> {
  try {
    // Use provided date range (from client) or fallback to server's local time
    const startOfRange = startDate
      ? new Date(startDate)
      : new Date(new Date().setHours(0, 0, 0, 0))

    const endOfRange = endDate
      ? new Date(endDate)
      : new Date(new Date().setHours(23, 59, 59, 999))

    const activity = await prisma.sequenceActivity.findFirst({
      where: {
        userId,
        sequenceId,
        datePerformed: {
          gte: startOfRange,
          lte: endOfRange,
        },
      },
      orderBy: {
        datePerformed: 'desc',
      },
    })

    return activity
      ? {
          id: activity.id,
          userId: activity.userId,
          sequenceId: activity.sequenceId,
          sequenceName: activity.sequenceName,
          datePerformed: activity.datePerformed,
          difficulty: activity.difficulty ?? undefined,
          completionStatus: activity.completionStatus,
          duration: activity.duration,
          notes: activity.notes ?? undefined,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
        }
      : null
  } catch (error) {
    logServiceError(
      error,
      'sequenceActivityService',
      'checkExistingSequenceActivity',
      {
        userId,
        sequenceId,
      }
    )
    throw error
  }
}

/**
 * Delete a sequence activity for a specific date range
 * Date range should be calculated by the client in user's local timezone.
 * Falls back to server's local time if dates not provided (backward compatibility).
 *
 * @param userId - User ID
 * @param sequenceId - Sequence ID
 * @param startDate - Optional ISO date string for start of day (from client)
 * @param endDate - Optional ISO date string for end of day (from client)
 */
export async function deleteSequenceActivity(
  userId: string,
  sequenceId: string,
  startDate?: string,
  endDate?: string
): Promise<void> {
  try {
    // Use provided date range (from client) or fallback to server's local time
    const startOfRange = startDate
      ? new Date(startDate)
      : new Date(new Date().setHours(0, 0, 0, 0))

    const endOfRange = endDate
      ? new Date(endDate)
      : new Date(new Date().setHours(23, 59, 59, 999))

    await prisma.sequenceActivity.deleteMany({
      where: {
        userId,
        sequenceId,
        datePerformed: {
          gte: startOfRange,
          lte: endOfRange,
        },
      },
    })
  } catch (error) {
    logServiceError(
      error,
      'sequenceActivityService',
      'deleteSequenceActivity',
      {
        userId,
        sequenceId,
      }
    )
    throw error
  }
}

/**
 * Get weekly sequence activity data for a specific sequence
 */
export async function getSequenceWeeklyActivity(
  userId: string,
  sequenceId: string,
  startDate?: string | Date,
  endDate?: string | Date
): Promise<WeeklySequenceActivityData> {
  try {
    // Use provided date range (client local) or fallback to server-calculated week
    const startOfRange = startDate ? new Date(startDate) : null
    const endOfRange = endDate ? new Date(endDate) : null

    const now = new Date()
    if (!startOfRange || !endOfRange) {
      const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

      const computedStart = new Date(now)
      computedStart.setDate(now.getDate() - daysFromMonday)
      computedStart.setHours(0, 0, 0, 0)

      const computedEnd = new Date(computedStart)
      computedEnd.setDate(computedStart.getDate() + 6)
      computedEnd.setHours(23, 59, 59, 999)

      if (!startOfRange) startDate = computedStart
      if (!endOfRange) endDate = computedEnd
    }

    const startOfWeek = startDate
      ? new Date(startDate)
      : new Date(new Date().setHours(0, 0, 0, 0))
    const endOfWeek = endDate
      ? new Date(endDate)
      : new Date(new Date().setHours(23, 59, 59, 999))

    const activities = await prisma.sequenceActivity.findMany({
      where: {
        userId,
        sequenceId,
        datePerformed: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        datePerformed: 'desc',
      },
    })

    const activityData = activities.map((activity) => ({
      id: activity.id,
      datePerformed: activity.datePerformed.toISOString(),
      duration: activity.duration,
      completionStatus: activity.completionStatus,
      difficulty: activity.difficulty ?? undefined,
    }))

    return {
      count: activities.length,
      activities: activityData,
      dateRange: {
        start: startOfWeek,
        end: endOfWeek,
      },
    }
  } catch (error) {
    logServiceError(
      error,
      'sequenceActivityService',
      'getSequenceWeeklyActivity',
      {
        userId,
        sequenceId,
      }
    )
    throw error
  }
}

/**
 * Get all sequence weekly activity summary for a user
 */
export async function getAllSequenceWeeklyActivity(
  userId: string,
  startDate?: string | Date,
  endDate?: string | Date
): Promise<{
  totalActivities: number
  sequenceStats: Record<
    string,
    {
      count: number
      sequenceName: string
      lastPerformed: Date
      activities: SequenceActivityData[]
    }
  >
  dateRange: {
    start: Date
    end: Date
  }
}> {
  try {
    // Use provided date range (client local) or fallback to server week
    const startOfRange = startDate ? new Date(startDate) : null
    const endOfRange = endDate ? new Date(endDate) : null

    const now = new Date()
    if (!startOfRange || !endOfRange) {
      const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

      const computedStart = new Date(now)
      computedStart.setDate(now.getDate() - daysFromMonday)
      computedStart.setHours(0, 0, 0, 0)

      const computedEnd = new Date(computedStart)
      computedEnd.setDate(computedStart.getDate() + 6)
      computedEnd.setHours(23, 59, 59, 999)

      if (!startOfRange) startDate = computedStart
      if (!endOfRange) endDate = computedEnd
    }

    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setHours(0, 0, 0, 0))
    const end = endDate
      ? new Date(endDate)
      : new Date(new Date().setHours(23, 59, 59, 999))

    const activities = await prisma.sequenceActivity.findMany({
      where: {
        userId,
        datePerformed: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        datePerformed: 'desc',
      },
    })

    const sequenceStats: Record<
      string,
      {
        count: number
        sequenceName: string
        lastPerformed: Date
        activities: SequenceActivityData[]
      }
    > = {}

    activities.forEach((activity) => {
      const activityData: SequenceActivityData = {
        id: activity.id,
        userId: activity.userId,
        sequenceId: activity.sequenceId,
        sequenceName: activity.sequenceName,
        datePerformed: activity.datePerformed,
        difficulty: activity.difficulty ?? undefined,
        completionStatus: activity.completionStatus,
        duration: activity.duration,
        notes: activity.notes ?? undefined,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      }

      if (!sequenceStats[activity.sequenceId]) {
        sequenceStats[activity.sequenceId] = {
          count: 0,
          sequenceName: activity.sequenceName,
          lastPerformed: activity.datePerformed,
          activities: [],
        }
      }

      sequenceStats[activity.sequenceId].count++
      sequenceStats[activity.sequenceId].activities.push(activityData)

      if (
        activity.datePerformed >
        sequenceStats[activity.sequenceId].lastPerformed
      ) {
        sequenceStats[activity.sequenceId].lastPerformed =
          activity.datePerformed
      }
    })

    return {
      totalActivities: activities.length,
      sequenceStats,
      dateRange: {
        start,
        end,
      },
    }
  } catch (error) {
    logServiceError(
      error,
      'sequenceActivityService',
      'getAllSequenceWeeklyActivity',
      {
        userId,
      }
    )
    throw error
  }
}

/**
 * Get recent sequence activities for home page display
 */
export async function getRecentSequenceActivities(
  userId: string,
  limit: number = 5
) {
  try {
    const activities = await prisma.sequenceActivity.findMany({
      where: { userId },
      orderBy: { datePerformed: 'desc' },
      take: limit,
    })

    return activities.map((activity) => ({
      id: activity.id,
      type: 'sequence' as const,
      name: activity.sequenceName,
      datePerformed: activity.datePerformed,
      difficulty: activity.difficulty,
      completionStatus: activity.completionStatus,
      link: `/sequences/${activity.sequenceId}`,
    }))
  } catch (error) {
    logServiceError(
      error,
      'sequenceActivityService',
      'getRecentSequenceActivities',
      {
        userId,
        limit,
      }
    )
    throw error
  }
}
