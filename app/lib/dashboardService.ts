import { prisma } from './prismaClient'
import {
  buildNextGoalFromActivityStreak,
  calculateCurrentActivityStreakFromDateKeys,
  calculateLongestActivityStreakFromDateKeys,
  getUniqueActivityDateKeys,
} from './activityStreakCalculator'
import {
  extractActivityDatesFromSources,
  fetchUserActivitySourceRecords,
} from './activityStreakServer'

export interface PracticeHistoryItem {
  month: string
  days: number
}

export interface MostCommonItem {
  name: string
  count: number
}

export interface DashboardStats {
  loginStreak: number
  longestLoginStreak: number
  activityStreak: number
  activityStreakAtRisk: boolean
  longestStreak: number
  practiceHistory: PracticeHistoryItem[]
  mostCommonAsanas: MostCommonItem[]
  mostCommonSeries: MostCommonItem[]
  mostCommonSequences: MostCommonItem[]
  nextGoal: {
    text: string
    current: number
    target: number
    progress: number
    tiersAchieved: number
    tierName: string
    ultimateGoalsCompleted: number
  }
}

/**
 * Calculate login streak from UserLogin records
 */
export async function calculateLoginStreak(userId: string): Promise<number> {
  const logins = await prisma.userLogin.findMany({
    where: { userId },
    orderBy: { loginDate: 'desc' },
    select: { loginDate: true },
  })

  if (logins.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if there's a login today or yesterday
  const lastLogin = new Date(logins[0].loginDate)
  lastLogin.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor(
    (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
  )

  // If last login was more than 1 day ago, streak is broken
  if (daysDiff > 1) return 0

  // Count consecutive days
  const uniqueDays = new Set<string>()
  for (const login of logins) {
    const loginDate = new Date(login.loginDate)
    loginDate.setHours(0, 0, 0, 0)
    uniqueDays.add(loginDate.toISOString().split('T')[0])
  }

  const sortedDays = Array.from(uniqueDays).sort().reverse()

  for (let i = 0; i < sortedDays.length; i++) {
    const currentDate = new Date(sortedDays[i])
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    expectedDate.setHours(0, 0, 0, 0)

    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * Calculate longest historical login streak from UserLogin records
 */
export async function calculateLongestLoginStreak(
  userId: string
): Promise<number> {
  const logins = await prisma.userLogin.findMany({
    where: { userId },
    select: { loginDate: true },
  })

  if (logins.length === 0) return 0

  const uniqueDays = new Set<string>()
  for (const login of logins) {
    const loginDate = new Date(login.loginDate)
    loginDate.setHours(0, 0, 0, 0)
    uniqueDays.add(loginDate.toISOString().split('T')[0])
  }

  const sortedDays = Array.from(uniqueDays).sort()

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1])
    const currDate = new Date(sortedDays[i])

    const daysDiff = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

/**
 * Calculate activity streak from practice activities
 *
 * This calculates consecutive days where ANY activity was performed
 * (asana poses, series, or sequences). Multiple activities on the same
 * day count as a single day towards the streak.
 *
 * The streak is broken if there's a gap of more than 1 day between activities.
 * Activities from today or yesterday keep the streak alive.
 */
export async function calculateActivityStreak(
  userId: string,
  timezoneOffsetMinutes = 0
): Promise<number> {
  const streakStatus = await calculateActivityStreakStatus(
    userId,
    timezoneOffsetMinutes
  )
  return streakStatus.currentStreak
}

/**
 * Calculate activity streak status from practice activities
 *
 * - `currentStreak` is the active consecutive day count ending on the user's
 *   most recent activity day (today or yesterday).
 * - `isActiveToday` indicates whether activity has been recorded today.
 * - `isAtRisk` indicates a non-zero streak that has activity yesterday but not
 *   today, meaning it will reset if no activity is recorded today.
 */
export async function calculateActivityStreakStatus(
  userId: string,
  timezoneOffsetMinutes = 0
): Promise<{
  currentStreak: number
  isActiveToday: boolean
  isAtRisk: boolean
}> {
  const activitySources = await fetchUserActivitySourceRecords(userId)
  const allActivities = extractActivityDatesFromSources(activitySources)

  if (allActivities.length === 0) {
    return {
      currentStreak: 0,
      isActiveToday: false,
      isAtRisk: false,
    }
  }

  const sortedDays = getUniqueActivityDateKeys(
    allActivities,
    timezoneOffsetMinutes
  )

  return calculateCurrentActivityStreakFromDateKeys(
    sortedDays,
    timezoneOffsetMinutes
  )
}

/**
 * Calculate longest streak from practice activities
 */
export async function calculateLongestStreak(
  userId: string,
  timezoneOffsetMinutes = 0
): Promise<number> {
  const activitySources = await fetchUserActivitySourceRecords(userId)
  const allActivities = extractActivityDatesFromSources(activitySources)

  if (allActivities.length === 0) return 0

  const sortedDays = getUniqueActivityDateKeys(
    allActivities,
    timezoneOffsetMinutes
  )
  return calculateLongestActivityStreakFromDateKeys(sortedDays)
}

/**
 * Get practice history for the last 12 months
 */
export async function getPracticeHistory(
  userId: string
): Promise<PracticeHistoryItem[]> {
  const now = new Date()
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(now.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const activitySources = await fetchUserActivitySourceRecords(userId, {
    fromDate: twelveMonthsAgo,
  })
  const allActivities = extractActivityDatesFromSources(activitySources)

  // Group by month
  const monthCounts = new Map<string, Set<string>>()

  for (const activity of allActivities) {
    const date = new Date(activity)
    // Use local date parts to align with user's calendar
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayKey = `${year}-${month}-${day}`

    if (!monthCounts.has(monthKey)) {
      monthCounts.set(monthKey, new Set())
    }
    monthCounts.get(monthKey)!.add(dayKey)
  }

  // Generate last 12 months
  const history: PracticeHistoryItem[] = []
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  for (let i = 11; i >= 0; i--) {
    // Create a new date from now for each iteration to avoid mutation issues
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)

    // Use local timezone to match how we're storing the activity month keys
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = monthNames[date.getMonth()]
    const yearShort = String(date.getFullYear()).slice(2)
    const label = `${monthName} ${yearShort}`

    const days = monthCounts.get(monthKey)?.size || 0

    history.push({
      month: label,
      days,
    })
  }

  return history
}

/**
 * Get most common asanas
 */
export async function getMostCommonAsanas(
  userId: string
): Promise<MostCommonItem[]> {
  // Calculate date 12 months ago (local timezone)
  const now = new Date()
  const twelveMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
    0,
    0,
    0,
    0
  )

  const activities = await prisma.asanaActivity.groupBy({
    by: ['asanaName'],
    where: {
      userId,
      datePerformed: {
        gte: twelveMonthsAgo,
      },
    },
    _count: { asanaName: true },
    orderBy: { _count: { asanaName: 'desc' } },
    take: 3,
  })

  return activities.map((activity) => ({
    name: activity.asanaName,
    count: activity._count.asanaName,
  }))
}

/**
 * Get most common series
 */
export async function getMostCommonSeries(
  userId: string
): Promise<MostCommonItem[]> {
  // Calculate date 12 months ago (local timezone)
  const now = new Date()
  const twelveMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
    0,
    0,
    0,
    0
  )

  const activities = await prisma.seriesActivity.groupBy({
    by: ['seriesName'],
    where: {
      userId,
      datePerformed: {
        gte: twelveMonthsAgo,
      },
    },
    _count: { seriesName: true },
    orderBy: { _count: { seriesName: 'desc' } },
    take: 3,
  })

  return activities.map((activity) => ({
    name: activity.seriesName,
    count: activity._count.seriesName,
  }))
}

/**
 * Get most common sequences
 */
export async function getMostCommonSequences(
  userId: string
): Promise<MostCommonItem[]> {
  // Calculate date 12 months ago (local timezone)
  const now = new Date()
  const twelveMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 11,
    1,
    0,
    0,
    0,
    0
  )

  const activities = await prisma.sequenceActivity.groupBy({
    by: ['sequenceName'],
    where: {
      userId,
      datePerformed: {
        gte: twelveMonthsAgo,
      },
    },
    _count: { sequenceName: true },
    orderBy: { _count: { sequenceName: 'desc' } },
    take: 3,
  })

  return activities.map((activity) => ({
    name: activity.sequenceName,
    count: activity._count.sequenceName,
  }))
}

/**
 * Get all dashboard statistics for a user
 */
export async function getDashboardStats(
  userId: string,
  timezoneOffsetMinutes = 0
): Promise<DashboardStats> {
  const debugPrefix = '[DashboardService Debug]'
  const startTime = Date.now()

  try {
    const [
      loginStreak,
      longestLoginStreak,
      activityStreakStatus,
      longestStreak,
      practiceHistory,
      mostCommonAsanas,
      mostCommonSeries,
      mostCommonSequences,
    ] = await Promise.all([
      calculateLoginStreak(userId).catch((err) => {
        console.error(`${debugPrefix} calculateLoginStreak failed`, {
          userId,
          error: err,
        })
        return 0
      }),
      calculateLongestLoginStreak(userId).catch((err) => {
        console.error(`${debugPrefix} calculateLongestLoginStreak failed`, {
          userId,
          error: err,
        })
        return 0
      }),
      calculateActivityStreakStatus(userId, timezoneOffsetMinutes).catch(
        (err) => {
          console.error(`${debugPrefix} calculateActivityStreakStatus failed`, {
            userId,
            error: err,
          })
          return {
            currentStreak: 0,
            isActiveToday: false,
            isAtRisk: false,
          }
        }
      ),
      calculateLongestStreak(userId, timezoneOffsetMinutes).catch((err) => {
        console.error(`${debugPrefix} calculateLongestStreak failed`, {
          userId,
          error: err,
        })
        return 0
      }),
      getPracticeHistory(userId).catch((err) => {
        console.error(`${debugPrefix} getPracticeHistory failed`, {
          userId,
          error: err,
        })
        return []
      }),
      getMostCommonAsanas(userId).catch((err) => {
        console.error(`${debugPrefix} getMostCommonAsanas failed`, {
          userId,
          error: err,
        })
        return []
      }),
      getMostCommonSeries(userId).catch((err) => {
        console.error(`${debugPrefix} getMostCommonSeries failed`, {
          userId,
          error: err,
        })
        return []
      }),
      getMostCommonSequences(userId).catch((err) => {
        console.error(`${debugPrefix} getMostCommonSequences failed`, {
          userId,
          error: err,
        })
        return []
      }),
    ])

    const nextGoal = buildNextGoalFromActivityStreak(
      activityStreakStatus.currentStreak
    )

    return {
      loginStreak,
      longestLoginStreak,
      activityStreak: activityStreakStatus.currentStreak,
      activityStreakAtRisk: activityStreakStatus.isAtRisk,
      longestStreak,
      practiceHistory,
      mostCommonAsanas,
      mostCommonSeries,
      mostCommonSequences,
      nextGoal,
    }
  } catch (error) {
    console.error(`${debugPrefix} getDashboardStats failed`, {
      userId,
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      elapsedMs: Date.now() - startTime,
    })
    throw error
  }
}
