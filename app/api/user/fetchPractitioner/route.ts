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
    practitioner = await prisma.practitioner.findUnique({
      // TODO Create a new practitioner
      where: { id: id },
    })

    if (!practitioner) {
      // TODO Create a new practitioner
      practitioner = await prisma.practitioner.create({
        data: {
          id: id,
          // ...practitionerData,
          headline: 'New Headline',
          bio: 'Updated bio',
          location: 'New Location',
          websiteURL: 'https://happyYoga.app',
          firstName: 'New First Name',
          lastName: 'New Last Name',
          userId: id,
        },
      })
      console.error('Practitioner created:', practitioner)

      practitioner = await prisma.practitioner.findUnique({
        // TODO Create a new practitioner
        where: { id: id },
      })
    }
  } catch (error) {
    console.error(
      'Practitioner creation error (api/user/fetchPractitioner):',
      error
    )
    return new Response(
      JSON.stringify({ error: 'Failed to create practitioner data' }),
      { status: 500 }
    )
  }
  return new Response(JSON.stringify({ data: practitioner }), { status: 200 })
}
