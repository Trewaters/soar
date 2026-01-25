import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { canModifyContent } from '@/app/utils/authorization'
import { prisma } from '../../lib/prismaClient'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const filter = url.searchParams.get('filter') // 'public', 'personal', or null (both)
    const session = await auth().catch(() => null)

    // Get current user ID
    const currentUserId = session?.user?.id

    // Build where clause based on filter parameter
    const whereClause: any = {}

    if (filter === 'public') {
      whereClause.created_by = 'PUBLIC'
    } else if (filter === 'personal') {
      if (!session || !currentUserId) {
        return NextResponse.json(
          { error: 'Authentication required to view personal content' },
          { status: 401 }
        )
      }
      whereClause.created_by = currentUserId
    } else {
      // Default: show PUBLIC content + user's personal content
      if (currentUserId) {
        whereClause.created_by = {
          in: ['PUBLIC', currentUserId],
        }
      } else {
        whereClause.created_by = 'PUBLIC'
      }
    }

    // Fetch series based on filter
    const data = await prisma.asanaSeries.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    // Normalize to FlowSeriesData shape expected by the client
    const normalized = data.map((item: any) => ({
      id: item.id,
      seriesName: item.seriesName || '',
      seriesPoses: Array.isArray(item.seriesPoses) ? item.seriesPoses : [],
      breath: Array.isArray(item.breathSeries)
        ? item.breathSeries.join(', ')
        : '',
      description: item.description ?? '',
      duration: item.durationSeries ?? '',
      image: item.image ?? '',
      // Include created_by for client-side ownership UI
      createdBy: item.created_by || '',
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
  }
}
