import { prisma } from '../../../../app/lib/prismaClient'
import { auth } from '../../../../auth'
import { requireAuth } from '@app/utils/authorization'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Use shared prisma client

export async function POST(request: Request) {
  try {
    // Ensure user is authenticated before creating series
    const session = await requireAuth()

    const body = await request.json()
    const seriesName = body.seriesName
    // Accept either an array of strings (legacy) or array of objects { poseId, sort_english_name, alignment_cues? }
    const rawSeriesPoses = body.seriesPoses ?? body.series_poses
    let seriesPoses: any[] = []
    if (Array.isArray(rawSeriesPoses)) {
      seriesPoses = rawSeriesPoses.map((item: any) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          // sanitize alignment_cues
          if (typeof item.alignment_cues === 'string') {
            item.alignment_cues = item.alignment_cues.slice(0, 1000)
          }
          return item
        }
        // legacy string entry
        return item
      })
    } else if (
      typeof rawSeriesPoses === 'string' &&
      rawSeriesPoses.trim().length > 0
    ) {
      seriesPoses = [rawSeriesPoses]
    }
    const rawBreath = body.breathSeries ?? body.breath ?? []
    const breathSeries: string[] = Array.isArray(rawBreath)
      ? rawBreath
      : typeof rawBreath === 'string' && rawBreath.trim().length > 0
        ? [rawBreath]
        : []
    const description = body.description ?? ''
    const durationSeries = body.durationSeries ?? body.duration ?? ''
    const image = body.image ?? ''

    // Try create with seriesPoses field
    const newSeries = await prisma.asanaSeries.create({
      data: {
        seriesName,
        // seriesPoses is now Json[] per schema; pass the array (strings or objects)
        seriesPoses,
        breathSeries,
        description,
        durationSeries,
        image,
        images: image ? [image] : [], // Initialize images array with legacy image if present
        // Set created_by from authenticated session user ID
        created_by: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    })

    const timestamp = Date.now().toString()
    return Response.json(
      {
        message: 'Series Data saved',
        timestamp,
        id: newSeries.id,
        seriesName: newSeries.seriesName,
      },
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Last-Modified': new Date().toUTCString(),
          'Surrogate-Control': 'no-store',
          Vary: 'Accept, Accept-Encoding, User-Agent',
          'X-Timestamp': timestamp,
          'X-Cache-Bust': `v${timestamp}`,
        },
      }
    )
  } catch (error: any) {
    // Handle authentication errors from requireAuth
    if (error.message === 'Unauthorized - Please sign in') {
      return NextResponse.json(
        { error: 'Authentication required to create series' },
        { status: 401 }
      )
    }

    return Response.json({ error: error.message }, { status: 500 })
  }
}
