// pages/api/protected.ts

import { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '../../middleware/auth'
import prisma from '@lib/prisma'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Access userId from req.userId
  // ! Fix this const should be `userId = req.userId`
  const userId = req.body

  // Your protected logic here, for example fetching user data
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // Your protected logic here
  res.status(200).json({ message: 'This is a protected route', userId })
}

export default authMiddleware(handler)
