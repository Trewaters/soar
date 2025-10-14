import { PrismaClient } from '../../../../prisma/generated/client'
import { auth } from '../../../../auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const seriesName = body.seriesName
  const seriesPoses: string[] = Array.isArray(body.seriesPoses)
    ? body.seriesPoses
    : typeof body.seriesPoses === 'string'
      ? [body.seriesPoses]
      : []
  const rawBreath = body.breathSeries ?? body.breath ?? []
  const breathSeries: string[] = Array.isArray(rawBreath)
    ? rawBreath
    : typeof rawBreath === 'string' && rawBreath.trim().length > 0
      ? [rawBreath]
      : []
  const description = body.description ?? ''
  const durationSeries = body.durationSeries ?? body.duration ?? ''
  const image = body.image ?? ''

  try {
    // const body: FlowSeriesData = await request.json()

    // const maxIdRecord = await prisma.asanaSeries.findFirst({
    //   orderBy: {
    //     id: 'desc',
    //   },
    //   select: {
    //     id: true,
    //   },
    // })

    // const newId = maxIdRecord ? maxIdRecord.id + 1 : 1
    // Get the current date and time
    // const now = new Date()
    // const newId = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`
    const session = await auth().catch(() => null)
    const createdBy = session?.user?.email ?? 'guest'

    // Try create with `seriesPoses` field first, fallback to `seriesPoses` if needed
    let newSeries: any
    try {
      newSeries = await prisma.asanaSeries.create({
        data: {
          seriesName,
          seriesPoses,
          breathSeries,
          description,
          durationSeries,
          image,
          images: image ? [image] : [], // Initialize images array with legacy image if present
          created_by: createdBy,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      })
    } catch (e) {
      // Fallback to older field name `seriesPoses`
      newSeries = await prisma.asanaSeries.create({
        data: {
          seriesName,
          seriesPoses: seriesPoses,
          breathSeries,
          description,
          durationSeries,
          image,
          images: image ? [image] : [],
          created_by: createdBy,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any,
      })
    }
    const timestamp = Date.now().toString()
    return Response.json(
      {
        message: 'Series Data saved',
        timestamp,
        id: newSeries.id,
        seriesName: newSeries.seriesName,
      },
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Last-Modified': new Date().toUTCString(),
          'Surrogate-Control': 'no-store',
          Vary: 'Accept, Accept-Encoding, User-Agent',
          'X-Timestamp': timestamp,
          'X-Cache-Bust': `v${timestamp}`,
        },
      }
    )
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
