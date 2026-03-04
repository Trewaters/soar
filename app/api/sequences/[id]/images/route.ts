import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { prisma } from '../../../../../app/lib/prismaClient'
import { storageManager } from '../../../../../lib/storage/manager'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Fetch all images for a specific sequence
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const resolvedParams = await params
    const sequenceId = resolvedParams.id

    const sequence = await prisma.asanaSequence.findUnique({
      where: { id: sequenceId },
      select: { images: true, image: true, created_by: true },
    })

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }

    const userData = await prisma.userData.findFirst({
      where: { email: session.user.email },
      select: { role: true },
    })
    const isAdmin = userData?.role === 'admin'
    const isPublicOrAlpha =
      sequence.created_by === 'PUBLIC' || sequence.created_by === 'alpha users'
    const isOwner = sequence.created_by === session.user.email

    if (!isAdmin && !isOwner && !isPublicOrAlpha) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Combine images array with legacy image field for backward compat
    let images: string[] = (sequence.images as unknown as string[]) || []
    if (sequence.image && !images.includes(sequence.image)) {
      images = [sequence.image, ...images]
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching sequence images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Upload a new image for a sequence
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const sequenceId = resolvedParams.id

    const sequence = await prisma.asanaSequence.findUnique({
      where: { id: sequenceId },
      select: { images: true, image: true, created_by: true },
    })

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }

    const userData = await prisma.userData.findFirst({
      where: { email: session.user.email },
      select: { role: true },
    })
    const isAdmin = userData?.role === 'admin'
    const isOwner = sequence.created_by === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const uploadResult = await storageManager.upload(
      `sequence-${sequenceId}-${Date.now()}-${file.name}`,
      file,
      { access: 'public', addRandomSuffix: true }
    )

    const currentImages: string[] =
      (sequence.images as unknown as string[]) || []
    const updatedImages = [...currentImages, uploadResult.url]

    await prisma.asanaSequence.update({
      where: { id: sequenceId },
      data: {
        images: updatedImages as any,
        image: updatedImages[0] || null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.url,
      images: updatedImages,
    })
  } catch (error) {
    console.error('Error uploading sequence image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove an image from a sequence
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const sequenceId = resolvedParams.id
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('imageUrl')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const sequence = await prisma.asanaSequence.findUnique({
      where: { id: sequenceId },
      select: { images: true, image: true, created_by: true },
    })

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 })
    }

    const userData = await prisma.userData.findFirst({
      where: { email: session.user.email },
      select: { role: true },
    })
    const isAdmin = userData?.role === 'admin'
    const isOwner = sequence.created_by === session.user.email

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const currentImages: string[] =
      (sequence.images as unknown as string[]) || []
    const updatedImages = currentImages.filter(
      (url: string) => url !== imageUrl
    )

    await prisma.asanaSequence.update({
      where: { id: sequenceId },
      data: {
        images: updatedImages as any,
        image: updatedImages[0] || null,
        updatedAt: new Date(),
      },
    })

    try {
      await storageManager.delete(imageUrl)
    } catch (storageError) {
      console.warn('Failed to delete image from storage:', storageError)
    }

    return NextResponse.json({
      message: 'Image deleted successfully',
      images: updatedImages,
    })
  } catch (error) {
    console.error('Error deleting sequence image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
