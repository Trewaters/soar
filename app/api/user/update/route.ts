import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(req: any) {
  // if (req.method === 'POST') {
  //   const { pronouns, id } = req.body
  //   try {
  //     await prisma.userData.update({
  //       where: { id },
  //       data: { pronouns },
  //     })
  //     Response.json({ message: 'Data saved' })
  //   } catch (error) {
  //     Response.json({ error: 'Error saving data' })
  //   }
  // } else {
  //   Response.setHeader('Allow', ['POST'])
  //   Response.status(405).end(`Method ${req.method} Not Allowed`)
  // }

  const { pronouns, id } = req.body
  try {
    await prisma.userData.update({
      where: { id },
      data: { pronouns },
    })
    return Response.json({ message: 'Data saved' })
  } catch (error) {
    return Response.json({ error: 'Error saving data' })
  }
}
