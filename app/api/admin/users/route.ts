import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@app/utils/authorization'
import { prisma } from '@lib/prismaClient'

/**
 * Admin-only endpoint to list all users
 *
 * This demonstrates the pattern for creating admin-only API routes.
 * Use requireRole(['admin']) to restrict access to admins only.
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure only admins can access this endpoint
    await requireRole(['admin'])

    // Get query parameters for pagination
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.userData.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userData.count(),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error: any) {
    // Handle authorization errors from requireRole
    if (error.message?.includes('admin role required')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    if (error.message === 'Unauthorized - Please sign in') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Error in admin users endpoint:', {
      error: error.message,
      stack: error.stack,
    })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
