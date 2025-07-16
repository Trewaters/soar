import { NextRequest, NextResponse } from 'next/server'
import {
  getSequenceWeeklyActivity,
  getAllSequenceWeeklyActivity,
} from '@lib/sequenceActivityService'
import { logApiError } from '@lib/errorLogger'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const userId = searchParams.get('userId')
    const sequenceId = searchParams.get('sequenceId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: userId' },
        { status: 400 }
      )
    }

    if (sequenceId) {
      // Get weekly count for specific sequence
      const weeklyData = await getSequenceWeeklyActivity(userId, sequenceId)
      return NextResponse.json(weeklyData, { status: 200 })
    } else {
      // Get weekly summary for all sequences
      const allWeeklyData = await getAllSequenceWeeklyActivity(userId)
      return NextResponse.json(allWeeklyData, { status: 200 })
    }
  } catch (error) {
    logApiError(error, req, 'GET /api/sequenceActivity/weekly')
    return NextResponse.json(
      { error: 'Failed to fetch weekly sequence activity data' },
      { status: 500 }
    )
  }
}
