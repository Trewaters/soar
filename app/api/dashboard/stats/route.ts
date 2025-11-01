import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { getDashboardStats } from '../../../lib/dashboardService'
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

    // Get real dashboard statistics from the service
    const dashboardData = await getDashboardStats(userData.id)

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
