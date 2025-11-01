import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../app/lib/prismaClient'
import { hashPassword, comparePassword } from '../../../utils/password'

// Use shared prisma client

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (action === 'create') {
      // Test account creation
      const existingUser = await prisma.userData.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        )
      }

      // Create new user
      const user = await prisma.userData.create({
        data: {
          email: email,
          name: email.split('@')[0],
          provider_id: `credentials_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique ID for credentials users
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: '',
          lastName: '',
          bio: '',
          headline: '',
          location: '',
          websiteURL: '',
          shareQuick: '',
          yogaStyle: '',
          yogaExperience: '',
          company: '',
          socialURL: '',
          isLocationPublic: '',
          role: 'user',
        },
      })

      // Create provider account with hashed password
      const hashedPassword = await hashPassword(password)
      await prisma.providerAccount.create({
        data: {
          userId: user.id,
          provider: 'credentials',
          providerAccountId: user.id,
          type: 'credentials',
          credentials_password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          userId: user.id,
        },
        { status: 201 }
      )
    } else if (action === 'verify') {
      // Test account verification
      const user = await prisma.userData.findUnique({
        where: { email },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const providerAccount = await prisma.providerAccount.findUnique({
        where: { userId: user.id },
      })

      if (!providerAccount || !providerAccount.credentials_password) {
        return NextResponse.json(
          { error: 'No credentials found' },
          { status: 404 }
        )
      }

      const isValidPassword = await comparePassword(
        password,
        providerAccount.credentials_password
      )

      return NextResponse.json({
        success: true,
        passwordValid: isValidPassword,
        userId: user.id,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Test credentials error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
