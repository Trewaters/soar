import { prisma } from './prismaClient'
import { logServiceError, logDatabaseError } from './errorLogger'

export type AsanaActivityInput = {
  userId: string
  asanaId: string
  asanaName: string
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
 * Delete an activity for a specific user and asana on today's date only.
 * This is used for streak tracking - only removes today's activity, preserving historical data.
 * Uses local timezone to align with user's calendar day.
 */
export async function deleteAsanaActivity(userId: string, asanaId: string) {
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

    // Delete only today's activity for this user and asana
    const result = await prisma.asanaActivity.deleteMany({
      where: {
        userId,
        asanaId,
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
      asanaId,
    })
    logServiceError(error, 'asanaActivityService', 'deleteAsanaActivity', {
      userId,
      asanaId,
      operation: 'delete_activity',
    })
    throw error
  }
}

/**
 * Check if an activity exists for a specific user and asana on today's date.
 * This is used for streak tracking - only activities performed today count for the current streak.
 * Uses local timezone to align with user's calendar day.
 */
export async function checkExistingActivity(userId: string, asanaId: string) {
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

    const activity = await prisma.asanaActivity.findFirst({
      where: {
        userId,
        asanaId,
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
      asanaId,
    })
    logServiceError(error, 'asanaActivityService', 'checkExistingActivity', {
      userId,
      asanaId,
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

export async function getAsanaWeeklyCount(userId: string, asanaId: string) {
  try {
    // Calculate Monday-to-Sunday calendar week
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

    const startDate = new Date(now)
    startDate.setDate(now.getDate() - daysFromMonday)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)

    const activities = await prisma.asanaActivity.findMany({
      where: {
        userId,
        asanaId,
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
      asanaId,
      operation: 'weekly_count',
    })
    logServiceError(error, 'asanaActivityService', 'getAsanaWeeklyCount', {
      userId,
      asanaId,
      operation: 'get_weekly_count',
    })
    throw error
  }
}

export async function getAllPosesWeeklyCount(userId: string) {
  try {
    // Calculate Monday-to-Sunday calendar week
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

    const startDate = new Date(now)
    startDate.setDate(now.getDate() - daysFromMonday)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
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

    // Group by asanaId and count
    const asanaStats: Record<
      string,
      {
        count: number
        asanaName: string
        lastPerformed: Date
        activities: typeof activities
      }
    > = {}

    activities.forEach((activity) => {
      const key = (activity as any).asanaId || 'unknown'

      if (!asanaStats[key]) {
        asanaStats[key] = {
          count: 0,
          asanaName: (activity as any).asanaName || '',
          lastPerformed: activity.datePerformed,
          activities: [],
        }
      }

      asanaStats[key].count++
      asanaStats[key].activities.push(activity)

      // Update last performed if this activity is more recent
      if (activity.datePerformed > asanaStats[key].lastPerformed) {
        asanaStats[key].lastPerformed = activity.datePerformed
      }
    })

    return {
      totalActivities: activities.length,
      asanaStats,
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
