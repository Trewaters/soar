import { auth } from '../../../../auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/prismaClient'
import { canModifyContent } from '@app/utils/authorization'
import fs from 'fs'
import path from 'path'
import { AsanaUpdatePayloadValidator } from '@app/utils/validation/schemas/asana'
import { formatAsValidationResponse } from '@app/utils/validation/errorFormatter'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    // Read and log the incoming payload early for debugging (helps capture
    // client PUT payloads even when auth fails). Do not mutate `request`.
    const input = await request.json()
    try {
      const logDir = path.join(process.cwd(), '.logs')
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
      const logPath = path.join(logDir, `pose-put-${resolvedParams.id}.json`)
      const entry = {
        time: new Date().toISOString(),
        id: resolvedParams.id,
        body: input,
      }
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n')
    } catch (e) {
      // ignore logging errors
    }

    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // `input` already read above

    // First, get the existing pose to check ownership
    const existingPose = await prisma.asanaPose.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPose) {
      return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
    }

    // Check if the user is authorized to edit this pose
    // PUBLIC content can be modified by admins, personal content by owner/admin
    const canModify = await canModifyContent(existingPose.created_by || '')

    if (!canModify) {
      return NextResponse.json(
        { error: 'You do not have permission to modify this pose' },
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

    // Validation integration point: validate normalized edit payload before DB write.
    const validationResult = AsanaUpdatePayloadValidator.validate(data)
    if (!validationResult.isValid) {
      console.warn('[PUT /api/poses/[id]] Validation failed', {
        poseId: resolvedParams.id,
        errors: validationResult.errors,
      })
      return NextResponse.json(formatAsValidationResponse(validationResult), {
        status: 400,
      })
    }

    const normalizedData = validationResult.normalizedData
    const normalizedDataRecord = normalizedData as Record<string, unknown>
    for (const key of Object.keys(data)) {
      if (Object.prototype.hasOwnProperty.call(normalizedDataRecord, key)) {
        data[key] = normalizedDataRecord[key]
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

    // Check if the user is authorized to delete this pose
    // PUBLIC content can be deleted by admins, personal content by owner/admin
    if (!(await canModifyContent(existingPose.created_by || ''))) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this pose' },
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
