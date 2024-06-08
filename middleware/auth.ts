// middleware/auth.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { verifyToken } from '../utils/jwt'

const authMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Attach userId to request object
    req.userId = decoded.userId

    return handler(req, res)
  }
}

export default authMiddleware
