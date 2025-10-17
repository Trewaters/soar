import { PrismaClient } from '../../../../prisma/generated/client'
import { auth } from '../../../../auth'
import { NextRequest, NextResponse } from '../../../../node_modules/next/server'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const {
      english_names,
      sort_english_name,
      description,
      category,
      difficulty,
      breath,
    } = await request.json()

    // First, get the existing pose to check ownership
    const existingPose = await prisma.asanaPose.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPose) {
      return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
    }

    // Check if the user is authorized to edit this pose
    if (existingPose.created_by !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only edit poses you created' },
        { status: 403 }
      )
    }

    const updatedPose = await prisma.asanaPose.update({
      where: { id: resolvedParams.id },
      data: {
        english_names,
        sort_english_name,
        description,
        category,
        difficulty,
        breath,
        // Note: updated_on is handled by Prisma defaults, created_by should not be changed
      },
    })
    // Return the updated pose with consistent formatting
    const poseWithFormattedData = {
      ...updatedPose,
      breath: updatedPose.breath || 'neutral',
    }

    return NextResponse.json(poseWithFormattedData)
  } catch (error: any) {
    console.error('Error updating pose in database:', {
      error: error.message,
      stack: error.stack,
      poseId: resolvedParams.id,
    })
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the pose to verify ownership
    const existingPose = await prisma.asanaPose.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPose) {
      return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
    }

    if (existingPose.created_by !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete poses you created' },
        { status: 403 }
      )
    }

    await prisma.asanaPose.delete({ where: { id: resolvedParams.id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting pose from database:', {
      error: error.message,
      stack: error.stack,
      poseId: resolvedParams.id,
    })
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
