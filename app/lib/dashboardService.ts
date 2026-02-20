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
      calculateActivityStreak(userId).catch((err) => {
        console.error(`${debugPrefix} calculateActivityStreak failed`, {
          userId,
          error: err,
        })
        return 0
      }),
      calculateLongestStreak(userId).catch((err) => {
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

    // Calculate next goal based on continuous activity streak
    const continuousPracticeDays = activityStreak
    const baseGoalTiers = [30, 60, 90, 180, 365]
    const ultimateGoal = 365

    // Count how many base tiers (including the first yearly 365) are achieved
    const baseTiersAchieved = baseGoalTiers.filter(
      (tier) => continuousPracticeDays >= tier
    ).length

    // How many full years have been completed (1 => first 365 achieved)
    const yearsCompleted = Math.floor(continuousPracticeDays / ultimateGoal)

    // Additional yearly milestones beyond the first year
    const extraYearlyTiersAchieved = Math.max(0, yearsCompleted - 1)

    // Total tiers achieved includes the base tiers plus any extra yearly milestones
    const tiersAchieved = baseTiersAchieved + extraYearlyTiersAchieved

    // Define encouraging names for each achieved tier. Additional yearly names
    // can be appended later; when not provided, we reuse the last name.
    const tierNames = [
      'Get started!', // 0 tiers
      'Yoga practitioner in Training', // 30 days
      'Dedicated to Yoga', // 60 days
      'Discover the Inner Guru', // 90 days
      'Six (6) month Sage', // 180 days
      'Yearly Transformation', // 365 days
      'The Acharya Teacher', // 2nd year
      'The Muni Sage', // 3rd year
      // future yearly names may be appended here
    ]

    const tierIndex = Math.max(
      0,
      Math.min(tiersAchieved, tierNames.length - 1)
    )
    const currentTierName = tierNames[tierIndex] ?? 'Get started!'

    // How many full 365-day cycles have been completed
    const ultimateGoalsCompleted = yearsCompleted

    // Determine next goal:
    // - If there's a base tier ahead, use that.
    // - Otherwise use the next multiple of 365 (next yearly goal).
    const nextBaseGoal = baseGoalTiers.find(
      (tier) => continuousPracticeDays < tier
    )
    const goalTarget =
      nextBaseGoal ||
      (Math.floor(continuousPracticeDays / ultimateGoal) + 1) * ultimateGoal
    const daysRemaining = goalTarget - continuousPracticeDays

    const nextGoal = {
      text:
        daysRemaining > 0
          ? `Practice ${daysRemaining} More ${daysRemaining === 1 ? 'Day' : 'Days'}`
          : goalTarget === ultimateGoal
            ? 'Ultimate Goal Achieved! 🎉'
            : goalTarget > ultimateGoal
              ? 'Yearly Goal Achieved! 🎉'
              : 'Goal Achieved! 🎉',
      current: continuousPracticeDays,
      target: goalTarget,
      progress: Math.min(
        Math.round((continuousPracticeDays / goalTarget) * 100),
        100
      ),
      tiersAchieved,
      tierName: currentTierName,
      ultimateGoalsCompleted,
    }

    return {
      loginStreak,
      activityStreak,
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
