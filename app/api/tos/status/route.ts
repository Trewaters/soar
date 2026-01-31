import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const active = await prisma.tosVersion.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!active) {
      return NextResponse.json(
        { error: 'No active TOS version' },
        { status: 404 }
      )
    }

    const user = await prisma.userData.findUnique({
      where: { id: session.user.id },
      select: { acceptedTosVersionId: true },
    })

    const accepted = !!user && user.acceptedTosVersionId === active.id

    return NextResponse.json({
      accepted,
      activeVersionId: active.id,
      userAcceptedVersionId: user?.acceptedTosVersionId ?? null,
    })
  } catch (error: any) {
    console.error('Error fetching TOS status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
