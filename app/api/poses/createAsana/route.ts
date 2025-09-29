import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const {
    english_names,
    sort_english_name,
    description,
    category,
    difficulty,
    breath_direction_default,
    preferred_side,
    sideways,
    created_by,
  } = await request.json()

  try {
    // Convert sideways string to boolean
    const sidewaysBoolean = sideways === 'Yes' || sideways === true

    const createdPosture = await prisma.asanaPosture.create({
      data: {
        english_names,
        sort_english_name,
        description,
        category,
        difficulty,
        breath_direction_default,
        preferred_side,
        sideways: sidewaysBoolean,
        created_by,
        // Note: created_on and updated_on are handled by Prisma defaults
      },
    })

    // Return the created posture with consistent formatting
    // Use the actual database ID instead of a temporary one
    const postureWithId = {
      ...createdPosture,
      breath_direction_default:
        createdPosture.breath_direction_default || 'neutral',
    }

    return Response.json(postureWithId)
  } catch (error: any) {
    console.error('Error creating posture in database:', {
      error: error.message,
      stack: error.stack,
      sideways,
      typeof_sideways: typeof sideways,
    })
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
