import { PrismaClient } from '../../../prisma/generated/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl)
    const createdBy = searchParams.get('createdBy')

    console.log('Fetching series from database...')

    // For now, since AsanaSeries doesn't have a created_by field,
    // we'll return all series when filtering by user
    // TODO: Add created_by field to AsanaSeries schema
    const data = await prisma.asanaSeries.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first to help verify new creations
      },
    })

    // Filter client-side for now (not ideal, but works until schema is updated)
    let filteredData = data
    if (createdBy) {
      console.log(
        `Note: Filtering by creator not yet supported for series. Returning empty array for user: ${createdBy}`
      )
      filteredData = [] // Return empty array for now since we can't filter by creator
    }

    const dataWithId = filteredData.map((item) => ({
      ...item,
      id: item.id, // Use the actual database ID
    }))
    return NextResponse.json(dataWithId, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error: any) {
    console.error('Error fetching series:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
