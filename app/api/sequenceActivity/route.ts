import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '@lib/errorLogger'
import {
  createSequenceActivity,
  checkExistingSequenceActivity,
  deleteSequenceActivity,
  getUserSequenceHistory,
} from '@lib/sequenceActivityService'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      userId,
      sequenceId,
      sequenceName,
      difficulty,
      completionStatus,
      duration,
      notes,
    } = data

    if (!userId || !sequenceId || !sequenceName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, sequenceId, sequenceName' },
        { status: 400 }
      )
    }

    const activity = await createSequenceActivity({
      userId,
      sequenceId,
      sequenceName,
      difficulty,
      completionStatus,
      duration,
      notes,
    })

    const response = NextResponse.json(activity, { status: 201 })
    // Activity data is user-specific and changes frequently
    // Tell browsers and service workers: DO NOT CACHE THIS
    response.headers.set('Cache-Control', 'private, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    logApiError(error, req, 'POST /api/sequenceActivity')
    return NextResponse.json(
      { error: 'Failed to create sequence activity' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json()
    const { userId, sequenceId, startDate, endDate } = data

    if (!userId || !sequenceId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, sequenceId' },
        { status: 400 }
      )
    }

    // startDate and endDate are optional ISO strings calculated by client in user's timezone
    await deleteSequenceActivity(userId, sequenceId, startDate, endDate)
    return NextResponse.json(
      { message: 'Sequence activity deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    logApiError(error, req, 'DELETE /api/sequenceActivity')
    return NextResponse.json(
      { error: 'Failed to delete sequence activity' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sequenceId = searchParams.get('sequenceId')
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: userId' },
        { status: 400 }
      )
    }

    if (sequenceId) {
      // Check if specific sequence activity exists for user
      // startDate and endDate are optional ISO strings calculated by client in user's timezone
      const activity = await checkExistingSequenceActivity(
        userId,
        sequenceId,
        startDate,
        endDate
      )
      const response = NextResponse.json(
        { exists: !!activity, activity },
        { status: 200 }
      )
      // Activity data is user-specific and changes frequently
      // Tell browsers and service workers: DO NOT CACHE THIS
      response.headers.set(
        'Cache-Control',
        'private, no-store, must-revalidate'
      )
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    } else {
      // Get all sequence activities for user
      const activities = await getUserSequenceHistory(userId)
      const response = NextResponse.json(activities, { status: 200 })
      // Activity data is user-specific and changes frequently
      // Tell browsers and service workers: DO NOT CACHE THIS
      response.headers.set(
        'Cache-Control',
        'private, no-store, must-revalidate'
      )
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }
  } catch (error) {
    logApiError(error, req, 'GET /api/sequenceActivity')
    return NextResponse.json(
      { error: 'Failed to get sequence activity' },
      { status: 500 }
    )
  }
}
