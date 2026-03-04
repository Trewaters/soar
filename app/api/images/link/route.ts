import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '../../../../app/lib/prismaClient'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { imageId, poseId, poseName } = await request.json()

    // Validate inputs
    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId is required' },
        { status: 400 }
      )
    }

    if (!poseId && !poseName) {
      return NextResponse.json(
        { error: 'Either poseId or poseName is required' },
        { status: 400 }
      )
    }

    // Check if the image exists and belongs to the current user
    const existingImage = await prisma.poseImage.findFirst({
      where: {
        id: imageId,
        userId: session.user.id,
      },
    })

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found or access denied' },
        { status: 404 }
      )
    }

    // Update the image with pose information
    const updateData: any = {}
    if (poseId) {
      updateData.poseId = poseId
    }
    if (poseName) {
      updateData.poseName = poseName
    }

    const updatedImage = await prisma.poseImage.update({
      where: {
        id: imageId,
      },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      image: updatedImage,
    })
  } catch (error) {
    console.error('Link image error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
