import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { canModifyContent } from '@app/utils/authorization'
import { prisma } from '../../../app/lib/prismaClient'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const sortEnglishName = searchParams.get('sort_english_name')
  const id = searchParams.get('id')
  const filter = searchParams.get('filter') // 'public' | 'personal' | null (default: all)
  const createdBy = searchParams.get('createdBy') // Filter by specific creator

  // Get current session
  const session = await auth()
  const currentUserId = session?.user?.id
  const currentUserEmail = session?.user?.email

  // Handle ID lookup first (if provided)
  if (id) {
    try {
      const pose = await prisma.asanaPose.findUnique({ where: { id } })

      if (!pose) {
        return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
      }

      // Check access: PUBLIC and "alpha users" content is visible to all
      const isPublic =
        pose.created_by === 'PUBLIC' || pose.created_by === 'alpha users'
      const canAccess =
        isPublic || (await canModifyContent(pose.created_by || ''))

      if (!canAccess) {
        return NextResponse.json(
          { error: 'You do not have permission to access this pose' },
          { status: 403 }
        )
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

      // Check access: PUBLIC and "alpha users" content is visible to all
      const isPublic =
        pose.created_by === 'PUBLIC' || pose.created_by === 'alpha users'
      const canAccess =
        isPublic || (await canModifyContent(pose.created_by || ''))

      if (!canAccess) {
        return NextResponse.json(
          { error: 'You do not have permission to access this pose' },
          { status: 403 }
        )
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
    }
  }

  try {
    // Build where clause based on filter parameter
    const whereClause: any = {}

    // Handle createdBy parameter for user library filtering
    if (createdBy) {
      // Filter to specific creator only (for user library view)
      whereClause.created_by = createdBy
    } else if (filter === 'public') {
      // Only PUBLIC content (including legacy "alpha users" content)
      whereClause.created_by = {
        in: ['PUBLIC', 'alpha users'],
      }
    } else if (filter === 'personal') {
      // Only user's personal content (requires authentication)
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
      // Default: show PUBLIC content + legacy "alpha users" + user's personal content
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

    // Query the AsanaPose model
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

    const dataWithId = data.map((item: { breath: string | any[] | null }) => ({
      ...item,
      // Preserve the actual MongoDB ObjectId
      // Ensure breath is always an array
      breath:
        item.breath === null || !Array.isArray(item.breath)
          ? ['neutral']
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
    console.error('❌ Error fetching all asana poses:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    })
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
