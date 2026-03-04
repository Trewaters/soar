import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../app/lib/prismaClient'
import { auth } from '../../../../auth'
import { canModifyContent } from '@app/utils/authorization'
import { formatSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'

const ALLOWED_BREATH_SERIES_VALUES = new Set([
  'Inhale',
  'Hold full',
  'Exhale',
  'Hold empty',
])

// Use shared prisma client

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

    // Fetch full series record (no select) to tolerate schema rename from pose->pose
    const series: any = await prisma.asanaSeries.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Check if user can access this series (PUBLIC or owned content)
    const isPublic = series.created_by === 'PUBLIC'
    const canAccess =
      isPublic || (await canModifyContent(series.created_by || ''))

    if (!canAccess) {
      return NextResponse.json(
        { error: 'You do not have permission to access this series' },
        { status: 403 }
      )
    }

    // Normalize to FlowSeriesData shape expected by the client
    const normalized = {
      id: series.id,
      seriesName: series.seriesName || '',
      // support either `seriesPoses` (new) or `seriesPoses` (old)
      seriesPoses: Array.isArray(series.seriesPoses)
        ? series.seriesPoses
        : Array.isArray(series.seriesPoses)
          ? series.seriesPoses
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

    // Check if user is authorized to modify this series
    // PUBLIC content can be modified by admins, personal content by owner/admin
    if (!(await canModifyContent(existingSeries.created_by || ''))) {
      return NextResponse.json(
        { error: 'You do not have permission to modify this series' },
        { status: 403 }
      )
    }
    // Prepare updates according to existing schema fields
    const updateData: any = {
      updatedAt: new Date(),
    }
    if (typeof description === 'string') updateData.description = description
    if (typeof name === 'string') updateData.seriesName = name
    // Accept either `asanas` (legacy) or `seriesPoses` (new JSON entries)
    const rawSeriesPoses = body?.seriesPoses ?? body?.series_poses
    if (Array.isArray(rawSeriesPoses)) {
      // Preserve objects as-is but sanitize alignment_cues
      updateData.seriesPoses = rawSeriesPoses.map((item: any) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const normalized = { ...item }
          if (typeof normalized.alignment_cues === 'string') {
            normalized.alignment_cues = normalized.alignment_cues.slice(0, 1000)
          }
          if (typeof normalized.breathSeries === 'string') {
            const breathValue = normalized.breathSeries.trim()
            normalized.breathSeries = ALLOWED_BREATH_SERIES_VALUES.has(
              breathValue
            )
              ? breathValue
              : ''
          }
          return normalized
        }
        // fallback: if a string was provided, keep as label
        return item
      })
    } else if (Array.isArray(asanas)) {
      updateData.seriesPoses = asanas.map((a) =>
        formatSeriesPoseEntry(a.name, a.difficulty)
      )
    }
    // Legacy top-level breathSeries support (read-only compat path).
    // New writes should store breath at seriesPoses[].breathSeries.
    if (!updateData.seriesPoses) {
      if (Array.isArray(breathInput)) {
        updateData.breathSeries = breathInput
      } else if (typeof breathInput === 'string') {
        const s = breathInput.trim()
        updateData.breathSeries = s.length ? [s] : []
      }
    }
    if (typeof durationInput === 'string')
      updateData.durationSeries = durationInput
    if (typeof imageInput === 'string') updateData.image = imageInput

    // Try updating using `seriesPoses` first, fall back to `seriesPoses` if update fails
    let updated: any
    try {
      updated = await prisma.asanaSeries.update({
        where: { id: resolvedParams.id },
        data: updateData,
      })
    } catch (e) {
      // fallback: map seriesPoses -> seriesPoses
      if (updateData.seriesPoses) {
        const fallbackData = { ...updateData }
        // map new `seriesPoses` to legacy `series_poses` (alternate schema name) before deleting the new key
        fallbackData.series_poses = fallbackData.seriesPoses
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

    // Check if user is authorized to delete this series
    // PUBLIC content can be deleted by admins, personal content by owner/admin
    if (!(await canModifyContent(existingSeries.created_by || ''))) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this series' },
        { status: 403 }
      )
    }
    await prisma.asanaSeries.delete({
      where: { id: resolvedParams.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
