import { PrismaClient } from '../prisma/generated/client'
import { logServiceError, logDatabaseError } from './errorLogger'

const prisma = new PrismaClient()

export type AsanaActivityInput = {
  userId: string
  postureId: string
  postureName: string
  duration: number
  datePerformed: Date | string // Accept both Date and string, convert in function
  notes?: string
  sensations?: string
  completionStatus: string // 'complete', 'skipped', 'partial'
  difficulty?: string // 'easy', 'average', 'difficult'
}

export async function recordAsanaActivity(input: AsanaActivityInput) {
  try {
    // Ensure datePerformed is a Date object
    const data = {
      ...input,
      datePerformed:
        input.datePerformed instanceof Date
          ? input.datePerformed
          : new Date(input.datePerformed),
    }

    const result = await prisma.asanaActivity.create({
      data,
    })

    return result
  } catch (error) {
    logDatabaseError(error, 'create', 'AsanaActivity', input)
    logServiceError(error, 'asanaActivityService', 'recordAsanaActivity', {
      input,
      operation: 'create_activity',
    })
    throw error
  }
}

/**
 * Delete an activity for a specific user and posture on today's date only.
 * This is used for streak tracking - only removes today's activity, preserving historical data.
 */
export async function deleteAsanaActivity(userId: string, postureId: string) {
  try {
    // Get today's date range (start and end of today)
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    // Delete only today's activity for this user and posture
    const result = await prisma.asanaActivity.deleteMany({
      where: {
        userId,
        postureId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    })

    return result
  } catch (error) {
    logDatabaseError(error, 'deleteMany', 'AsanaActivity', {
      userId,
      postureId,
    })
    logServiceError(error, 'asanaActivityService', 'deleteAsanaActivity', {
      userId,
      postureId,
      operation: 'delete_activity',
    })
    throw error
  }
}

/**
 * Check if an activity exists for a specific user and posture on today's date.
 * This is used for streak tracking - only activities performed today count for the current streak.
 */
export async function checkExistingActivity(userId: string, postureId: string) {
  try {
    // Get today's date range (start and end of today)
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    const activity = await prisma.asanaActivity.findFirst({
      where: {
        userId,
        postureId,
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
  } catch (error) {
    logDatabaseError(error, 'findFirst', 'AsanaActivity', {
      userId,
      postureId,
    })
    logServiceError(error, 'asanaActivityService', 'checkExistingActivity', {
      userId,
      postureId,
      operation: 'check_activity',
    })
    throw error
  }
}

export async function getDailyAsanaSummary(userId: string, date: Date) {
  try {
    // Get all activities for the user on the given date
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    return await prisma.asanaActivity.findMany({
      where: {
        userId,
        datePerformed: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { datePerformed: 'asc' },
    })
  } catch (error) {
    console.error('Error in getDailyAsanaSummary:', error)
    throw error
  }
}

export async function getUserAsanaHistory(userId: string) {
  try {
    return await prisma.asanaActivity.findMany({
      where: { userId },
      orderBy: { datePerformed: 'desc' },
    })
  } catch (error) {
    logDatabaseError(error, 'findMany', 'AsanaActivity', {
      userId,
      operation: 'user_history',
    })
    logServiceError(error, 'asanaActivityService', 'getUserAsanaHistory', {
      userId,
      operation: 'get_user_history',
    })
    throw error
  }
}

export async function getPostureWeeklyCount(userId: string, postureId: string) {
  try {
    // Get activities for the past 7 days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const activities = await prisma.asanaActivity.findMany({
      where: {
        userId,
        postureId,
        datePerformed: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { datePerformed: 'desc' },
    })

    return {
      count: activities.length,
      activities,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    }
  } catch (error) {
    logDatabaseError(error, 'findMany', 'AsanaActivity', {
      userId,
      postureId,
      operation: 'weekly_count',
    })
    logServiceError(error, 'asanaActivityService', 'getPostureWeeklyCount', {
      userId,
      postureId,
      operation: 'get_weekly_count',
    })
    throw error
  }
}

export async function getAllPosturesWeeklyCount(userId: string) {
  try {
    // Get all activities for the past 7 days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const activities = await prisma.asanaActivity.findMany({
      where: {
        userId,
        datePerformed: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { datePerformed: 'desc' },
    })

    // Group by postureId and count
    const postureStats: Record<
      string,
      {
        count: number
        postureName: string
        lastPerformed: Date
        activities: typeof activities
      }
    > = {}

    activities.forEach((activity) => {
      if (!postureStats[activity.postureId]) {
        postureStats[activity.postureId] = {
          count: 0,
          postureName: activity.postureName,
          lastPerformed: activity.datePerformed,
          activities: [],
        }
      }
      postureStats[activity.postureId].count++
      postureStats[activity.postureId].activities.push(activity)

      // Update last performed if this activity is more recent
      if (
        activity.datePerformed > postureStats[activity.postureId].lastPerformed
      ) {
        postureStats[activity.postureId].lastPerformed = activity.datePerformed
      }
    })

    return {
      totalActivities: activities.length,
      postureStats,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    }
  } catch (error) {
    logDatabaseError(error, 'findMany', 'AsanaActivity', {
      userId,
      operation: 'weekly_summary',
    })
    logServiceError(
      error,
      'asanaActivityService',
      'getAllPosturesWeeklyCount',
      {
        userId,
        operation: 'get_weekly_summary',
      }
    )
    throw error
  }
}
