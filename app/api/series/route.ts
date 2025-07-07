import { PrismaClient } from '../../../prisma/generated/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const data = await prisma.asanaSeries.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first to help verify new creations
      },
    })
    const dataWithId = data.map((item, index) => ({
      ...item,
      id: index + 1,
    }))
    return NextResponse.json(dataWithId, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
