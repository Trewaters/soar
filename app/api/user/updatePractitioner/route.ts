import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, practitionerData } = await req.json()
  const decodedId = email.toString().replace('%40', '@').replace('=', '')
  let getPrismaUser

  try {
    // Find the user by email
    getPrismaUser = await prisma.userData.findUnique({
      where: { email: decodedId },
    })

    console.log(`practitioner prisma: ${JSON.stringify(getPrismaUser)}`)

    if (!getPrismaUser) {
      return new Response(
        JSON.stringify({ error: 'User for Practitioner Data not found' }),
        {
          status: 404,
        }
      )
    }
  } catch (error) {
    console.error('Error updating practitioner data:', error)
    return new Response(
      JSON.stringify({
        error: 'Error updating practitioner data!',
      }),
      { status: 500 }
    )
  }

  // Remove invalid fields from practitionerData
  const { id, userId, user, ...validPractitionerData } = practitionerData

  // Try to update the practitioner data
  try {
    await prisma.practitioner.update({
      where: { id: getPrismaUser.id },
      data: validPractitionerData,
    })
  } catch (updateError: unknown) {
    // If update fails, create a new practitioner record
    console.error('updateError', updateError)
    return new Response(
      JSON.stringify({
        error: 'Error updating practitioner data!',
      }),
      { status: 500 }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Practitioner data updated successfully' }),
    { status: 200 }
  )
}
