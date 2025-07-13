import { PrismaClient } from '../../../prisma/generated/client'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

// Utility function to generate cache-busting hash
function generateCacheBustingHash(data: any): string {
  const timestamp = new Date().getTime()
  const dataString = JSON.stringify(data)
  const hash = createHash('md5')
    .update(dataString + timestamp)
    .digest('hex')
    .slice(0, 16)
  return hash
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bustCache = searchParams.get('bust') || 'true' // Default to cache busting
    const createdBy = searchParams.get('createdBy')

    console.log('Fetching sequences from database...')

    // For now, since AsanaSequence doesn't have a created_by field,
    // we'll return all sequences when not filtering, and empty when filtering by user
    // TODO: Add created_by field to AsanaSequence schema
    const data = await prisma.asanaSequence.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first to help verify new creations
      },
    })
    console.log(`Found ${data.length} sequences in database`)

    // Filter client-side for now (not ideal, but works until schema is updated)
    let filteredData = data
    if (createdBy) {
      console.log(
        `Note: Filtering by creator not yet supported for sequences. Returning empty array for user: ${createdBy}`
      )
      filteredData = [] // Return empty array for now since we can't filter by creator
    }

    const dataWithId = filteredData.map((item) => ({
      ...item,
      // Preserve the actual database ID instead of regenerating based on array position
      sequencesSeries: Array.isArray(item.sequencesSeries)
        ? item.sequencesSeries
        : [],
    }))

    // Generate timestamp for cache-busting
    const timestamp = new Date().getTime()
    const cacheBustHash = generateCacheBustingHash(dataWithId)

    // Generate ETag based on data content and timestamp for cache validation
    const dataString = JSON.stringify(dataWithId)
    const etag = `"${Buffer.from(dataString + timestamp)
      .toString('base64')
      .slice(0, 16)}"`

    // Check if client has a cached version using If-None-Match header
    const clientETag = request.headers.get('If-None-Match')
    if (clientETag && clientETag === etag && bustCache !== 'true') {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          'Cache-Control': 'no-cache, must-revalidate',
        },
      })
    }

    return NextResponse.json(dataWithId, {
      headers: {
        // Comprehensive cache-busting headers
        'Cache-Control':
          'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Last-Modified': new Date().toUTCString(),
        ETag: etag,
        // Additional cache-busting headers
        'Surrogate-Control': 'no-store',
        Vary: 'Accept-Encoding, User-Agent',
        // Custom timestamp header for additional cache-busting
        'X-Timestamp': timestamp.toString(),
        'X-Cache-Bust': `v${timestamp}`,
        'X-Cache-Hash': cacheBustHash,
        // CORS and security headers that also help with cache busting
        'Access-Control-Max-Age': '0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error: unknown) {
    console.error('Error fetching sequences:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      )
    }
  } finally {
    await prisma.$disconnect()
  }
}

// POST method for cache invalidation (when sequences are created/updated)
export async function POST() {
  try {
    // Here you would typically handle sequence creation/update
    // For now, we'll just return a response with cache-busting headers
    const timestamp = new Date().getTime()

    return NextResponse.json(
      {
        success: true,
        message: 'Cache invalidated',
        timestamp: timestamp,
      },
      {
        status: 200,
        headers: {
          // Force cache invalidation
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Cache-Invalidated': 'true',
          'X-Timestamp': timestamp.toString(),
          'X-Cache-Bust': `invalidated-${timestamp}`,
        },
      }
    )
  } catch (error: unknown) {
    console.error('Error in POST /api/sequences:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      )
    }
  } finally {
    await prisma.$disconnect()
  }
}
