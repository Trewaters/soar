// pages/api/user.ts

import prisma from '@lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
