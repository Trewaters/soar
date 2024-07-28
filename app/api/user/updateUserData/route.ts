import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { pronouns, email } = await req.json()

  // console.log(`pronouns, email: ${pronouns}, ${email}`)

  const decodedId = email.toString().replace('%40', '@').replace('=', '')
  // console.log(`Decoded id: ${decodedId}`)

  try {
    await prisma.userData.update({
      where: { email: decodedId },
      data: { pronouns },
    })
    return Response.json({ message: 'Data saved' })
  } catch (error) {
    return Response.json({ error: 'Error saving data' })
  }
}
