import { PrismaClient } from '../../../prisma/generated/client'
import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import getAlphaUserIds from '@app/lib/alphaUsers'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const createdByParam = url.searchParams.get('createdBy')
    const session = await auth().catch(() => null)

    // Get current user and alpha user IDs
    const currentUserEmail = session?.user?.email
    const alphaUserIds = getAlphaUserIds()

    // If user is not authenticated, return empty array
    if (!currentUserEmail) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Last-Modified': new Date().toUTCString(),
          'Surrogate-Control': 'no-store',
          Vary: 'Accept, Accept-Encoding, User-Agent',
          'X-Timestamp': Date.now().toString(),
          'X-Cache-Bust': `v${Date.now()}`,
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }

    let data: any[] = []
    let ownedIds = new Set<string>()

    if (createdByParam && createdByParam.trim().length > 0) {
      // Only allow filtering by createdBy if it's the current user or an alpha user
      const allowedCreators = [currentUserEmail, ...alphaUserIds]
      if (!allowedCreators.includes(createdByParam)) {
        return NextResponse.json([], {
          headers: {
            'Cache-Control':
              'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
            'Last-Modified': new Date().toUTCString(),
            'Surrogate-Control': 'no-store',
            Vary: 'Accept, Accept-Encoding, User-Agent',
            'X-Timestamp': Date.now().toString(),
            'X-Cache-Bust': `v${Date.now()}`,
            'X-Content-Type-Options': 'nosniff',
          },
        })
      }

      // Filter to only series created by provided email; do NOT select created_by
      data = await prisma.asanaSeries.findMany({
        where: { created_by: createdByParam },
        orderBy: { createdAt: 'desc' },
      })
      // All returned belong to createdByParam
      ownedIds = new Set<string>(data.map((d: any) => d.id))
    } else {
      // Build allowed creators list: current user + alpha users
      const allowedCreators = [currentUserEmail, ...alphaUserIds]

      // Fetch only series created by current user or alpha users
      data = await prisma.asanaSeries.findMany({
        where: { created_by: { in: allowedCreators } },
        orderBy: { createdAt: 'desc' },
      })

      // Find ids owned by current user for UI gating
      const owned = data.filter(
        (item: any) => item.created_by === currentUserEmail
      )
      ownedIds = new Set<string>(owned.map((o: any) => o.id))
    }

    // Normalize to FlowSeriesData shape expected by the client
    const normalized = data.map((item: any) => ({
      id: item.id,
      seriesName: item.seriesName || '',
      seriesPoses: Array.isArray(item.seriesPoses)
        ? item.seriesPoses
        : Array.isArray(item.seriesPoses)
          ? item.seriesPoses
          : [],
      breath: Array.isArray(item.breathSeries)
        ? item.breathSeries.join(', ')
        : '',
      description: item.description ?? '',
      duration: item.durationSeries ?? '',
      image: item.image ?? '',
      // Include ownership for client-side gating of edit UI
      // Use actual created_by if available, or derive from ownership check
      createdBy:
        item.created_by ||
        (ownedIds.has(item.id)
          ? createdByParam || currentUserEmail
          : createdByParam || ''),
      createdAt: item.createdAt ?? null,
      updatedAt: item.updatedAt ?? null,
    }))

    const timestamp = Date.now().toString()
    return NextResponse.json(normalized, {
      headers: {
        // Comprehensive cache-busting headers
        'Cache-Control':
          'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Last-Modified': new Date().toUTCString(),
        'Surrogate-Control': 'no-store',
        Vary: 'Accept, Accept-Encoding, User-Agent',
        // Custom timestamp header for additional cache-busting
        'X-Timestamp': timestamp,
        'X-Cache-Bust': `v${timestamp}`,
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error: any) {
    console.error('Error fetching series:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
