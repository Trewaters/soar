import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { getAlphaUserIds } from '@app/lib/alphaUsers'
import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const sortEnglishName = searchParams.get('sort_english_name')
  const id = searchParams.get('id')
  const createdBy = searchParams.get('createdBy')

  // Get current session to determine access control
  const session = await auth()
  const currentUserEmail = session?.user?.email
  const currentUserId = session?.user?.id
  const alphaUserIds = getAlphaUserIds()

  console.log('🔍 /api/poses: Request details:', {
    currentUserEmail,
    alphaUserIds,
    sortEnglishName,
    id,
    createdBy,
  })

  // Handle ID lookup first (if provided)
  if (id) {
    try {
      const pose = await prisma.asanaPose.findUnique({
        where: { id: id },
      })

      if (!pose) {
        return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
      }

      // Check access control for individual pose
      const hasAccess =
        !currentUserEmail || // Allow if no user (for public access)
        pose.created_by === currentUserEmail || // User's own pose (email)
        pose.created_by === currentUserId || // Older records may store creator as user id
        alphaUserIds.includes(pose.created_by || '') // Alpha user's pose

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      if (pose.breath === null) {
        pose.breath = []
      }

      return NextResponse.json(pose)
    } catch (error: any) {
      console.error('Error fetching pose by id:', id, error)
      return NextResponse.json(
        { error: 'Internal server error. Please try again later.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }

  if (sortEnglishName) {
    try {
      const pose = await prisma.asanaPose.findUnique({
        where: { sort_english_name: sortEnglishName },
      })

      if (!pose) {
        return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
      }

      // Check access control for individual pose
      const hasAccess =
        !currentUserEmail || // Allow if no user (for public access)
        pose.created_by === currentUserEmail || // User's own pose (email)
        pose.created_by === currentUserId || // Older records may store creator as user id
        alphaUserIds.includes(pose.created_by || '') // Alpha user's pose

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      if (pose.breath === null) {
        pose.breath = []
      }

      return NextResponse.json(pose)
    } catch (error: any) {
      console.error(
        'Error fetching pose by sort_english_name:',
        sortEnglishName,
        error
      )
      return NextResponse.json(
        { error: 'Internal server error. Please try again later.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }

  try {
    // Build where clause based on access control
    const whereClause: any = {}

    if (createdBy) {
      // If specific creator is requested, check access
      const hasAccess =
        !currentUserEmail || // Allow if no user (for public access)
        createdBy === currentUserEmail || // User's own poses (email)
        createdBy === currentUserId || // Allow querying by user id for older records
        alphaUserIds.includes(createdBy) // Alpha user's poses

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      whereClause.created_by = createdBy
    } else {
      // If no specific creator, filter by access control
      if (currentUserEmail) {
        // Show user's own posts + alpha user posts
        // Include both email and id for backward compatibility
        const allowedCreators = [
          ...(currentUserEmail ? [currentUserEmail] : []),
          ...(currentUserId ? [currentUserId] : []),
          ...alphaUserIds,
        ]
        whereClause.created_by = {
          in: allowedCreators,
        }
      } else {
        // If no user, only show alpha user posts
        if (alphaUserIds.length > 0) {
          whereClause.created_by = {
            in: alphaUserIds,
          }
        } else {
          // No alpha users and no current user - return empty array
          return NextResponse.json([], {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
              Pragma: 'no-cache',
              Expires: '0',
            },
          })
        }
      }
    }

    const data = await prisma.asanaPose.findMany({
      where: whereClause,
      orderBy: {
        created_on: 'desc', // Show newest first to help verify new creations
      },
    })

    // Type definitions for the poses API
    interface AsanaPose {
      id: string
      english_names: string | string[]
      created_by: string | null
      created_on: Date | null
      sort_english_name?: string
      breath: string[] | null
    }

    interface QueryWhereClause {
      created_by?: string | { in: string[] }
    }

    interface QueryLogData {
      whereClause: QueryWhereClause
      totalFound: number
      recentAsanas: Array<{
        id: string
        english_names: string | string[]
        created_by: string | null
        created_on: Date
      }>
    }

    // The selected code with proper typing
    console.log('📊 /api/poses: Query results:', {
      whereClause,
      totalFound: data.length,
      recentAsanas: data.slice(0, 3).map((asana: AsanaPose) => ({
        id: asana.id,
        english_names: asana.english_names,
        created_by: asana.created_by,
        created_on: asana.created_on,
      })),
    } as QueryLogData)

    const dataWithId = data.map((item: { breath: string | any[] | null }) => ({
      ...item,
      // Preserve the actual MongoDB ObjectId
      // Ensure breath is not null
      breath:
        item.breath === null
          ? 'neutral'
          : item.breath.length === 0
            ? ['neutral']
            : item.breath,
    }))

    return NextResponse.json(dataWithId, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error: any) {
    console.error('Error fetching all asana poses:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
