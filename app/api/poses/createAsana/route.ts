import { prisma } from '../../../../app/lib/prismaClient'
import { requireAuth } from '@app/utils/authorization'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Ensure user is authenticated before creating content
    const session = await requireAuth()

    const {
      english_names,
      alternative_english_names,
      sort_english_name,
      description,
      category,
      difficulty,
      breath,
      sanskrit_names,
      dristi,
      setup_cues,
      deepening_cues,
      // Ignore any created_by from request - we set it from session
    } = await request.json()

    const createdPose = await prisma.asanaPose.create({
      data: {
        english_names,
        alternative_english_names: Array.isArray(alternative_english_names)
          ? alternative_english_names
          : alternative_english_names
            ? [alternative_english_names]
            : [],
        sort_english_name,
        description,
        category,
        difficulty,
        // Ensure breath is stored as an array when provided (caller may send string or array)
        breath: Array.isArray(breath) ? breath : breath ? [breath] : [],
        // Additional fields from client
        sanskrit_names: Array.isArray(sanskrit_names)
          ? sanskrit_names
          : typeof sanskrit_names === 'string' && sanskrit_names
            ? [sanskrit_names]
            : [],
        dristi,
        setup_cues,
        deepening_cues,
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
