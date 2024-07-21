import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { pronouns, id } = req.body
    try {
      await prisma.user.update({
        where: { id },
        data: { pronouns },
      })
      res.status(200).json({ message: 'Data saved' })
    } catch (error) {
      res.status(500).json({ error: 'Error saving data' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
