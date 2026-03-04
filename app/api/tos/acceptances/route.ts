import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@app/utils/authorization'
import { prisma } from '../../../../app/lib/prismaClient'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin'])

    const url = new URL(request.url)
    const versionId = url.searchParams.get('versionId')
    const userId = url.searchParams.get('userId')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const where: any = {}
    if (versionId) where.tosVersionId = versionId
    if (userId) where.userId = userId
    if (from || to) where.acceptedAt = {}
    if (from) where.acceptedAt.gte = new Date(from)
    if (to) where.acceptedAt.lte = new Date(to)

    const records = await prisma.userTosAcceptance.findMany({
      where,
      orderBy: { acceptedAt: 'desc' },
      take: 1000,
      include: { user: { select: { id: true, email: true, name: true } } },
    })

    return NextResponse.json({ data: records })
  } catch (error: any) {
    console.error('Error fetching acceptances:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
