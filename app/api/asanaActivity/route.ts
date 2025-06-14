import {
  recordAsanaActivity,
  deleteAsanaActivity,
  checkExistingActivity,
} from '@lib/asanaActivityService'
import { NextRequest, NextResponse } from 'next/server'
import { logApiError } from '@lib/errorLogger'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Validate required fields
    if (!data.userId || !data.postureId || !data.postureName) {
      const validationError = new Error(
        'Missing required fields: userId, postureId, and postureName are required'
      )
      logApiError(
        validationError,
        req,
        'POST /api/asanaActivity - validation',
        {
          receivedData: data,
          missingFields: {
            userId: !data.userId,
            postureId: !data.postureId,
            postureName: !data.postureName,
          },
        }
      )
      return NextResponse.json(
        {
          error:
            'Missing required fields: userId, postureId, and postureName are required',
        },
        { status: 400 }
      )
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
        { error: 'Invalid user ID or posture ID provided' },
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
    if (!data.userId || !data.postureId) {
      const validationError = new Error(
        'Missing required fields: userId and postureId are required'
      )
      logApiError(
        validationError,
        req,
        'DELETE /api/asanaActivity - validation',
        {
          receivedData: data,
          missingFields: {
            userId: !data.userId,
            postureId: !data.postureId,
          },
        }
      )
      return NextResponse.json(
        {
          error: 'Missing required fields: userId and postureId are required',
        },
        { status: 400 }
      )
    }

    await deleteAsanaActivity(data.userId, data.postureId)
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
    const postureId = searchParams.get('postureId')

    if (!userId || !postureId) {
      const validationError = new Error(
        'Missing required query parameters: userId and postureId'
      )
      logApiError(validationError, req, 'GET /api/asanaActivity - validation', {
        queryParams: { userId, postureId },
        url: req.url,
      })
      return NextResponse.json(
        {
          error: 'Missing required query parameters: userId and postureId',
        },
        { status: 400 }
      )
    }

    const activity = await checkExistingActivity(userId, postureId)
    return NextResponse.json({ exists: !!activity, activity }, { status: 200 })
  } catch (error) {
    logApiError(error, req, 'GET /api/asanaActivity', {
      operation: 'check_existing_activity',
    })
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to check activity',
      },
      { status: 500 }
    )
  }
}
