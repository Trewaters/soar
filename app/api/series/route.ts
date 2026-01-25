import { NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { canModifyContent } from '@app/utils/authorization'
import { prisma } from '../../lib/prismaClient'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const filter = url.searchParams.get('filter') // 'public', 'personal', or null (both)
    const session = await auth().catch(() => null)

    // Get current user ID and email for backward compatibility
    const currentUserId = session?.user?.id
    const currentUserEmail = session?.user?.email

    // Build where clause based on filter parameter
    const whereClause: any = {}

    if (filter === 'public') {
      // Include legacy "alpha users" content as public
      whereClause.created_by = {
        in: ['PUBLIC', 'alpha users'],
      }
    } else if (filter === 'personal') {
      if (!session || (!currentUserId && !currentUserEmail)) {
        return NextResponse.json(
          { error: 'Authentication required to view personal content' },
          { status: 401 }
        )
      }
      // Check both ID and email for backward compatibility
      const userIdentifiers = [currentUserId, currentUserEmail].filter(Boolean)
      whereClause.created_by = {
        in: userIdentifiers,
      }
    } else {
      // Default: show PUBLIC + legacy "alpha users" + user's personal content
      if (currentUserId || currentUserEmail) {
        // Check both ID and email for backward compatibility with existing data
        const userIdentifiers = [
          'PUBLIC',
          'alpha users', // Legacy public content
          currentUserId,
          currentUserEmail,
        ].filter(Boolean)
        whereClause.created_by = {
          in: userIdentifiers,
        }
      } else {
        // Unauthenticated users see PUBLIC and legacy "alpha users" content
        whereClause.created_by = {
          in: ['PUBLIC', 'alpha users'],
        }
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
