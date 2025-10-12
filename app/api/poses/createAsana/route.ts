import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const {
    english_names,
    sort_english_name,
    description,
    category,
    difficulty,
    breath,
    created_by,
  } = await request.json()

  try {
    const createdPose = await prisma.asanaPose.create({
      data: {
        english_names,
        sort_english_name,
        description,
        category,
        difficulty,
        breath,
        created_by,
        // Mark as user-created when a creator identifier is supplied
        isUserCreated: Boolean(created_by),
        // Note: created_on and updated_on are handled by Prisma defaults
      },
    })

    // Return the created pose with consistent formatting
    // Use the actual database ID instead of a temporary one
    const poseWithId = {
      ...createdPose,
      breath: createdPose.breath || 'neutral',
    }

    return Response.json(poseWithId)
  } catch (error: any) {
    console.error('Error creating pose in database:', {
      error: error.message,
      stack: error.stack,
    })
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
