import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/generated/client'
import { auth } from '../../../../auth'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    const body = await request.json()
    const name: string | undefined = body?.name
    const description: string | undefined = body?.description
    const asanas:
      | Array<{ id: string; name: string; difficulty?: string }>
      | undefined = body?.asanas
    const breathInput = body?.breathSeries ?? body?.breath
    const durationInput: string | undefined =
      body?.durationSeries ?? body?.duration
    const imageInput: string | undefined = body?.image
    // Fetch series to check ownership
    const existingSeries = await prisma.asanaSeries.findUnique({
      where: { id: params.id },
    })
    if (!existingSeries) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }
    if (existingSeries.created_by !== session.user.email) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the creator' },
        { status: 403 }
      )
    }
    // Prepare updates according to existing schema fields
    const updateData: any = {
      updatedAt: new Date(),
    }
    if (typeof description === 'string') updateData.description = description
    if (typeof name === 'string') updateData.seriesName = name
    if (Array.isArray(asanas)) {
      updateData.seriesPostures = asanas.map((a) =>
        `${a.name}; ${a.difficulty ?? ''}`.trim()
      )
    }
    if (Array.isArray(breathInput)) {
      updateData.breathSeries = breathInput
    } else if (typeof breathInput === 'string') {
      const s = breathInput.trim()
      updateData.breathSeries = s.length ? [s] : []
    }
    if (typeof durationInput === 'string')
      updateData.durationSeries = durationInput
    if (typeof imageInput === 'string') updateData.image = imageInput

    const updated = await prisma.asanaSeries.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    // Fetch series to check ownership
    const existingSeries = await prisma.asanaSeries.findUnique({
      where: { id: params.id },
    })
    if (!existingSeries) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }
    if (existingSeries.created_by !== session.user.email) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the creator' },
        { status: 403 }
      )
    }
    await prisma.asanaSeries.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
