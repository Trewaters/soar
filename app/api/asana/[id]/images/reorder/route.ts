import { NextResponse, NextRequest } from 'next/server'
import { auth } from 'auth'
import prisma from '@app/prisma/generated/client'

export async function PUT(req: NextRequest, ctx: any) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const asanaId = ctx?.params?.id
    if (!asanaId) {
      return NextResponse.json(
        { error: 'Asana ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    if (!body || !Array.isArray(body.images)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const images = body.images

    // Basic validation
    if (
      !images.every(
        (img: any) =>
          typeof img.id === 'string' && typeof img.displayOrder === 'number'
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid images array' },
        { status: 400 }
      )
    }

    // Verify ownership
    const asana = await prisma.asanaPosture.findUnique({
      where: { id: asanaId },
      select: { created_by: true },
    })
    if (!asana || asana.created_by !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateTransactions = images.map((image: any) =>
      prisma.poseImage.update({
        where: { id: image.id },
        data: { displayOrder: image.displayOrder },
      })
    )

    await prisma.$transaction(updateTransactions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering images:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
