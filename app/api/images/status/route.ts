import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'
import { MAX_IMAGES_PER_ASANA } from '../../../../types/images'

const prisma = new PrismaClient()

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

    // Project convention: created_by stores the creator's email.
    // Ensure the caller's userId matches the authenticated user's email for safety.
    if (userId !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

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

    // Count actual images in the database instead of relying on imageCount field
    // Note: userId field in poseImage may contain email addresses, not ObjectIDs
    // So we need to find the user first to get their proper ObjectID or use email-based lookup
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Try counting using the new `poseId` field first, fallback to `poseId` if needed
    let actualImageCount = 0
    try {
      actualImageCount = await prisma.poseImage.count({
        where: { poseId: poseId, userId: user.id } as any,
      })
    } catch (e) {
      // Fallback to poseId
      actualImageCount = await prisma.poseImage.count({
        where: { poseId: poseId, userId: user.id } as any,
      })
    }

    // Check if user can upload images to this asana
    // created_by is expected to be the creator's email per project convention
    const createdBy = asana.created_by
    const sessionEmail = session.user.email

    // Backwards compatible: if user created the asana (by email match), treat as user-created
    // regardless of isUserCreated flag for backwards compatibility
    const isUserOwned = createdBy === sessionEmail
    const canManage = isUserOwned
    const maxAllowed = isUserOwned ? MAX_IMAGES_PER_ASANA : 1
    const currentCount = actualImageCount // Use actual count instead of stale imageCount field
    const remainingSlots = Math.max(0, maxAllowed - currentCount)
    const canUpload = canManage && remainingSlots > 0

    const response = {
      currentCount,
      remainingSlots,
      maxAllowed,
      canUpload,
      isUserCreated: isUserOwned, // Use backwards-compatible logic
      canManage,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error getting image status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
