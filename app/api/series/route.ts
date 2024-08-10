import { FlowSeriesData } from '@app/interfaces/flowSeries'
import { PrismaClient } from '@prisma/generated/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const data = await prisma.asanaSeries.findMany()
    // console.log('asanaSeries data', data)
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