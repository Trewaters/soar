import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const {
    nameSequence,
    sequencesSeries,
    description,
    duration,
    image,
    breath_direction,
  } = await request.json()

  console.log(
    'createSequence-POST Request',
    nameSequence,
    sequencesSeries,
    description,
    duration,
    image,
    breath_direction
  )

  try {
    await prisma.asanaSequence.create({
      data: {
        nameSequence,
        sequencesSeries,
        description,
        duration,
        image,
        breath_direction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return Response.json({ message: 'Sequence Data saved' })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
