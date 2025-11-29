import { auth } from '../../../../auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../app/lib/prismaClient'

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

    const input = await request.json()

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

    // Only copy allowed fields that are present in the request body so we
    // don't accidentally overwrite fields with undefined.
    const allowedFields = [
      'sanskrit_names',
      'english_names',
      'alternative_english_names',
      'sort_english_name',
      'description',
      'category',
      'difficulty',
      'dristi',
      'setup_cues',
      'deepening_cues',
      'joint_action',
      'muscle_action',
      'transition_cues_out',
      'transition_cues_in',
      'additional_cues',
      'benefits',
      'customize_asana',
      'pose_modifications',
      'pose_variations',
      'breath',
      'duration_asana',
      'lore',
      'asana_intention',
      'label',
      'suggested_poses',
      'preparatory_poses',
    ]

    const data: Record<string, any> = {}
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        data[key] = input[key]
      }
    }

    const updatedPose = await prisma.asanaPose.update({
      where: { id: resolvedParams.id },
      data,
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
  }
}
