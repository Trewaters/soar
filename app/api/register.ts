import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import bcrypt from 'bcrypt'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body
//     // Hash password
//     // const hashedPassword = await bcrypt.hash(password, 10)

//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({ where: { email } })
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' })
//     }

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         // password: hashedPassword,
//       },
//     })

//     res.status(201).json(user)
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' })
//   }
// }
