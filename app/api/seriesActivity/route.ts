import { NextRequest, NextResponse } from 'next/server'
import {
  createSeriesActivity,
  getUserSeriesHistory,
  checkExistingSeriesActivity,
  deleteSeriesActivity,
} from '@lib/seriesActivityService'
import { logApiError } from '@lib/errorLogger'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      userId,
      seriesId,
      seriesName,
      difficulty,
      completionStatus,
      duration,
      notes,
    } = data

    if (!userId || !seriesId || !seriesName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, seriesId, seriesName' },
        { status: 400 }
      )
    }

    const activity = await createSeriesActivity({
      userId,
      seriesId,
      seriesName,
      difficulty,
      completionStatus,
      duration,
      notes,
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    logApiError(error, req, 'POST /api/seriesActivity')
    return NextResponse.json(
      { error: 'Failed to create series activity' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json()
    const { userId, seriesId, startDate, endDate } = data

    if (!userId || !seriesId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, seriesId' },
        { status: 400 }
      )
    }

    // startDate and endDate are optional ISO strings calculated by client in user's timezone
    await deleteSeriesActivity(userId, seriesId, startDate, endDate)
    return NextResponse.json(
      { message: 'Series activity deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    logApiError(error, req, 'DELETE /api/seriesActivity')
    return NextResponse.json(
      { error: 'Failed to delete series activity' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const seriesId = searchParams.get('seriesId')
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: userId' },
        { status: 400 }
      )
    }

    if (seriesId) {
      // Check if specific series activity exists for user
      // startDate and endDate are optional ISO strings calculated by client in user's timezone
      const activity = await checkExistingSeriesActivity(
        userId,
        seriesId,
        startDate,
        endDate
      )
      return NextResponse.json(
        { exists: !!activity, activity },
        { status: 200 }
      )
    } else {
      // Get all series activities for the user
      const activities = await getUserSeriesHistory(userId)
      return NextResponse.json(activities, { status: 200 })
    }
  } catch (error) {
    logApiError(error, req, 'GET /api/seriesActivity')
    return NextResponse.json(
      { error: 'Failed to get series activity' },
      { status: 500 }
    )
  }
}
