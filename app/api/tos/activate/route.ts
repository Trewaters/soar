import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@app/utils/authorization'
import { prisma } from '@lib/prismaClient'
import { auth } from '../../../../auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const admin = await isAdmin()
    if (!session || !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { versionId } = body
    if (!versionId) {
      return NextResponse.json({ error: 'Missing versionId' }, { status: 400 })
    }

    // Deactivate all versions, then activate the selected one
    const deact = await prisma.tosVersion.updateMany({
      where: {},
      data: { active: false },
    })

    const updated = await prisma.tosVersion.update({
      where: { id: versionId },
      data: { active: true },
    })
    return NextResponse.json({ ok: true, updated })
  } catch (err: any) {
    console.error('Error activating TOS version:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
