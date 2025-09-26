import { NextRequest, NextResponse } from 'next/server'
import prisma from '@app/prisma/generated/client'
import { auth } from '../../../../auth'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const sequence = await prisma.asanaSequence.findUnique({ where: { id } })
    if (!sequence)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(sequence)
  } catch (error: any) {
    console.error('GET sequence error', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const { id } = resolvedParams
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    // Load existing sequence
    const existing = await prisma.asanaSequence.findUnique({ where: { id } })
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Enforce creator-only updates when created_by is present
    if (
      !existing.created_by ||
      existing.created_by.trim().toLowerCase() !==
        (session.user.email || '').trim().toLowerCase()
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Build update payload safely (only allow known fields)
    const allowed: any = {}
    if (typeof body.nameSequence === 'string')
      allowed.nameSequence = body.nameSequence
    if (typeof body.description === 'string')
      allowed.description = body.description
    if (typeof body.image === 'string') allowed.image = body.image
    if (Array.isArray(body.sequencesSeries))
      allowed.sequencesSeries = body.sequencesSeries
    if (typeof body.durationSequence === 'string')
      allowed.durationSequence = body.durationSequence
    if (typeof body.breath_direction === 'string')
      allowed.breath_direction = body.breath_direction
    // Never allow client to change created_by
    allowed.updatedAt = new Date()

    const updated = await prisma.asanaSequence.update({
      where: { id },
      data: allowed,
    })
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('PATCH sequence error', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams
    const existing = await prisma.asanaSequence.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const requester = (session.user.email || '').trim().toLowerCase()
    const owner = (existing.created_by || '').trim().toLowerCase()
    if (!owner || owner !== requester) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.asanaSequence.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('DELETE sequence error', error)
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    )
  }
}
