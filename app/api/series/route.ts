import { PrismaClient } from '../../../prisma/generated/client'
import { NextResponse } from 'next/server'
import { auth } from '../../../auth'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    console.log('Fetching series from database...')
    const url = new URL(request.url)
    const createdByParam = url.searchParams.get('createdBy')
    const session = await auth().catch(() => null)

    let data: any[] = []
    let ownedIds = new Set<string>()

    if (createdByParam && createdByParam.trim().length > 0) {
      // Filter to only series created by provided email; do NOT select created_by
      data = await prisma.asanaSeries.findMany({
        where: { created_by: createdByParam },
        select: {
          id: true,
          seriesName: true,
          seriesPostures: true,
          breathSeries: true,
          description: true,
          durationSeries: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      // All returned belong to createdByParam
      ownedIds = new Set<string>(data.map((d: any) => d.id))
    } else {
      // Fetch all series without selecting created_by (safe for legacy nulls)
      data = await prisma.asanaSeries.findMany({
        select: {
          id: true,
          seriesName: true,
          seriesPostures: true,
          breathSeries: true,
          description: true,
          durationSeries: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      // If user is authenticated, find ids they own for UI gating
      const userEmail = session?.user?.email
      if (userEmail) {
        const owned = await prisma.asanaSeries.findMany({
          where: { created_by: userEmail },
          select: { id: true },
        })
        ownedIds = new Set<string>(owned.map((o: any) => o.id))
      }
    }

    // Normalize to FlowSeriesData shape expected by the client
    const normalized = data.map((item: any) => ({
      id: item.id,
      seriesName: item.seriesName || '',
      seriesPostures: Array.isArray(item.seriesPostures)
        ? item.seriesPostures
        : [],
      breath: Array.isArray(item.breathSeries)
        ? item.breathSeries.join(', ')
        : '',
      description: item.description ?? '',
      duration: item.durationSeries ?? '',
      image: item.image ?? '',
      // include ownership for client-side gating of edit UI
      createdBy:
        ownedIds.has(item.id) && (createdByParam || session?.user?.email)
          ? createdByParam || (session?.user?.email as string)
          : '',
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
