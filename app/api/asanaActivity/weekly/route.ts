import {
  getAsanaWeeklyCount,
  getAllPosesWeeklyCount,
} from '@lib/asanaActivityService'
import { NextRequest, NextResponse } from 'next/server'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const userId = searchParams.get('userId')
    const asanaId = searchParams.get('asanaId')

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Missing required query parameter: userId',
        },
        { status: 400 }
      )
    }

    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    if (asanaId) {
      // Get weekly count for specific asana using provided date range (client local)
      const weeklyData = await getAsanaWeeklyCount(
        userId,
        asanaId,
        startDate,
        endDate
      )
      return NextResponse.json(weeklyData, { status: 200 })
    } else {
      // Get weekly summary for all asanas using provided date range (client local)
      const allWeeklyData = await getAllPosesWeeklyCount(
        userId,
        startDate,
        endDate
      )
      return NextResponse.json(allWeeklyData, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching weekly activity data:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch weekly activity data',
      },
      { status: 500 }
    )
  }
}
