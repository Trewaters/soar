import { PrismaClient } from "@prisma/generated/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, practitionerData } = await req.json()
  const decodedId = email.toString().replace("%40", "@").replace("=", "")
  let getPrismaUser

  try {
    getPrismaUser = await prisma.userData.findUnique({
      where: { email: decodedId },
    })

    if (!getPrismaUser) {
      await prisma.$disconnect()
      return new Response(
        JSON.stringify({ error: "User for Practitioner Data not found" }),
        {
          status: 404,
        }
      )
    }
  } catch (error) {
    await prisma.$disconnect()
    return new Response(
      JSON.stringify({
        error: "Error updating practitioner data!",
      }),
      { status: 500 }
    )
  }

  // Remove invalid fields from practitionerData
  // eslint-disable-next-line no-unused-vars
  const { id, userId, user, ...validPractitionerData } = practitionerData

  // Try to update the practitioner data
  try {
    await prisma.userData.update({
      where: { id: getPrismaUser.id },
      data: validPractitionerData,
    })
  } catch (updateError: unknown) {
    await prisma.$disconnect()
    // If update fails, create a new practitioner record
    return new Response(
      JSON.stringify({
        error: "Error updating practitioner data!",
      }),
      { status: 500 }
    )
  }
  await prisma.$disconnect()
  return new Response(
    JSON.stringify({ message: "Practitioner data updated successfully" }),
    { status: 200 }
  )
}
