import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../prisma/generated/client'
import { auth } from '../../../auth'
import { getAlphaUserIds } from '@app/lib/alphaUsers'

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
  const alphaUserIds = getAlphaUserIds()

  // Handle ID lookup first (if provided)
  if (id) {
    try {
      const pose = await prisma.asanaPosture.findUnique({
        where: { id: id },
      })

      if (!pose) {
        return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
      }

      // Check access control for individual pose
      const hasAccess =
        !currentUserEmail || // Allow if no user (for public access)
        pose.created_by === currentUserEmail || // User's own pose
        alphaUserIds.includes(pose.created_by || '') // Alpha user's pose

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      if (pose.breath_direction_default === null) {
        pose.breath_direction_default = ''
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
      const pose = await prisma.asanaPosture.findUnique({
        where: { sort_english_name: sortEnglishName },
      })

      if (!pose) {
        return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
      }

      // Check access control for individual pose
      const hasAccess =
        !currentUserEmail || // Allow if no user (for public access)
        pose.created_by === currentUserEmail || // User's own pose
        alphaUserIds.includes(pose.created_by || '') // Alpha user's pose

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      if (pose.breath_direction_default === null) {
        pose.breath_direction_default = ''
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
    console.log('Fetching postures from database...')

    // Build where clause based on access control
    const whereClause: any = {}

    if (createdBy) {
      // If specific creator is requested, check access
      const hasAccess =
        !currentUserEmail || // Allow if no user (for public access)
        createdBy === currentUserEmail || // User's own poses
        alphaUserIds.includes(createdBy) // Alpha user's poses

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      whereClause.created_by = createdBy
      console.log(`Filtering postures by creator: ${createdBy}`)
    } else {
      // If no specific creator, filter by access control
      if (currentUserEmail) {
        // Show user's own posts + alpha user posts
        const allowedCreators = [currentUserEmail, ...alphaUserIds]
        whereClause.created_by = {
          in: allowedCreators,
        }
        console.log(
          `Filtering postures by allowed creators: ${allowedCreators.join(', ')}`
        )
      } else {
        // If no user, only show alpha user posts
        if (alphaUserIds.length > 0) {
          whereClause.created_by = {
            in: alphaUserIds,
          }
          console.log(
            `No user session, showing only alpha user postures: ${alphaUserIds.join(', ')}`
          )
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

    const data = await prisma.asanaPosture.findMany({
      where: whereClause,
      orderBy: {
        created_on: 'desc', // Show newest first to help verify new creations
      },
    })
    console.log(`Found ${data.length} postures in database`)

    const dataWithId = data.map((item) => ({
      ...item,
      // Preserve the actual MongoDB ObjectId
      // Ensure breath_direction_default is not null
      breath_direction_default:
        item.breath_direction_default === null
          ? 'neutral'
          : item.breath_direction_default,
    }))

    return NextResponse.json(dataWithId, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error: any) {
    console.error('Error fetching all asana postures:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// route pulls from alternate web source
/* export async function GET() {
  const url = 'https://www.pocketyoga.com/poses.json'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`)
    }
    const data = await response.json()
    const dataWithId: FullAsanaData[] = data.map(
      (item: FullAsanaData, index: number) => ({
        ...item,
        id: index + 1,
      })
    )
    return NextResponse.json(dataWithId)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 */
