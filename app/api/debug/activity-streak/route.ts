import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'

export async function GET() {
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

    // Get all practice activities
    const [asanaActivities, seriesActivities, sequenceActivities] =
      await Promise.all([
        prisma.asanaActivity.findMany({
          where: { userId: userData.id },
          select: { datePerformed: true, createdAt: true },
          orderBy: { datePerformed: 'desc' },
          take: 20,
        }),
        prisma.seriesActivity.findMany({
          where: { userId: userData.id },
          select: { datePerformed: true, createdAt: true },
          orderBy: { datePerformed: 'desc' },
          take: 20,
        }),
        prisma.sequenceActivity.findMany({
          where: { userId: userData.id },
          select: { datePerformed: true, createdAt: true },
          orderBy: { datePerformed: 'desc' },
          take: 20,
        }),
      ])

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

    // Process all activities
    const allActivities = [
      ...asanaActivities.map((a) => ({
        type: 'asana',
        datePerformed: a.datePerformed,
        createdAt: a.createdAt,
      })),
      ...seriesActivities.map((a) => ({
        type: 'series',
        datePerformed: a.datePerformed,
        createdAt: a.createdAt,
      })),
      ...sequenceActivities.map((a) => ({
        type: 'sequence',
        datePerformed: a.datePerformed,
        createdAt: a.createdAt,
      })),
    ]

    // Get unique days with detailed info
    const uniqueDaysMap = new Map<string, any>()
    for (const activity of allActivities) {
      const activityDate = new Date(activity.datePerformed)
      const year = activityDate.getFullYear()
      const month = String(activityDate.getMonth() + 1).padStart(2, '0')
      const day = String(activityDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

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

    // Calculate streak logic
    let streak = 0
    const streakDays = []

    for (let i = 0; i < sortedDays.length; i++) {
      const expectedDate = new Date(
        serverNow.getFullYear(),
        serverNow.getMonth(),
        serverNow.getDate() - i
      )
      const expYear = expectedDate.getFullYear()
      const expMonth = String(expectedDate.getMonth() + 1).padStart(2, '0')
      const expDay = String(expectedDate.getDate()).padStart(2, '0')
      const expectedStr = `${expYear}-${expMonth}-${expDay}`

      const match = sortedDays[i] === expectedStr
      streakDays.push({
        expected: expectedStr,
        actual: sortedDays[i] || 'none',
        match,
      })

      if (match) {
        streak++
      } else {
        break
      }
    }

    // Check if last activity is within 1 day
    const lastActivityStr = sortedDays[0]
    let daysDiff = null
    if (lastActivityStr) {
      const [lastYear, lastMonth, lastDay] = lastActivityStr
        .split('-')
        .map(Number)
      const lastActivityDate = new Date(lastYear, lastMonth - 1, lastDay)
      const todayDate = new Date(
        serverNow.getFullYear(),
        serverNow.getMonth(),
        serverNow.getDate()
      )
      daysDiff = Math.floor(
        (todayDate.getTime() - lastActivityDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    }

    return NextResponse.json({
      success: true,
      debug: {
        userId: userData.id,
        userEmail: session.user.email,
        serverDate,
        totalActivities: allActivities.length,
        activityCounts: {
          asana: asanaActivities.length,
          series: seriesActivities.length,
          sequence: sequenceActivities.length,
        },
        uniqueDaysWithActivity: uniqueDays,
        sortedDays,
        lastActivityDate: lastActivityStr,
        daysSinceLastActivity: daysDiff,
        streakBroken: daysDiff !== null && daysDiff > 1,
        calculatedStreak: streak,
        streakCalculationDetails: streakDays.slice(0, 10),
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
