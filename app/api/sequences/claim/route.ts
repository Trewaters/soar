import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@lib/prismaClient'
import { auth } from '../../../../auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/sequences/claim
 * Allows authenticated users to claim sequences with "alpha users" or invalid ownership
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { sequenceId } = body

    if (!sequenceId) {
      return NextResponse.json(
        { error: 'sequenceId is required' },
        { status: 400 }
      )
    }

    // Load existing sequence
    const existing = await prisma.asanaSequence.findUnique({
      where: { id: sequenceId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }

    // Only allow claiming sequences with "alpha users" or invalid ownership
    // DO NOT allow claiming sequences owned by other users
    const allowedClaimValues = ['alpha users', 'PUBLIC', null, undefined, '']
    const canClaim = allowedClaimValues.includes(existing.created_by as any)

    if (!canClaim) {
      return NextResponse.json(
        {
          error: 'Cannot claim this sequence. It belongs to another user.',
          currentOwner: existing.created_by,
        },
        { status: 403 }
      )
    }

    // Update ownership to current user
    const updated = await prisma.asanaSequence.update({
      where: { id: sequenceId },
      data: {
        created_by: session.user.email,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Sequence claimed successfully',
      sequence: updated,
    })
  } catch (error: any) {
    console.error('Claim sequence error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
