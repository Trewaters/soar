import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { getDashboardStats } from '../../../lib/dashboardService'
import { prisma } from '../../../../app/lib/prismaClient'

export async function GET() {
  const debugPrefix = '[Dashboard Stats API Debug]'
  const startTime = Date.now()

  try {
    const session = await auth()

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

    const userData = await prisma.userData.findUnique({
      where: { email: session.user.email },
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

    const dashboardData = await getDashboardStats(userData.id)

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
