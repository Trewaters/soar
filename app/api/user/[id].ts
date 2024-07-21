import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  // const { id } = req.query
  const { email } = req.query
  console.log(`api GET user: ${email}`)

  try {
    const user = await prisma.user.findUnique({
      // where: { id },
      where: { email },
    })
    console.log(`api GET user: ${user}`)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' })
  }
}
