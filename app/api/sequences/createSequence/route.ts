import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const {
    nameSequence,
    sequencesSeries,
    description,
    durationSequence,
    image,
    breath_direction,
  } = await request.json()

  try {
    console.log('Creating new sequence:', nameSequence)

    // Create and return the new sequence to verify it was created successfully
    const newSequence = await prisma.asanaSequence.create({
      data: {
        nameSequence,
        sequencesSeries,
        description,
        durationSequence,
        image,
        breath_direction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })

    console.log('Sequence created successfully with ID:', newSequence.id)

    // Add a small delay to ensure database transaction is fully committed
    await new Promise((resolve) => setTimeout(resolve, 100))

    return Response.json(
      {
        message: 'Sequence Data saved',
        sequence: newSequence,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error creating sequence:', error)
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
