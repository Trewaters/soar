import { prisma } from './prismaClient'
import { logServiceError, logDatabaseError } from './errorLogger'

export type AsanaActivityInput = {
  userId: string
  poseId: string
  poseName: string
  sort_english_name: string
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

    // Prisma schema may still expect legacy pose fields during migration.
    // Populate them from the incoming pose fields to be tolerant.
    const dbData: any = {
      ...data,
      poseId: input.poseId,
      poseName: input.poseName,
    }

    const result = await prisma.asanaActivity.create({
      data: dbData,
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
 * Delete an activity for a specific user and pose on today's date only.
 * This is used for streak tracking - only removes today's activity, preserving historical data.
 */
export async function deleteAsanaActivity(userId: string, poseId: string) {
  try {
    // Get today's date range (start and end of today)
    const today = new Date()
    const startOfToday = new Date(today)
    startOfToday.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    // Delete only today's activity for this user and pose
    const result = await prisma.asanaActivity.deleteMany({
      where: {
        userId,
        poseId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
        },
      } as any,
    })

    return result
  } catch (error) {
    logDatabaseError(error, 'deleteMany', 'AsanaActivity', {
      userId,
      poseId,
    })
    logServiceError(error, 'asanaActivityService', 'deleteAsanaActivity', {
      userId,
      poseId,
      operation: 'delete_activity',
    })
    throw error
  }
}

/**
 * Check if an activity exists for a specific user and pose on today's date.
 * This is used for streak tracking - only activities performed today count for the current streak.
 */
export async function checkExistingActivity(userId: string, poseId: string) {
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
        poseId,
        datePerformed: {
          gte: startOfToday,
          lte: endOfToday,
        },
      } as any,
      orderBy: {
        datePerformed: 'desc',
      },
    })

    return activity
  } catch (error) {
    logDatabaseError(error, 'findFirst', 'AsanaActivity', {
      userId,
      poseId,
    })
    logServiceError(error, 'asanaActivityService', 'checkExistingActivity', {
      userId,
      poseId,
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
      } as any,
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
      where: { userId } as any,
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

export async function getPoseWeeklyCount(userId: string, poseId: string) {
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
        poseId,
        datePerformed: {
          gte: startDate,
          lte: endDate,
        },
      } as any,
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
      poseId,
      operation: 'weekly_count',
    })
    logServiceError(error, 'asanaActivityService', 'getPoseWeeklyCount', {
      userId,
      poseId,
      operation: 'get_weekly_count',
    })
    throw error
  }
}

export async function getAllPosesWeeklyCount(userId: string) {
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
      } as any,
      orderBy: { datePerformed: 'desc' },
    })

    // Group by poseId (fallback to poseId) and count
    const poseStats: Record<
      string,
      {
        count: number
        poseName: string
        lastPerformed: Date
        activities: typeof activities
      }
    > = {}

    activities.forEach((activity) => {
      // Some records may still use poseId during migration; prefer poseId but fall back to poseId
      const key =
        (activity as any).poseId || (activity as any).poseId || 'unknown'

      if (!poseStats[key]) {
        poseStats[key] = {
          count: 0,
          poseName:
            (activity as any).poseName || (activity as any).poseName || '',
          lastPerformed: activity.datePerformed,
          activities: [],
        }
      }

      poseStats[key].count++
      poseStats[key].activities.push(activity)

      // Update last performed if this activity is more recent
      if (activity.datePerformed > poseStats[key].lastPerformed) {
        poseStats[key].lastPerformed = activity.datePerformed
      }
    })

    return {
      totalActivities: activities.length,
      poseStats,
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
    logServiceError(error, 'asanaActivityService', 'getAllPosesWeeklyCount', {
      userId,
      operation: 'get_weekly_summary',
    })
    throw error
  }
}
