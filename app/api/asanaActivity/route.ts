import { recordAsanaActivity } from '@lib/asanaActivityService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const activity = await recordAsanaActivity(data)
    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error recording Asana activity:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to record activity',
      },
      { status: 500 }
    )
  }
}
