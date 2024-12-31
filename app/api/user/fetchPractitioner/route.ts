import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  let practitioner

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Practitioner id not found' }),
      {
        status: 404,
      }
    )
  }

  try {
    practitioner = await prisma.userData.findUnique({
      // TODO Create a new practitioner
      where: { id: id },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create practitioner data' }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
  return new Response(JSON.stringify({ data: practitioner }), { status: 200 })
}
