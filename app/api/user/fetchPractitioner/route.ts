import { prisma } from '../../../../app/lib/prismaClient'

// Force this route to be dynamic since it requires query parameters
export const dynamic = 'force-dynamic'

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
  }
  return new Response(JSON.stringify({ data: practitioner }), { status: 200 })
}
