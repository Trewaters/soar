import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-8)

  // TODO: Save the tempPassword securely in your database and associate it with the user
  console.log(`Generated temporary password for ${email}: ${tempPassword}`)

  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  })

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Recovery',
      text: `Your temporary password is: ${tempPassword}`,
    })

    res.status(200).json({ message: 'Temporary password sent.' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Failed to send email.' })
  }
}
