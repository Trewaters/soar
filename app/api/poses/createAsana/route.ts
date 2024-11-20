import { PrismaClient } from '@prisma/generated/client'

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
  } = await request.json()

  try {
    await prisma.asanaPosture.create({
      data: {
        english_names,
        sort_english_name,
        description,
        category,
        difficulty,
        breath_direction_default,
        preferred_side,
        sideways,
        created_on: new Date().toISOString(),
        updated_on: null,
        created_by: 'user',
      },
    })
    return Response.json({ message: 'Asana posture Data saved' })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
