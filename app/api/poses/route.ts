import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../prisma/generated/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const sortEnglishName = searchParams.get('sort_english_name')

  if (sortEnglishName) {
    try {
      const pose = await prisma.asanaPosture.findUnique({
        where: { sort_english_name: sortEnglishName },
      })

      if (!pose) {
        return NextResponse.json({ error: 'Pose not found' }, { status: 404 })
      }

      if (pose.breath_direction_default === null) {
        pose.breath_direction_default = ''
      }

      return NextResponse.json(pose)
    } catch (error: any) {
      console.error(
        'Error fetching pose by sort_english_name:',
        sortEnglishName,
        error
      )
      return NextResponse.json(
        { error: 'Internal server error. Please try again later.' },
        { status: 500 }
      )
    } finally {
      await prisma.$disconnect()
    }
  }

  try {
    const data = await prisma.asanaPosture.findMany()
    const dataWithId = data.map((item, index) => ({
      ...item,
      id: index + 1,
      // Ensure breath_direction_default is not null
      breath_direction_default:
        item.breath_direction_default === null
          ? 'neutral'
          : item.breath_direction_default,
    }))
    return NextResponse.json(dataWithId, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error: any) {
    console.error('Error fetching all asana postures:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// route pulls from alternate web source
/* export async function GET() {
  const url = 'https://www.pocketyoga.com/poses.json'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`)
    }
    const data = await response.json()
    const dataWithId: FullAsanaData[] = data.map(
      (item: FullAsanaData, index: number) => ({
        ...item,
        id: index + 1,
      })
    )
    return NextResponse.json(dataWithId)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
 */
