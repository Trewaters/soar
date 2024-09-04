import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { seriesName, seriesPostures, breath, description, duration, image } =
    await request.json()

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

    await prisma.asanaSeries.create({
      data: {
        seriesName,
        seriesPostures,
        breath,
        description,
        duration,
        image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return Response.json({ message: 'Series Data saved' })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
