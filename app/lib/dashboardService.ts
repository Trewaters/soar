import { prisma } from './prismaClient'

interface PracticeHistoryItem {
  month: string
  days: number
}

interface MostCommonItem {
  name: string
  count: number
}

interface DashboardStats {
  loginStreak: number
  activityStreak: number
  practiceHistory: PracticeHistoryItem[]
  mostCommonAsanas: MostCommonItem[]
  mostCommonSeries: MostCommonItem[]
  mostCommonSequences: MostCommonItem[]
  nextGoal: {
    text: string
    current: number
    target: number
    progress: number
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
 * Calculate activity streak from practice activities
 *
 * This calculates consecutive days where ANY activity was performed
 * (asana poses, series, or sequences). Multiple activities on the same
 * day count as a single day towards the streak.
 *
 * The streak is broken if there's a gap of more than 1 day between activities.
 * Activities from today or yesterday keep the streak alive.
 */
export async function calculateActivityStreak(userId: string): Promise<number> {
  // Get all practice activities (asanas, series, sequences)
  const [asanaActivities, seriesActivities, sequenceActivities] =
    await Promise.all([
      prisma.asanaActivity.findMany({
        where: { userId },
        select: { datePerformed: true },
      }),
      prisma.seriesActivity.findMany({
        where: { userId },
        select: { datePerformed: true },
      }),
      prisma.sequenceActivity.findMany({
        where: { userId },
        select: { datePerformed: true },
      }),
    ])

  // Combine all activities into one array
  const allActivities: Date[] = [
    ...asanaActivities.map((a: { datePerformed: Date }) => a.datePerformed),
    ...seriesActivities.map((a: { datePerformed: Date }) => a.datePerformed),
    ...sequenceActivities.map((a: { datePerformed: Date }) => a.datePerformed),
  ]

  if (allActivities.length === 0) return 0

  // Get unique days with activity (use local date strings for user calendar alignment)
  const uniqueDays = new Set<string>()
  for (const activity of allActivities) {
    const activityDate = new Date(activity)
    // Use local date parts to match user's calendar day
    const year = activityDate.getFullYear()
    const month = String(activityDate.getMonth() + 1).padStart(2, '0')
    const day = String(activityDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    uniqueDays.add(dateStr)
  }

  // Sort days in descending order (most recent first)
  const sortedDays = Array.from(uniqueDays).sort().reverse()

  // Get today's date in local timezone format
  const today = new Date()

  // Check if there's activity today or yesterday to keep streak alive
  const lastActivityStr = sortedDays[0]
  const [lastYear, lastMonth, lastDay] = lastActivityStr.split('-').map(Number)
  const lastActivityDate = new Date(lastYear, lastMonth - 1, lastDay)
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const daysDiff = Math.floor(
    (todayDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // If last activity was more than 1 day ago, streak is broken
  if (daysDiff > 1) {
    return 0
  }

  // Count consecutive days backwards from today
  let streak = 0
  for (let i = 0; i < sortedDays.length; i++) {
    const expectedDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i
    )
    const expYear = expectedDate.getFullYear()
    const expMonth = String(expectedDate.getMonth() + 1).padStart(2, '0')
    const expDay = String(expectedDate.getDate()).padStart(2, '0')
    const expectedStr = `${expYear}-${expMonth}-${expDay}`

    if (sortedDays[i] === expectedStr) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * Calculate longest streak from practice activities
 */
export async function calculateLongestStreak(userId: string): Promise<number> {
  const [asanaActivities, seriesActivities, sequenceActivities] =
    await Promise.all([
      prisma.asanaActivity.findMany({
        where: { userId },
        select: { datePerformed: true },
      }),
      prisma.seriesActivity.findMany({
        where: { userId },
        select: { datePerformed: true },
      }),
      prisma.sequenceActivity.findMany({
        where: { userId },
        select: { datePerformed: true },
      }),
    ])

  const allActivities = [
    ...asanaActivities.map((a) => a.datePerformed),
    ...seriesActivities.map((a) => a.datePerformed),
    ...sequenceActivities.map((a) => a.datePerformed),
  ]

  if (allActivities.length === 0) return 0

  const uniqueDays = new Set<string>()
  for (const activity of allActivities) {
    const activityDate = new Date(activity)
    activityDate.setHours(0, 0, 0, 0)
    uniqueDays.add(activityDate.toISOString().split('T')[0])
  }

  const sortedDays = Array.from(uniqueDays).sort()

  let maxStreak = 0
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

  return Math.max(maxStreak, 1)
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

  const [asanaActivities, seriesActivities, sequenceActivities] =
    await Promise.all([
      prisma.asanaActivity.findMany({
        where: {
          userId,
          datePerformed: { gte: twelveMonthsAgo },
        },
        select: { datePerformed: true },
      }),
      prisma.seriesActivity.findMany({
        where: {
          userId,
          datePerformed: { gte: twelveMonthsAgo },
        },
        select: { datePerformed: true },
      }),
      prisma.sequenceActivity.findMany({
        where: {
          userId,
          datePerformed: { gte: twelveMonthsAgo },
        },
        select: { datePerformed: true },
      }),
    ])

  const allActivities = [
    ...asanaActivities.map((a) => a.datePerformed),
    ...seriesActivities.map((a) => a.datePerformed),
    ...sequenceActivities.map((a) => a.datePerformed),
  ]

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
  userId: string
): Promise<DashboardStats> {
  const debugPrefix = '[DashboardService Debug]'
  const startTime = Date.now()

  try {
    const [
      loginStreak,
      activityStreak,
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
      calculateActivityStreak(userId).catch((err) => {
        console.error(`${debugPrefix} calculateActivityStreak failed`, {
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

    // Calculate next goal based on current month's practice with progressive tiers
    const currentMonthDays =
      practiceHistory[practiceHistory.length - 1]?.days || 0
    const goalTiers = [30, 60, 90, 180, 365]
    const ultimateGoal = 365

    // Calculate how many goal tiers have been achieved
    const tiersAchieved = goalTiers.filter(
      (tier) => currentMonthDays >= tier
    ).length

    // Calculate how many times the ultimate goal (365) has been completed
    const ultimateGoalsCompleted = Math.floor(currentMonthDays / ultimateGoal)

    // Find the next goal tier that hasn't been reached yet
    const nextGoalTier = goalTiers.find((tier) => currentMonthDays < tier)
    const goalTarget = nextGoalTier || goalTiers[goalTiers.length - 1]
    const daysRemaining = goalTarget - currentMonthDays

    const nextGoal = {
      text:
        daysRemaining > 0
          ? `Practice ${daysRemaining} More ${daysRemaining === 1 ? 'Day' : 'Days'}`
          : currentMonthDays >= goalTiers[goalTiers.length - 1]
            ? 'Ultimate Goal Achieved! 🎉'
            : 'Goal Achieved! 🎉',
      current: currentMonthDays,
      target: goalTarget,
      progress: Math.min(
        Math.round((currentMonthDays / goalTarget) * 100),
        100
      ),
      tiersAchieved,
      ultimateGoalsCompleted,
    }

    return {
      loginStreak,
      activityStreak,
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
