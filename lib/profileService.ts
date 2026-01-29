import { prisma } from './prismaClient'
import { logServiceError } from './errorLogger'

type LibraryType = 'asanas' | 'series' | 'sequences' | 'all'

interface GetLibraryParams {
  userId?: string | null
  type?: LibraryType
  limit?: number
  cursor?: string | null
  page?: number | null
  q?: string | null
  isAdmin?: boolean
}

function decodeCursor(cursor: string | null) {
  if (!cursor) return null
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

export async function getLibrary(params: GetLibraryParams) {
  const {
    userId = null,
    type = 'asanas',
    limit = 20,
    cursor = null,
    page = null,
  } = params

  const safeLimit = Math.max(1, Math.min(limit || 20, 100))

  try {
    const parsedCursor = decodeCursor(cursor)
    const invalidCursor = Boolean(cursor && !parsedCursor)

    // Support per-type paginated queries. Combined "all" is implemented by
    // fetching each type and merging/sorting which is heavier but functional.
    if (type === 'asanas') {
      const where: any = {}
      if (userId) {
        if (params.isAdmin) {
          // admin: no created_by filter (see all items)
        } else {
          // include user-created and PUBLIC content
          where.created_by = { in: [userId, 'PUBLIC'] }
        }
      } else {
        // unauthenticated: show public only
        where.created_by = 'PUBLIC'
      }

      // compute total count for this filter (without cursor)
      const totalCount = await prisma.asanaPose.count({ where })

      if (parsedCursor && parsedCursor.createdAt) {
        where.OR = [
          { created_on: { lt: new Date(parsedCursor.createdAt) } },
          {
            AND: [
              { created_on: new Date(parsedCursor.createdAt) },
              { id: { lt: parsedCursor.id } },
            ],
          },
        ]
      }

      if (invalidCursor) {
        return {
          items: [],
          nextCursor: null,
          hasMore: false,
          invalidCursor: true,
        }
      }
      // support page-based pagination when page is provided
      if (page && page > 0) {
        const skip = (page - 1) * safeLimit
        const paged = await prisma.asanaPose.findMany({
          where,
          orderBy: [{ created_on: 'desc' }, { id: 'desc' }],
          skip,
          take: safeLimit + 1,
        })

        const hasMore = paged.length > safeLimit
        const slice = paged.slice(0, safeLimit)
        let nextCursor = null
        if (hasMore) {
          const last = slice[slice.length - 1]
          if (last) {
            const ts = last.created_on
              ? last.created_on.toISOString()
              : new Date(0).toISOString()
            nextCursor = Buffer.from(
              JSON.stringify({ createdAt: ts, id: last.id })
            ).toString('base64')
          }
        }

        return { items: slice, nextCursor, hasMore, totalCount }
      }

      const items = await prisma.asanaPose.findMany({
        where,
        orderBy: [{ created_on: 'desc' }, { id: 'desc' }],
        take: safeLimit + 1,
      })

      const hasMore = items.length > safeLimit
      const slice = items.slice(0, safeLimit)
      let nextCursor = null
      if (hasMore) {
        const last = slice[slice.length - 1]
        if (last) {
          const ts = last.created_on
            ? last.created_on.toISOString()
            : new Date(0).toISOString()
          nextCursor = Buffer.from(
            JSON.stringify({ createdAt: ts, id: last.id })
          ).toString('base64')
        }
      }

      return { items: slice, nextCursor, hasMore, totalCount }
    }

    if (type === 'series') {
      const where: any = {}
      if (userId) {
        if (params.isAdmin) {
          // admin: no filter
        } else {
          where.created_by = { in: [userId, 'PUBLIC'] }
        }
      } else {
        where.created_by = 'PUBLIC'
      }

      // compute total count for this filter (without cursor)
      const totalCount = await prisma.asanaSeries.count({ where })

      if (parsedCursor && parsedCursor.createdAt) {
        where.OR = [
          { createdAt: { lt: new Date(parsedCursor.createdAt) } },
          {
            AND: [
              { createdAt: new Date(parsedCursor.createdAt) },
              { id: { lt: parsedCursor.id } },
            ],
          },
        ]
      }

      if (invalidCursor) {
        return {
          items: [],
          nextCursor: null,
          hasMore: false,
          invalidCursor: true,
        }
      }
      if (page && page > 0) {
        const skip = (page - 1) * safeLimit
        const paged = await prisma.asanaSeries.findMany({
          where,
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          skip,
          take: safeLimit + 1,
        })

        const hasMore = paged.length > safeLimit
        const slice = paged.slice(0, safeLimit)
        let nextCursor = null
        if (hasMore) {
          const last = slice[slice.length - 1]
          if (last) {
            const ts = last.createdAt
              ? last.createdAt.toISOString()
              : new Date(0).toISOString()
            nextCursor = Buffer.from(
              JSON.stringify({ createdAt: ts, id: last.id })
            ).toString('base64')
          }
        }

        return { items: slice, nextCursor, hasMore, totalCount }
      }

      const items = await prisma.asanaSeries.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: safeLimit + 1,
      })

      const hasMore = items.length > safeLimit
      const slice = items.slice(0, safeLimit)
      let nextCursor = null
      if (hasMore) {
        const last = slice[slice.length - 1]
        if (last) {
          const ts = last.createdAt
            ? last.createdAt.toISOString()
            : new Date(0).toISOString()
          nextCursor = Buffer.from(
            JSON.stringify({ createdAt: ts, id: last.id })
          ).toString('base64')
        }
      }

      return { items: slice, nextCursor, hasMore, totalCount }
    }

    if (type === 'sequences') {
      const where: any = {}
      if (userId) {
        if (params.isAdmin) {
          // admin: no filter
        } else {
          where.created_by = { in: [userId, 'PUBLIC'] }
        }
      } else {
        where.created_by = 'PUBLIC'
      }

      const totalCount = await prisma.asanaSequence.count({ where })

      if (parsedCursor && parsedCursor.createdAt) {
        where.OR = [
          { createdAt: { lt: new Date(parsedCursor.createdAt) } },
          {
            AND: [
              { createdAt: new Date(parsedCursor.createdAt) },
              { id: { lt: parsedCursor.id } },
            ],
          },
        ]
      }

      if (invalidCursor) {
        return {
          items: [],
          nextCursor: null,
          hasMore: false,
          invalidCursor: true,
        }
      }
      if (page && page > 0) {
        const skip = (page - 1) * safeLimit
        const paged = await prisma.asanaSequence.findMany({
          where,
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          skip,
          take: safeLimit + 1,
        })

        const hasMore = paged.length > safeLimit
        const slice = paged.slice(0, safeLimit)
        let nextCursor = null
        if (hasMore) {
          const last = slice[slice.length - 1]
          if (last) {
            const ts = last.createdAt
              ? last.createdAt.toISOString()
              : new Date(0).toISOString()
            nextCursor = Buffer.from(
              JSON.stringify({ createdAt: ts, id: last.id })
            ).toString('base64')
          }
        }

        return { items: slice, nextCursor, hasMore, totalCount }
      }

      const items = await prisma.asanaSequence.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: safeLimit + 1,
      })

      const hasMore = items.length > safeLimit
      const slice = items.slice(0, safeLimit)
      const nextCursor = hasMore
        ? Buffer.from(
            JSON.stringify({
              createdAt: slice[slice.length - 1].createdAt,
              id: slice[slice.length - 1].id,
            })
          ).toString('base64')
        : null

      return { items: slice, nextCursor, hasMore, totalCount }
    }

    // type === 'all' - fetch all three types and merge by createdAt desc
    // For `all` we apply the same per-model visibility rules so users see their
    // own and PUBLIC content; admins see everything.
    const poseWhere: any = {}
    const seriesWhere: any = {}
    const seqWhere: any = {}
    if (userId) {
      if (!params.isAdmin) {
        poseWhere.created_by = { in: [userId, 'PUBLIC'] }
        seriesWhere.created_by = { in: [userId, 'PUBLIC'] }
        seqWhere.created_by = { in: [userId, 'PUBLIC'] }
      }
    } else {
      poseWhere.created_by = 'PUBLIC'
      seriesWhere.created_by = 'PUBLIC'
      seqWhere.created_by = 'PUBLIC'
    }

    const [poses, series, sequences] = await Promise.all([
      prisma.asanaPose.findMany({
        where: poseWhere,
        orderBy: { created_on: 'desc' },
      }),
      prisma.asanaSeries.findMany({
        where: seriesWhere,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asanaSequence.findMany({
        where: seqWhere,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // compute totals for combined view
    const [poseCount, seriesCount, seqCount] = await Promise.all([
      prisma.asanaPose.count({ where: poseWhere }),
      prisma.asanaSeries.count({ where: seriesWhere }),
      prisma.asanaSequence.count({ where: seqWhere }),
    ])

    // Normalize items with a type marker and createdAt for sorting
    const posesMapped = poses.map((p) => ({
      ...p,
      __type: 'asana',
      createdAt: p.created_on
        ? p.created_on.toISOString()
        : new Date(0).toISOString(),
    }))

    const seriesMapped = series.map((s) => ({
      ...s,
      __type: 'series',
      createdAt: s.createdAt
        ? s.createdAt.toISOString()
        : new Date(0).toISOString(),
    }))

    const sequencesMapped = sequences.map((sq) => ({
      ...sq,
      __type: 'sequence',
      createdAt: sq.createdAt
        ? sq.createdAt.toISOString()
        : new Date(0).toISOString(),
    }))

    const normalized: any[] = [
      ...posesMapped,
      ...seriesMapped,
      ...sequencesMapped,
    ].sort((a, b) => {
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return tb - ta
    })

    const sliceAll = normalized.slice(0, safeLimit)
    const hasMoreAll = normalized.length > safeLimit
    const nextCursorAll = hasMoreAll
      ? Buffer.from(
          JSON.stringify({
            createdAt:
              (sliceAll[sliceAll.length - 1].createdAt &&
                sliceAll[sliceAll.length - 1].createdAt.toString()) ||
              new Date(0).toISOString(),
            id: sliceAll[sliceAll.length - 1].id,
          })
        ).toString('base64')
      : null

    const totalCountAll = poseCount + seriesCount + seqCount

    return {
      items: sliceAll,
      nextCursor: nextCursorAll,
      hasMore: hasMoreAll,
      totalCount: totalCountAll,
    }
  } catch (error) {
    logServiceError(error, 'profileService', 'getLibrary', { params })
    throw error
  }
}

export default { getLibrary }
