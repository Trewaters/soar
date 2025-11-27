import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { getDashboardStats } from '../../../lib/dashboardService'
import { prisma } from '../../../../app/lib/prismaClient'

export async function GET() {
  const debugPrefix = '[Dashboard Stats API Debug]'
  const startTime = Date.now()

  console.log(`${debugPrefix} Request received`, {
    timestamp: new Date().toISOString(),
  })

  try {
    const session = await auth()

    console.log(`${debugPrefix} Auth check`, {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email || 'none',
      userId: session?.user?.id || 'none',
    })

    if (!session?.user?.email) {
      console.warn(`${debugPrefix} Unauthorized - no email in session`, {
        hasSession: !!session,
        hasUser: !!session?.user,
      })
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Get user data
    console.log(`${debugPrefix} Looking up user by email`, {
      email: session.user.email,
    })

    const userData = await prisma.userData.findUnique({
      where: { email: session.user.email },
    })

    console.log(`${debugPrefix} User lookup result`, {
      found: !!userData,
      userId: userData?.id || 'none',
      userEmail: userData?.email || 'none',
    })

    if (!userData) {
      console.warn(`${debugPrefix} User data not found for email`, {
        email: session.user.email,
      })
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      )
    }

    // Get real dashboard statistics from the service
    console.log(`${debugPrefix} Fetching dashboard stats for user`, {
      userId: userData.id,
    })

    const dashboardData = await getDashboardStats(userData.id)

    console.log(`${debugPrefix} Dashboard stats retrieved successfully`, {
      userId: userData.id,
      loginStreak: dashboardData.loginStreak,
      activityStreak: dashboardData.activityStreak,
      practiceHistoryCount: dashboardData.practiceHistory?.length || 0,
      mostCommonAsanasCount: dashboardData.mostCommonAsanas?.length || 0,
      mostCommonSeriesCount: dashboardData.mostCommonSeries?.length || 0,
      mostCommonSequencesCount: dashboardData.mostCommonSequences?.length || 0,
      elapsedMs: Date.now() - startTime,
    })

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    // Preserve legacy log signature expected by tests
    try {
      console.error('Error fetching dashboard stats:', error)
    } catch (e) {
      // ignore
    }

    console.error(`${debugPrefix} Error fetching dashboard stats`, {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      elapsedMs: Date.now() - startTime,
    })
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
