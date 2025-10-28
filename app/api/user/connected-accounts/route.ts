import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '../../../../prisma/generated/client'

const prisma = new PrismaClient()

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

/**
 * GET /api/user/connected-accounts
 * Fetches all OAuth provider accounts connected to the current user
 */
export async function GET() {
  try {
    // Get current session
    const session = await auth()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
      include: {
        providerAccounts: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform provider accounts into a cleaner format
    const connectedAccounts = user.providerAccounts.map((account) => ({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      connectedAt: account.createdAt,
    }))

    return NextResponse.json({
      accounts: connectedAccounts,
      totalCount: connectedAccounts.length,
    })
  } catch (error) {
    console.error('Error fetching connected accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connected accounts' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * DELETE /api/user/connected-accounts
 * Disconnects an OAuth provider from the current user
 * Body: { provider: 'google' | 'github' }
 */
export async function DELETE(request: Request) {
  try {
    // Get current session
    const session = await auth()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { provider } = body

    if (!provider || !['google', 'github'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be "google" or "github"' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
      include: {
        providerAccounts: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has this provider connected
    const providerAccount = user.providerAccounts.find(
      (account) => account.provider === provider
    )

    if (!providerAccount) {
      return NextResponse.json(
        { error: `${provider} account not connected` },
        { status: 404 }
      )
    }

    // Don't allow disconnecting the only authentication method
    if (user.providerAccounts.length === 1) {
      return NextResponse.json(
        { error: 'Cannot disconnect your only authentication method' },
        { status: 400 }
      )
    }

    // Delete the provider account
    await prisma.providerAccount.delete({
      where: { id: providerAccount.id },
    })

    return NextResponse.json({
      message: `${provider} account disconnected successfully`,
      provider,
    })
  } catch (error) {
    console.error('Error disconnecting account:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
