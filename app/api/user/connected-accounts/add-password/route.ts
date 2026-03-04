import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import prisma from '@app/lib/prismaClient'
import { hashPassword } from '@app/utils/password'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Parse request body
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      )
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      )
    }

    // Check if user already has credentials provider
    const existingCredentials = await prisma.providerAccount.findFirst({
      where: {
        userId,
        provider: 'credentials',
      },
    })

    if (existingCredentials) {
      return NextResponse.json(
        { error: 'User already has a password set' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create new credentials provider account
    await prisma.providerAccount.create({
      data: {
        userId,
        provider: 'credentials',
        providerAccountId: userId, // Use userId as providerAccountId for credentials
        type: 'credentials',
        credentials_password: hashedPassword,
      },
    })

    return NextResponse.json({
      message: 'Password added successfully',
      provider: 'credentials',
    })
  } catch (error) {
    console.error('Error adding password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
