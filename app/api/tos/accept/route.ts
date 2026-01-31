import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      console.warn('[api/tos/accept] unauthorized request, session missing')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { tosVersionId, method } = body || {}

    // Resolve TOS version: use provided id or fall back to active version
    let versionId = tosVersionId
    if (!versionId) {
      const active = await prisma.tosVersion.findFirst({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      })
      if (!active) {
        return NextResponse.json(
          { error: 'No active TOS version available' },
          { status: 400 }
        )
      }
      versionId = active.id
    }

    // Capture metadata from headers
    const headers = request.headers
    const forwarded =
      headers.get('x-forwarded-for') || headers.get('x-real-ip') || null
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : null
    const userAgent = headers.get('user-agent') || null

    // Create acceptance record (append-only)
    const created = await prisma.userTosAcceptance.create({
      data: {
        userId: session.user.id,
        tosVersionId: versionId,
        ipAddress,
        userAgent,
        method: method || 'reauthorize',
      },
    })

    // Update denormalized fields on the user for quick checks
    const updated = await prisma.userData.update({
      where: { id: session.user.id },
      data: {
        acceptedTosVersionId: versionId,
        acceptedTosAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error recording TOS acceptance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
