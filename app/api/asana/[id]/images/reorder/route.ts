import { NextResponse, NextRequest } from 'next/server'
import { auth } from 'auth'
import prisma from '@app/prisma/generated/client'

// Next.js dynamic route handlers receive a second argument with params; params must be awaited
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // `params` is provided as a Promise by Next.js dynamic route handlers; await it
    const resolvedParams = await params
    const asanaId = resolvedParams?.id
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

    // Verify ownership: `created_by` stores the creator's email in this project
    const asana = await prisma.asanaPosture.findUnique({
      where: { id: asanaId },
      select: { created_by: true },
    })
    const creatorEmail = asana?.created_by
    if (!asana || creatorEmail !== session.user?.email) {
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
