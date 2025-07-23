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

    return NextResponse.json(activity, { status: 201 })
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
    const { userId, sequenceId } = data

    if (!userId || !sequenceId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, sequenceId' },
        { status: 400 }
      )
    }

    await deleteSequenceActivity(userId, sequenceId)
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

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: userId' },
        { status: 400 }
      )
    }

    if (sequenceId) {
      // Check if specific sequence activity exists for user
      const activity = await checkExistingSequenceActivity(userId, sequenceId)
      return NextResponse.json(
        { exists: !!activity, activity },
        { status: 200 }
      )
    } else {
      // Get all sequence activities for user
      const activities = await getUserSequenceHistory(userId)
      return NextResponse.json(activities, { status: 200 })
    }
  } catch (error) {
    logApiError(error, req, 'GET /api/sequenceActivity')
    return NextResponse.json(
      { error: 'Failed to get sequence activity' },
      { status: 500 }
    )
  }
}
