import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const {
    seriesName,
    seriesPostures,
    breath_duration,
    description,
    duration,
    image,
  } = await request.json()

  console.log(
    'createSeries-POST Request',
    seriesName,
    seriesPostures,
    breath_duration,
    description,
    duration,
    image
  )

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
        breath_duration,
        description,
        duration,
        image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    // return Response.json(data)
    console.log('Response', Response)
    return Response.json({ message: 'Series Data saved' })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// export async function POST() {
//   try {
//     const data = await prisma.asanaSeries.create({
//       data: {
//         id: '1',
//         seriesName: 'Sun Salutation',
//         seriesPostures: [
//           'Mountain Pose',
//           'Upward Salute',
//           'Forward Fold',
//           'Half Forward Fold',
//           'Plank Pose',
//           'Four-Limbed Staff Pose',
//           'Upward-Facing Dog Pose',
//           'Downward-Facing Dog Pose',
//           'Half Forward Fold',
//           'Forward Fold',
//           'Upward Salute',
//           'Mountain Pose',
//         ],
//         breath_duration: '5 breaths',
//         description:
//           'A series of postures that warm up the body and prepare it for more intense postures.',
//         duration: '5 minutes',
//         image: 'https://www.pocketyoga.com/assets/images/poses/1.png',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     })
//     return NextResponse.json(data)
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   } finally {
//     await prisma.$disconnect()
//   }
// }
