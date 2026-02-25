import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'
import {
  calculateCurrentActivityStreakFromDateKeys,
  getUniqueActivityDateKeys,
} from '../../../../app/lib/activityStreakCalculator'
import {
  fetchUserActivitySourceRecords,
  mergeTypedServerActivityRecords,
} from '../../../../app/lib/activityStreakServer'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Get user data
    const userData = await prisma.userData.findUnique({
      where: { email: session.user.email },
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    const activitySources = await fetchUserActivitySourceRecords(userData.id, {
      includeCreatedAt: true,
      orderDesc: true,
      take: 20,
    })

    const timezoneOffsetParam = new URL(request.url).searchParams.get(
      'timezoneOffsetMinutes'
    )
    const parsedOffset = timezoneOffsetParam
      ? Number(timezoneOffsetParam)
      : Number.NaN
    const timezoneOffsetMinutes = Number.isFinite(parsedOffset)
      ? Math.max(-840, Math.min(840, parsedOffset))
      : 0

    // Get server date info
    const serverNow = new Date()
    const serverDate = {
      iso: serverNow.toISOString(),
      utc: serverNow.toUTCString(),
      local: serverNow.toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: serverNow.getTimezoneOffset(),
      year: serverNow.getFullYear(),
      month: serverNow.getMonth() + 1,
      day: serverNow.getDate(),
      formatted: `${serverNow.getFullYear()}-${String(serverNow.getMonth() + 1).padStart(2, '0')}-${String(serverNow.getDate()).padStart(2, '0')}`,
    }

    const allActivities = mergeTypedServerActivityRecords(activitySources, {
      sortDesc: true,
    })

    // Get unique days with detailed info
    const uniqueDaysMap = new Map<string, any>()
    for (const activity of allActivities) {
      const dateStr = getUniqueActivityDateKeys(
        [activity.datePerformed],
        timezoneOffsetMinutes
      )[0]
      const activityDate = new Date(activity.datePerformed)

      if (!uniqueDaysMap.has(dateStr)) {
        uniqueDaysMap.set(dateStr, {
          dateStr,
          originalISO: activity.datePerformed.toISOString(),
          localDate: activityDate.toString(),
          utcDate: activityDate.toUTCString(),
          activities: [],
        })
      }
      uniqueDaysMap.get(dateStr)!.activities.push(activity.type)
    }

    const uniqueDays = Array.from(uniqueDaysMap.values())
    const sortedDays = uniqueDays
      .map((d) => d.dateStr)
      .sort()
      .reverse()
    const streakStatus = calculateCurrentActivityStreakFromDateKeys(
      sortedDays,
      timezoneOffsetMinutes
    )

    return NextResponse.json({
      success: true,
      debug: {
        userId: userData.id,
        userEmail: session.user.email,
        serverDate,
        timezoneOffsetMinutes,
        totalActivities: allActivities.length,
        activityCounts: {
          asana: activitySources.asanaActivities.length,
          series: activitySources.seriesActivities.length,
          sequence: activitySources.sequenceActivities.length,
        },
        uniqueDaysWithActivity: uniqueDays,
        sortedDays,
        currentStreak: streakStatus.currentStreak,
        isActiveToday: streakStatus.isActiveToday,
        isAtRisk: streakStatus.isAtRisk,
      },
    })
  } catch (error) {
    console.error('Debug activity streak error:', error)
    return NextResponse.json(
      {
        error: 'Failed to debug activity streak',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
