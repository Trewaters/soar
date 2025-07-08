import { PrismaClient } from '../../../prisma/generated/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Fetching sequences from database...')
    const data = await prisma.asanaSequence.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first to help verify new creations
      },
    })
    console.log(`Found ${data.length} sequences in database`)

    const dataWithId = data.map((item) => ({
      ...item,
      // Preserve the actual database ID instead of regenerating based on array position
      sequencesSeries: Array.isArray(item.sequencesSeries)
        ? item.sequencesSeries
        : [],
    }))

    return NextResponse.json(dataWithId, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error: unknown) {
    console.error('Error fetching sequences:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      )
    }
  } finally {
    await prisma.$disconnect()
  }
}
