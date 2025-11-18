import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'
import { hashPassword, comparePassword } from '@app/utils/password'

const prisma = new PrismaClient()

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

/**
 * POST /api/user/change-password
 * Changes the password for credentials-based accounts only
 * Security best practices:
 * - Requires current password verification
 * - Strong password validation
 * - Only works for credentials provider accounts
 * - Uses bcrypt for password hashing
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has credentials provider account
    const credentialsAccount = await prisma.providerAccount.findFirst({
      where: {
        userId: user.id,
        provider: 'credentials',
      },
    })

    if (!credentialsAccount) {
      return NextResponse.json(
        {
          error:
            'Password change is only available for accounts created with email/password. Social login accounts (Google, GitHub) cannot change passwords here.',
        },
        { status: 403 }
      )
    }

    if (!credentialsAccount.credentials_password) {
      return NextResponse.json(
        { error: 'No password set for this account' },
        { status: 400 }
      )
    }

    // Verify current password
    const isValidPassword = await comparePassword(
      currentPassword,
      credentialsAccount.credentials_password
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      )
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      )
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character' },
        { status: 400 }
      )
    }

    // Check if new password is same as current password
    const isSamePassword = await comparePassword(
      newPassword,
      credentialsAccount.credentials_password
    )

    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password in database
    await prisma.providerAccount.update({
      where: {
        id: credentialsAccount.id,
      },
      data: {
        credentials_password: hashedNewPassword,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Password changed successfully',
      success: true,
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password. Please try again.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
