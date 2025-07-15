import { PrismaClient } from '../prisma/generated/client'
import { logDatabaseError, logServiceError } from './errorLogger'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

export interface SeriesActivityData {
  id: string
  userId: string
  seriesId: string
  seriesName: string
  datePerformed: Date
  difficulty?: string
  completionStatus: string
  duration: number
  notes?: string
  createdAt: Date
  updatedAt: Date
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
    start: Date
    end: Date
  }
}

/**
 * Create a new series activity record
 */
export async function createSeriesActivity(
  input: CreateSeriesActivityInput
): Promise<SeriesActivityData> {
  try {
    const activity = await prisma.seriesActivity.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        seriesId: input.seriesId,
        seriesName: input.seriesName,
        datePerformed: new Date(),
        difficulty: input.difficulty,
        completionStatus: input.completionStatus || 'complete',
        duration: input.duration || 0,
        notes: input.notes,
      },
    })
    return {
      ...activity,
      difficulty: activity.difficulty ?? undefined,
      notes: activity.notes ?? undefined,
    }
  } catch (error) {
    logDatabaseError(error, 'create', 'SeriesActivity', input)
    logServiceError(error, 'seriesActivityService', 'createSeriesActivity', {
      input,
      operation: 'create_series_activity',
    })
    throw error
  }
}

/**
 * Get all series activities for a user
 */
export async function getUserSeriesHistory(
  userId: string
): Promise<SeriesActivityData[]> {
  try {
    const activities = await prisma.seriesActivity.findMany({
      where: { userId },
      orderBy: { datePerformed: 'desc' },
    })
    return activities.map((activity) => ({
      ...activity,
      difficulty: activity.difficulty ?? undefined,
      notes: activity.notes ?? undefined,
    }))
  } catch (error) {
    logDatabaseError(error, 'findMany', 'SeriesActivity', { userId })
    logServiceError(error, 'seriesActivityService', 'getUserSeriesHistory', {
      userId,
      operation: 'get_user_series_history',
    })
    throw error
  }
}

/**
 * Check if a series activity exists for today
 */
export async function checkExistingSeriesActivity(
  userId: string,
  seriesId: string
): Promise<SeriesActivityData | null> {
  try {
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    const activity = await prisma.seriesActivity.findFirst({
      where: {
        userId,
        seriesId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    })

    return activity
      ? {
          ...activity,
          difficulty: activity.difficulty ?? undefined,
          notes: activity.notes ?? undefined,
        }
      : null
  } catch (error) {
    logDatabaseError(error, 'findFirst', 'SeriesActivity', { userId, seriesId })
    logServiceError(
      error,
      'seriesActivityService',
      'checkExistingSeriesActivity',
      {
        userId,
        seriesId,
        operation: 'check_existing_series_activity',
      }
    )
    throw error
  }
}

/**
 * Delete a series activity for today
 */
export async function deleteSeriesActivity(
  userId: string,
  seriesId: string
): Promise<void> {
  try {
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    await prisma.seriesActivity.deleteMany({
      where: {
        userId,
        seriesId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    })
  } catch (error) {
    logDatabaseError(error, 'deleteMany', 'SeriesActivity', {
      userId,
      seriesId,
    })
    logServiceError(error, 'seriesActivityService', 'deleteSeriesActivity', {
      userId,
      seriesId,
      operation: 'delete_series_activity',
    })
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const activities = await prisma.seriesActivity.findMany({
      where: {
        userId,
        seriesId,
        datePerformed: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { datePerformed: 'desc' },
    })

    return {
      count: activities.length,
      activities: activities.map((activity) => ({
        id: activity.id,
        datePerformed: activity.datePerformed.toISOString(),
        duration: activity.duration,
        completionStatus: activity.completionStatus,
        difficulty: activity.difficulty ?? undefined,
      })),
      dateRange: {
        start: startDate,
        end: endDate,
      },
    }
  } catch (error) {
    logDatabaseError(error, 'findMany', 'SeriesActivity', {
      userId,
      seriesId,
      operation: 'weekly_series_activity',
    })
    logServiceError(error, 'seriesActivityService', 'getSeriesWeeklyActivity', {
      userId,
      seriesId,
      operation: 'get_series_weekly_activity',
    })
    throw error
  }
}

/**
 * Get all series weekly activity summary for a user
 */
export async function getAllSeriesWeeklyActivity(userId: string): Promise<{
  totalActivities: number
  seriesStats: Record<
    string,
    {
      count: number
      seriesName: string
      lastPerformed: Date
      activities: SeriesActivityData[]
    }
  >
  dateRange: {
    start: Date
    end: Date
  }
}> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const activities = await prisma.seriesActivity.findMany({
      where: {
        userId,
        datePerformed: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { datePerformed: 'desc' },
    })

    const seriesStats: Record<
      string,
      {
        count: number
        seriesName: string
        lastPerformed: Date
        activities: SeriesActivityData[]
      }
    > = {}

    activities.forEach((activity) => {
      if (!seriesStats[activity.seriesId]) {
        seriesStats[activity.seriesId] = {
          count: 0,
          seriesName: activity.seriesName,
          lastPerformed: activity.datePerformed,
          activities: [],
        }
      }
      seriesStats[activity.seriesId].count++
      seriesStats[activity.seriesId].activities.push({
        id: activity.id,
        userId: activity.userId,
        seriesId: activity.seriesId,
        seriesName: activity.seriesName,
        datePerformed: activity.datePerformed,
        difficulty: activity.difficulty ?? undefined,
        completionStatus: activity.completionStatus,
        duration: activity.duration,
        notes: activity.notes ?? undefined,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      })

      if (
        activity.datePerformed > seriesStats[activity.seriesId].lastPerformed
      ) {
        seriesStats[activity.seriesId].lastPerformed = activity.datePerformed
      }
    })

    return {
      totalActivities: activities.length,
      seriesStats,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    }
  } catch (error) {
    logDatabaseError(error, 'findMany', 'SeriesActivity', {
      userId,
      operation: 'all_series_weekly_activity',
    })
    logServiceError(
      error,
      'seriesActivityService',
      'getAllSeriesWeeklyActivity',
      {
        userId,
        operation: 'get_all_series_weekly_activity',
      }
    )
    throw error
  }
}
