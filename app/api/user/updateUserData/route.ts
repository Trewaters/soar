import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const {
    email,
    updatedAt,
    pronouns,
    headline,
    websiteURL,
    location,
    firstName,
    lastName,
    bio,
  } = await req.json()

  const decodedId = email.toString().replace('%40', '@').replace('=', '')

  try {
    await prisma.userData.update({
      where: { email: decodedId },
      data: {
        updatedAt,
        pronouns,
        headline,
        websiteURL,
        location,
        firstName,
        lastName,
        bio,
      },
    })
    return Response.json({ message: 'User Data saved' })
  } catch (error) {
    return Response.json({ error: 'Error saving data' })
  }
}
