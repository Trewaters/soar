import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import profileService from '../../../../lib/profileService'
import { trackServerEvent } from '../../../../lib/telemetry'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const type = (searchParams.get('type') as any) || 'asanas'
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const cursor = searchParams.get('cursor')
    const mode = (searchParams.get('mode') as any) || 'infinite'
    const page = searchParams.get('page')
      ? parseInt(searchParams.get('page') || '1', 10)
      : null

    const start = Date.now()
    const isAdmin = Boolean(
      session.user?.role === 'admin' || session.user?.role === 'owner'
    )

    const result = await profileService.getLibrary({
      userId,
      type,
      limit,
      cursor: cursor || null,
      page: page || null,
      q: null,
      isAdmin,
    })

    // Debug: log a concise summary to help diagnose empty result issues
    try {
      const itemsCount = Array.isArray(result?.items) ? result.items.length : 0
      console.debug(
        '[api/profile/library] user=%s type=%s page=%s mode=%s limit=%d items=%d nextCursor=%s invalidCursor=%s',
        userId,
        type,
        String(page),
        mode,
        limit,
        itemsCount,
        String(result?.nextCursor ?? ''),
        String(result?.invalidCursor ?? false)
      )
    } catch (e) {
      // ignore logging errors
    }

    const duration = Date.now() - start
    trackServerEvent('library.page_loaded', {
      type,
      mode,
      page,
      limit,
      duration_ms: duration,
      hasMore: result?.hasMore ?? false,
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error: unknown) {
    console.error('Error in /api/profile/library:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
