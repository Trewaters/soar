import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/generated/client'
import { auth } from '../../../../auth'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { formatSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    const resolvedParams = await params

    // Fetch full series record (no select) to tolerate schema rename from posture->pose
    const series: any = await prisma.asanaSeries.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Check if user can access this series (own series or alpha user series)
    const currentUserEmail = session.user.email
    const alphaUserIds = getAlphaUserIds()
    const allowedCreators = [currentUserEmail, ...alphaUserIds]

    if (!series.created_by || !allowedCreators.includes(series.created_by)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Normalize to FlowSeriesData shape expected by the client
    const normalized = {
      id: series.id,
      seriesName: series.seriesName || '',
      // support either `seriesPoses` (new) or `seriesPostures` (old)
      seriesPoses: Array.isArray(series.seriesPoses)
        ? series.seriesPoses
        : Array.isArray(series.seriesPostures)
          ? series.seriesPostures
          : [],
      breath: Array.isArray(series.breathSeries)
        ? series.breathSeries.join(', ')
        : '',
      description: series.description ?? '',
      duration: series.durationSeries ?? '',
      image: series.image ?? '',
      createdBy: series.created_by,
      createdAt: series.createdAt ?? null,
      updatedAt: series.updatedAt ?? null,
    }

    return NextResponse.json(normalized)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    const resolvedParams = await params
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
      where: { id: resolvedParams.id },
    })
    if (!existingSeries) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Check access permissions: allow if user is creator or alpha user
    const currentUserEmail = session.user.email
    const alphaUserIds = getAlphaUserIds()
    const isCreator = existingSeries.created_by === currentUserEmail
    const isAlphaUser = alphaUserIds.includes(currentUserEmail)

    if (!isCreator && !isAlphaUser) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the creator and not an alpha user' },
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
      updateData.seriesPoses = asanas.map((a) =>
        formatSeriesPoseEntry(a.name, a.difficulty)
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

    // Try updating using `seriesPoses` first, fall back to `seriesPostures` if update fails
    let updated: any
    try {
      updated = await prisma.asanaSeries.update({
        where: { id: resolvedParams.id },
        data: updateData,
      })
    } catch (e) {
      // fallback: map seriesPoses -> seriesPostures
      if (updateData.seriesPoses) {
        const fallbackData = { ...updateData }
        fallbackData.seriesPostures = fallbackData.seriesPoses
        delete fallbackData.seriesPoses
        updated = await prisma.asanaSeries.update({
          where: { id: resolvedParams.id },
          data: fallbackData,
        })
      } else {
        throw e
      }
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    const resolvedParams = await params
    // Fetch series to check ownership
    const existingSeries = await prisma.asanaSeries.findUnique({
      where: { id: resolvedParams.id },
    })
    if (!existingSeries) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Check access permissions: allow if user is creator or alpha user
    const currentUserEmail = session.user.email
    const alphaUserIds = getAlphaUserIds()
    const isCreator = existingSeries.created_by === currentUserEmail
    const isAlphaUser = alphaUserIds.includes(currentUserEmail)

    if (!isCreator && !isAlphaUser) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the creator and not an alpha user' },
        { status: 403 }
      )
    }
    await prisma.asanaSeries.delete({
      where: { id: resolvedParams.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
