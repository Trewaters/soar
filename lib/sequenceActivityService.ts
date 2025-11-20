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
 * Check if a sequence activity exists for today
 * Uses local timezone to align with user's calendar day.
 */
export async function checkExistingSequenceActivity(
  userId: string,
  sequenceId: string
): Promise<SequenceActivityData | null> {
  try {
    // Get today's date range in local timezone (start and end of today)
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

    const activity = await prisma.sequenceActivity.findFirst({
      where: {
        userId,
        sequenceId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
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
 * Delete a sequence activity for today
 * Uses local timezone to align with user's calendar day.
 */
export async function deleteSequenceActivity(
  userId: string,
  sequenceId: string
): Promise<void> {
  try {
    // Get today's date range in local timezone (start and end of today)
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

    await prisma.sequenceActivity.deleteMany({
      where: {
        userId,
        sequenceId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
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
  sequenceId: string
): Promise<WeeklySequenceActivityData> {
  try {
    // Calculate Monday-to-Sunday calendar week
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - daysFromMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

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
export async function getAllSequenceWeeklyActivity(userId: string): Promise<{
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
    // Calculate Monday-to-Sunday calendar week
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - daysFromMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const activities = await prisma.sequenceActivity.findMany({
      where: {
        userId,
        datePerformed: {
          gte: startOfWeek,
          lte: endOfWeek,
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
        start: startOfWeek,
        end: endOfWeek,
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
      link: `/navigator/sequences/${activity.sequenceId}`,
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
