import { PrismaClient } from '../../prisma/generated/client'

const prisma = new PrismaClient()

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

  const allActivities: Date[] = [
    ...asanaActivities.map((a: { datePerformed: Date }) => a.datePerformed),
    ...seriesActivities.map((a: { datePerformed: Date }) => a.datePerformed),
    ...sequenceActivities.map((a: { datePerformed: Date }) => a.datePerformed),
  ]

  if (allActivities.length === 0) return 0

  // Get unique days with activity
  const uniqueDays = new Set<string>()
  for (const activity of allActivities) {
    const activityDate = new Date(activity)
    activityDate.setHours(0, 0, 0, 0)
    uniqueDays.add(activityDate.toISOString().split('T')[0])
  }

  const sortedDays = Array.from(uniqueDays).sort().reverse()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if there's activity today or yesterday
  const lastActivity = new Date(sortedDays[0])
  const daysDiff = Math.floor(
    (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysDiff > 1) return 0

  let streak = 0
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
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const dayKey = date.toISOString().split('T')[0]

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
    const date = new Date()
    date.setMonth(now.getMonth() - i)

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = monthNames[date.getMonth()]
    const yearShort = String(date.getFullYear()).slice(2)
    const label =
      date.getFullYear() === now.getFullYear()
        ? `${monthName} ${yearShort}`
        : `${monthName} ${yearShort}`

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
  const activities = await prisma.asanaActivity.groupBy({
    by: ['poseName'],
    where: { userId },
    _count: { poseName: true },
    orderBy: { _count: { poseName: 'desc' } },
    take: 3,
  })

  return activities.map((activity) => ({
    name: activity.poseName,
    count: activity._count.poseName,
  }))
}

/**
 * Get most common series
 */
export async function getMostCommonSeries(
  userId: string
): Promise<MostCommonItem[]> {
  const activities = await prisma.seriesActivity.groupBy({
    by: ['seriesName'],
    where: { userId },
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
  const activities = await prisma.sequenceActivity.groupBy({
    by: ['sequenceName'],
    where: { userId },
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
  const [
    loginStreak,
    activityStreak,
    longestStreak,
    practiceHistory,
    mostCommonAsanas,
    mostCommonSeries,
    mostCommonSequences,
  ] = await Promise.all([
    calculateLoginStreak(userId),
    calculateActivityStreak(userId),
    calculateLongestStreak(userId),
    getPracticeHistory(userId),
    getMostCommonAsanas(userId),
    getMostCommonSeries(userId),
    getMostCommonSequences(userId),
  ])

  // Calculate next goal based on current month's practice
  const currentMonthDays =
    practiceHistory[practiceHistory.length - 1]?.days || 0
  const goalTarget = 30
  const daysRemaining = goalTarget - currentMonthDays

  const nextGoal = {
    text:
      daysRemaining > 0
        ? `Practice ${daysRemaining} More ${daysRemaining === 1 ? 'Day' : 'Days'}`
        : 'Goal Achieved! 🎉',
    current: currentMonthDays,
    target: goalTarget,
    progress: Math.min(Math.round((currentMonthDays / goalTarget) * 100), 100),
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
}
