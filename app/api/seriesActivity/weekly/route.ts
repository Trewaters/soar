import { NextRequest, NextResponse } from 'next/server'
import {
  getSeriesWeeklyActivity,
  getAllSeriesWeeklyActivity,
} from '@lib/seriesActivityService'
import { logApiError } from '@lib/errorLogger'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const userId = searchParams.get('userId')
    const seriesId = searchParams.get('seriesId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: userId' },
        { status: 400 }
      )
    }

    if (seriesId) {
      // Get weekly count for specific series
      const weeklyData = await getSeriesWeeklyActivity(userId, seriesId)
      return NextResponse.json(weeklyData, { status: 200 })
    } else {
      // Get weekly summary for all series
      const allWeeklyData = await getAllSeriesWeeklyActivity(userId)
      return NextResponse.json(allWeeklyData, { status: 200 })
    }
  } catch (error) {
    logApiError(error, req, 'GET /api/seriesActivity/weekly')
    return NextResponse.json(
      { error: 'Failed to fetch weekly series activity data' },
      { status: 500 }
    )
  }
}
