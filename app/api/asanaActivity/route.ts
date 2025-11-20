import {
  recordAsanaActivity,
  deleteAsanaActivity,
  checkExistingActivity,
  getUserAsanaHistory,
} from '@lib/asanaActivityService'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '@lib/errorLogger'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validate required fields (sort_english_name is optional now)
    if (!data.userId || !data.asanaId || !data.asanaName) {
      const validationError = new Error(
        'Missing required fields: userId, asanaId, and asanaName are required'
      )
      logApiError(
        validationError,
        req,
        'POST /api/asanaActivity - validation',
        {
          receivedData: data,
          missingFields: {
            userId: !data.userId,
            asanaId: !data.asanaId,
            asanaName: !data.asanaName,
          },
        }
      )
      return NextResponse.json(
        {
          error:
            'Missing required fields: userId, asanaId, and asanaName are required',
        },
        { status: 400 }
      )
    }

    // Ensure sort_english_name is provided, fallback to asanaName if empty
    if (!data.sort_english_name || data.sort_english_name.trim() === '') {
      data.sort_english_name = data.asanaName
    }

    const activity = await recordAsanaActivity(data)
    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    logApiError(error, req, 'POST /api/asanaActivity', {
      operation: 'record_asana_activity',
    })

    // Provide more specific error messages for common issues
    if (
      error instanceof Error &&
      error.message.includes('Foreign key constraint')
    ) {
      return NextResponse.json(
        { error: 'Invalid user ID or asana ID provided' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to record activity',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json()

    // Validate required fields
    if (!data.userId || !data.asanaId) {
      const validationError = new Error(
        'Missing required fields: userId and asanaId are required'
      )
      logApiError(
        validationError,
        req,
        'DELETE /api/asanaActivity - validation',
        {
          receivedData: data,
          missingFields: {
            userId: !data.userId,
            asanaId: !data.asanaId,
          },
        }
      )
      return NextResponse.json(
        {
          error: 'Missing required fields: userId and asanaId are required',
        },
        { status: 400 }
      )
    }

    // Get optional date range from request body (ISO strings calculated by client in user's timezone)
    const startDate = data.startDate
    const endDate = data.endDate

    await deleteAsanaActivity(data.userId, data.asanaId, startDate, endDate)
    return NextResponse.json(
      { message: 'Activity deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    logApiError(error, req, 'DELETE /api/asanaActivity', {
      operation: 'delete_asana_activity',
    })

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete activity',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const asanaId = searchParams.get('asanaId')

    if (!userId) {
      const validationError = new Error(
        'Missing required query parameter: userId'
      )
      logApiError(validationError, req, 'GET /api/asanaActivity - validation', {
        queryParams: { userId, asanaId },
        url: req.url,
      })
      return NextResponse.json(
        {
          error: 'Missing required query parameter: userId',
        },
        { status: 400 }
      )
    }

    if (asanaId) {
      // Check if specific activity exists for user and asana
      // Get optional date range from query params (ISO strings calculated by client in user's timezone)
      const startDate = searchParams.get('startDate') || undefined
      const endDate = searchParams.get('endDate') || undefined

      const activity = await checkExistingActivity(
        userId,
        asanaId,
        startDate,
        endDate
      )
      return NextResponse.json(
        { exists: !!activity, activity },
        { status: 200 }
      )
    } else {
      // Get all activities for the user
      const activities = await getUserAsanaHistory(userId)
      return NextResponse.json(activities, { status: 200 })
    }
  } catch (error) {
    logApiError(error, req, 'GET /api/asanaActivity', {
      operation: 'get_asana_activity',
    })
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to get activity',
      },
      { status: 500 }
    )
  }
}
