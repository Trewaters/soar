import {
  getPostureWeeklyCount,
  getAllPosturesWeeklyCount,
} from '@lib/asanaActivityService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const postureId = searchParams.get('postureId')

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Missing required query parameter: userId',
        },
        { status: 400 }
      )
    }

    if (postureId) {
      // Get weekly count for specific posture
      const weeklyData = await getPostureWeeklyCount(userId, postureId)
      return NextResponse.json(weeklyData, { status: 200 })
    } else {
      // Get weekly summary for all postures
      const allWeeklyData = await getAllPosturesWeeklyCount(userId)
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
