import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/generated/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const data = await prisma.asanaPosture.findMany()
    // console.log('data', data)
    const dataWithId = data.map((item, index) => ({
      ...item,
      id: index + 1,
    }))
    return NextResponse.json(dataWithId)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    const dataWithId: PostureData[] = data.map(
      (item: PostureData, index: number) => ({
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
