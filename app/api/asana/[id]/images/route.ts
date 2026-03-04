import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { prisma } from '../../../../../app/lib/prismaClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/asana/[id]/images
 * Returns all PoseImages associated with a specific asana, ordered by displayOrder.
 * Used by ImageManagement to populate the image gallery on the asana detail/edit view.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const asanaId = resolvedParams.id

    if (!asanaId) {
      return NextResponse.json(
        { error: 'Asana ID is required' },
        { status: 400 }
      )
    }

    const asana = await prisma.asanaPose.findUnique({
      where: { id: asanaId },
      select: {
        created_by: true,
        poseImages: {
          orderBy: { displayOrder: 'asc' },
          select: {
            id: true,
            url: true,
            altText: true,
            fileName: true,
            fileSize: true,
            uploadedAt: true,
            displayOrder: true,
          },
        },
      },
    })

    if (!asana) {
      return NextResponse.json({ error: 'Asana not found' }, { status: 404 })
    }

    // Check permission: owner, admin, or public content
    const userData = await prisma.userData.findFirst({
      where: { email: session.user.email },
      select: { role: true },
    })
    const isAdmin = userData?.role === 'admin'
    const isPublicOrAlpha =
      asana.created_by === 'PUBLIC' || asana.created_by === 'alpha users'
    const isOwner = asana.created_by === session.user.email

    if (!isAdmin && !isOwner && !isPublicOrAlpha) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ images: asana.poseImages })
  } catch (error) {
    console.error('Error fetching asana images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
