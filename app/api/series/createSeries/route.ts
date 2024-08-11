// Create a Series
import { FlowSeriesData } from '@app/interfaces/flowSeries'
import { PrismaClient } from '@prisma/generated/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body: FlowSeriesData = await request.json()

    const data = await prisma.asanaSeries.create({
      data: {
        id: body.id,
        seriesName: body.seriesName,
        seriesPostures: body.seriesPostures,
        breath_duration: body.breath_duration,
        description: body.description,
        duration: body.duration,
        image: body.image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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
