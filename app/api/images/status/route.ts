import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'
import { MAX_IMAGES_PER_ASANA } from '../../../../types/images'

// use shared prisma client

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const poseId = searchParams.get('poseId')
    const userId = searchParams.get('userId')

    // Validate inputs
    if (!poseId) {
      return NextResponse.json({ error: 'poseId is required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Verification of session email matching provided userId
    if (session.user.email !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    // Project convention: created_by stores the creator's email.
    const { canModifyContent } = await import('@app/utils/authorization')

    // Get asana information
    const asana = await prisma.asanaPose.findUnique({
      where: { id: poseId },
      select: {
        isUserCreated: true,
        created_by: true,
      },
    })

    if (!asana) {
      return NextResponse.json({ error: 'Asana not found' }, { status: 404 })
    }

    // Use robust ownership check via canModifyContent
    const canManage = await canModifyContent(asana.created_by || '')

    // Count actual images in the database instead of relying on imageCount field
    let actualImageCount = 0
    try {
      actualImageCount = await prisma.poseImage.count({
        where: { poseId: poseId } as any,
      })
    } catch (e) {
      console.warn('Failed to count images with poseId', e)
    }

    // created_by is expected to be the creator's email per project convention
    const createdBy = asana.created_by

    const maxAllowed = MAX_IMAGES_PER_ASANA
    const currentCount = actualImageCount // Use actual count instead of stale imageCount field
    const remainingSlots = Math.max(0, maxAllowed - currentCount)
    const canUpload = canManage && remainingSlots > 0

    const response = {
      currentCount,
      remainingSlots,
      maxAllowed,
      canUpload,
      isUserCreated: Boolean(createdBy) && createdBy !== 'PUBLIC',
      canManage,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error getting image status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
