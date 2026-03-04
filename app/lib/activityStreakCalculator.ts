export interface CurrentActivityStreakResult {
  currentStreak: number
  isActiveToday: boolean
  isAtRisk: boolean
}

export interface ActivityNextGoal {
  text: string
  current: number
  target: number
  progress: number
  tiersAchieved: number
  tierName: string
  ultimateGoalsCompleted: number
}

export interface ActivityStreakSummary {
  status: CurrentActivityStreakResult
  longestStreak: number
  nextGoal: ActivityNextGoal
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function toDateKey(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dateKeyToDayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number)
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY)
}

export function toDateKeyInTimezone(
  input: Date | string,
  timezoneOffsetMinutes = 0
): string {
  const date = input instanceof Date ? input : new Date(input)
  const shifted = new Date(date.getTime() - timezoneOffsetMinutes * 60 * 1000)

  return toDateKey(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate()
  )
}

export function getTodayDateKey(
  timezoneOffsetMinutes = 0,
  now: Date = new Date()
): string {
  return toDateKeyInTimezone(now, timezoneOffsetMinutes)
}

export function getUniqueActivityDateKeys(
  activityDates: Array<Date | string>,
  timezoneOffsetMinutes = 0
): string[] {
  const uniqueDays = new Set<string>()

  for (const activityDate of activityDates) {
    uniqueDays.add(toDateKeyInTimezone(activityDate, timezoneOffsetMinutes))
  }

  return Array.from(uniqueDays).sort().reverse()
}

export function calculateCurrentActivityStreakFromDateKeys(
  sortedDaysDesc: string[],
  timezoneOffsetMinutes = 0,
  now: Date = new Date()
): CurrentActivityStreakResult {
  if (sortedDaysDesc.length === 0) {
    return {
      currentStreak: 0,
      isActiveToday: false,
      isAtRisk: false,
    }
  }

  const todayKey = getTodayDateKey(timezoneOffsetMinutes, now)
  const todayDayNumber = dateKeyToDayNumber(todayKey)
  const mostRecentActivityDayNumber = dateKeyToDayNumber(sortedDaysDesc[0])

  const daysDiff = todayDayNumber - mostRecentActivityDayNumber

  if (daysDiff > 1) {
    return {
      currentStreak: 0,
      isActiveToday: false,
      isAtRisk: false,
    }
  }

  let streak = 1
  for (let i = 1; i < sortedDaysDesc.length; i++) {
    const previousDayNumber = dateKeyToDayNumber(sortedDaysDesc[i - 1])
    const currentDayNumber = dateKeyToDayNumber(sortedDaysDesc[i])

    if (previousDayNumber - currentDayNumber === 1) {
      streak++
      continue
    }

    break
  }

  const isActiveToday = daysDiff === 0

  return {
    currentStreak: streak,
    isActiveToday,
    isAtRisk: streak > 0 && !isActiveToday,
  }
}

export function calculateLongestActivityStreakFromDateKeys(
  sortedDaysDesc: string[]
): number {
  if (sortedDaysDesc.length === 0) {
    return 0
  }

  if (sortedDaysDesc.length === 1) {
    return 1
  }

  const sortedDaysAsc = [...sortedDaysDesc].reverse()

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDaysAsc.length; i++) {
    const previousDayNumber = dateKeyToDayNumber(sortedDaysAsc[i - 1])
    const currentDayNumber = dateKeyToDayNumber(sortedDaysAsc[i])

    if (currentDayNumber - previousDayNumber === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

export function buildNextGoalFromActivityStreak(
  continuousPracticeDays: number
): ActivityNextGoal {
  const baseGoalTiers = [30, 60, 90, 180, 365]
  const ultimateGoal = 365

  const baseTiersAchieved = baseGoalTiers.filter(
    (tier) => continuousPracticeDays >= tier
  ).length
  const yearsCompleted = Math.floor(continuousPracticeDays / ultimateGoal)
  const extraYearlyTiersAchieved = Math.max(0, yearsCompleted - 1)
  const tiersAchieved = baseTiersAchieved + extraYearlyTiersAchieved

  const tierNames = [
    'Get started!',
    'Yoga practitioner in Training',
    'Dedicated to Yoga',
    'Discover the Inner Guru',
    'Six (6) month Sage',
    'Yearly Transformation',
    'The Acharya Teacher',
    'The Muni Sage',
  ]

  const tierIndex = Math.max(0, Math.min(tiersAchieved, tierNames.length - 1))
  const currentTierName = tierNames[tierIndex] ?? 'Get started!'

  const ultimateGoalsCompleted = yearsCompleted
  const nextBaseGoal = baseGoalTiers.find(
    (tier) => continuousPracticeDays < tier
  )

  const goalTarget =
    nextBaseGoal ||
    (Math.floor(continuousPracticeDays / ultimateGoal) + 1) * ultimateGoal
  const daysRemaining = goalTarget - continuousPracticeDays

  return {
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
}

export function calculateActivityStreakSummaryFromDateKeys(
  sortedDaysDesc: string[],
  timezoneOffsetMinutes = 0,
  now: Date = new Date()
): ActivityStreakSummary {
  const status = calculateCurrentActivityStreakFromDateKeys(
    sortedDaysDesc,
    timezoneOffsetMinutes,
    now
  )

  const longestStreak =
    calculateLongestActivityStreakFromDateKeys(sortedDaysDesc)

  const nextGoal = buildNextGoalFromActivityStreak(status.currentStreak)

  return {
    status,
    longestStreak,
    nextGoal,
  }
}
