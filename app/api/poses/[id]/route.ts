import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/generated/client'
import { auth } from '../../../../auth'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      breath_direction_default,
      preferred_side,
      sideways,
    } = await request.json()

    console.log('Updating posture with ID:', params.id)
    console.log('Request data:', {
      sort_english_name,
      sideways,
      typeof_sideways: typeof sideways,
      english_names,
      category,
      difficulty,
    })

    // First, get the existing posture to check ownership
    const existingPosture = await prisma.asanaPosture.findUnique({
      where: { id: params.id },
    })

    if (!existingPosture) {
      return NextResponse.json({ error: 'Posture not found' }, { status: 404 })
    }

    // Check if the user is authorized to edit this posture
    if (existingPosture.created_by !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only edit postures you created' },
        { status: 403 }
      )
    }

    // Convert sideways string to boolean
    const sidewaysBoolean = sideways === 'Yes' || sideways === true

    const updatedPosture = await prisma.asanaPosture.update({
      where: { id: params.id },
      data: {
        english_names,
        sort_english_name,
        description,
        category,
        difficulty,
        breath_direction_default,
        preferred_side,
        sideways: sidewaysBoolean,
        // Note: updated_on is handled by Prisma defaults, created_by should not be changed
      },
    })

    console.log('Posture updated successfully in database:', {
      id: updatedPosture.id,
      sort_english_name: updatedPosture.sort_english_name,
      sideways: updatedPosture.sideways,
    })

    // Return the updated posture with consistent formatting
    const postureWithFormattedData = {
      ...updatedPosture,
      breath_direction_default:
        updatedPosture.breath_direction_default || 'neutral',
    }

    return NextResponse.json(postureWithFormattedData)
  } catch (error: any) {
    console.error('Error updating posture in database:', {
      error: error.message,
      stack: error.stack,
      postureId: params.id,
    })
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
