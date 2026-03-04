import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { isAdmin } from '@app/utils/authorization'
import { prisma } from '../../../app/lib/prismaClient'
import { isValidTosFile } from '@app/compliance/terms/server/tosFileRegistry'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl)
    const versionId = searchParams.get('versionId')

    if (versionId) {
      const v = await prisma.tosVersion.findUnique({ where: { id: versionId } })
      if (!v)
        return NextResponse.json(
          { error: 'TOS version not found' },
          { status: 404 }
        )
      return NextResponse.json(v)
    }

    // default: return active version (most recently created active)
    const active = await prisma.tosVersion.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!active)
      return NextResponse.json(
        { error: 'No active TOS version' },
        { status: 404 }
      )
    return NextResponse.json(active)
  } catch (error: any) {
    console.error('Error fetching TOS version:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only admins may create/publish TOS versions
    const session = await auth()
    const admin = await isAdmin()
    if (!session || !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, summary, effectiveAt, externalUrl, active, contentFile } =
      body

    if (!title || !effectiveAt || !contentFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!isValidTosFile(contentFile)) {
      return NextResponse.json(
        {
          error:
            'Invalid content file. Add a .md file under app/compliance/terms/content and select it.',
        },
        { status: 400 }
      )
    }

    // If setting active=true, deactivate other versions first
    if (active) {
      await prisma.tosVersion.updateMany({ where: {}, data: { active: false } })
    }

    const createData = {
      title,
      summary: summary || null,
      effectiveAt: new Date(effectiveAt),
      externalUrl: contentFile || externalUrl || undefined,
      active: Boolean(active),
    }

    if (active) {
      try {
        // Try to run deactivate + create inside a transaction for atomicity.
        let created
        try {
          created = await prisma.$transaction(async (tx) => {
            await tx.tosVersion.updateMany({
              where: { active: true },
              data: { active: false },
            })
            return tx.tosVersion.create({ data: createData })
          })
        } catch (txErr) {
          // Some environments (local MongoDB) may not support transactions.
          console.warn(
            '[api/tos] transaction failed, falling back to sequential operations',
            txErr
          )
          await prisma.tosVersion.updateMany({
            where: { active: true },
            data: { active: false },
          })
          created = await prisma.tosVersion.create({ data: createData })
        }
        return NextResponse.json(created, { status: 201 })
      } catch (err: any) {
        console.error('[api/tos] create-with-deactivate error:', err)
        return NextResponse.json(
          { error: err?.message || 'Create failed' },
          { status: 500 }
        )
      }
    }

    // not active: simple create
    try {
      const created = await prisma.tosVersion.create({ data: createData })
      return NextResponse.json(created, { status: 201 })
    } catch (err: any) {
      console.error('[api/tos] prisma create error:', err)
      return NextResponse.json(
        { error: err?.message || 'Prisma create failed' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error creating TOS version:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
