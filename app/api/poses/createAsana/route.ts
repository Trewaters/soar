import { prisma } from '@lib/prismaClient'
import { requireAuth } from '@app/utils/authorization'
import { NextResponse } from 'next/server'
import { AsanaCreatePayloadValidator } from '@app/utils/validation/schemas/asana'
import { formatAsValidationResponse } from '@app/utils/validation/errorFormatter'

export async function POST(request: Request) {
  try {
    // Ensure user is authenticated before creating content
    const session = await requireAuth()

    const requestBody = await request.json()

    // Validation integration point: reject invalid payloads before DB writes
    const validationResult = AsanaCreatePayloadValidator.validate(requestBody)
    if (!validationResult.isValid) {
      console.warn('[POST /api/poses/createAsana] Validation failed', {
        errors: validationResult.errors,
      })
      return NextResponse.json(formatAsValidationResponse(validationResult), {
        status: 400,
      })
    }

    const normalized = validationResult.normalizedData

    const createdPose = await prisma.asanaPose.create({
      data: {
        english_names: normalized.english_names,
        alternative_english_names: normalized.alternative_english_names ?? [],
        sort_english_name: normalized.sort_english_name,
        description: normalized.description ?? null,
        category: normalized.category ?? 'Standing',
        difficulty: normalized.difficulty ?? 'Easy',
        breath: normalized.breath ?? [],
        sanskrit_names: normalized.sanskrit_names ?? [],
        dristi: normalized.dristi ?? null,
        setup_cues: normalized.setup_cues ?? null,
        deepening_cues: normalized.deepening_cues ?? null,
        // Set created_by from authenticated session user ID
        created_by: session.user.id,
        // Mark as user-created for personal content
        isUserCreated: true,
        // Note: created_on and updated_on are handled by Prisma defaults
      },
    })

    // Return the created pose with consistent formatting
    // Use the actual database ID instead of a temporary one
    // Normalize breath on response to always be an array (use ['neutral'] when empty)
    const poseWithId = {
      ...createdPose,
      breath:
        createdPose.breath === null || !Array.isArray(createdPose.breath)
          ? ['neutral']
          : createdPose.breath.length === 0
            ? ['neutral']
            : createdPose.breath,
    }

    return Response.json(poseWithId)
  } catch (error: any) {
    // Handle authentication errors from requireAuth
    if (error.message === 'Unauthorized - Please sign in') {
      return NextResponse.json(
        { error: 'Authentication required to create poses' },
        { status: 401 }
      )
    }

    console.error('Error creating pose in database:', {
      error: error.message,
      stack: error.stack,
    })
    return Response.json({ error: error.message }, { status: 500 })
  }
}
