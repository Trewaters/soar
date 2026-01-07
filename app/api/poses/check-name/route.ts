import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { error: 'Name parameter is required' },
        { status: 400 }
      )
    }

    // Check if an asana with this name already exists
    const existingAsana = await prisma.asanaPose.findFirst({
      where: {
        sort_english_name: name,
      },
      select: {
        id: true,
        sort_english_name: true,
      },
    })

    return NextResponse.json({
      exists: !!existingAsana,
      name,
      existingAsana: existingAsana || null,
    })
  } catch (error) {
    console.error('Check name availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
