// pages/api/logout.ts

import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Perform any necessary logout tasks (if any)
    res.status(200).json({ message: 'Logged out successfully' })
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
