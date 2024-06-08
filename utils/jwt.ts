import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'your-secret-key'

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, secret, {
    expiresIn: '1h',
  })
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret) as { userId: string }
  } catch (error) {
    return null
  }
}
