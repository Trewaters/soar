import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { PrismaClient } from '../../../../../prisma/generated/client'
import { storageManager } from '../../../../../lib/storage/manager'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Fetch all images for a specific series
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

    const seriesId = resolvedParams.id

    const series = await prisma.asanaSeries.findUnique({
      where: { id: seriesId },
      select: { images: true, created_by: true },
    })

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Only allow access to series created by the current user
    if (series.created_by !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ images: series.images || [] })
  } catch (error) {
    console.error('Error fetching series images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Add a new image to a series
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
    const seriesId = resolvedParams.id

    // Check if series exists and user owns it
    const series = await prisma.asanaSeries.findUnique({
      where: { id: seriesId },
      select: { images: true, created_by: true },
    })

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    if (series.created_by !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get the uploaded file from the form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type and size
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

    // Upload to storage
    const uploadResult = await storageManager.upload(
      `series-${seriesId}-${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    )

    // Add the new image URL to the series images array
    const currentImages = series.images || []
    const updatedImages = [...currentImages, uploadResult.url]

    // Update both images array and legacy image field for backward compatibility
    // The image field should always be the first image in the array
    await prisma.asanaSeries.update({
      where: { id: seriesId },
      data: {
        images: updatedImages,
        image: updatedImages[0] || null, // Sync legacy field with first image
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.url,
      images: updatedImages,
    })
  } catch (error) {
    console.error('Error uploading series image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Remove an image from a series
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
    const seriesId = resolvedParams.id
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('imageUrl')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Check if series exists and user owns it
    const series = await prisma.asanaSeries.findUnique({
      where: { id: seriesId },
      select: { images: true, created_by: true },
    })

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    if (series.created_by !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Remove the image URL from the series images array
    const currentImages = series.images || []
    const updatedImages = currentImages.filter(
      (url: string) => url !== imageUrl
    )

    // Update both images array and legacy image field for backward compatibility
    // The image field should always be the first image in the array (or null if empty)
    await prisma.asanaSeries.update({
      where: { id: seriesId },
      data: {
        images: updatedImages,
        image: updatedImages[0] || null, // Sync legacy field with first image
        updatedAt: new Date(),
      },
    })

    // Delete the image from cloud storage
    try {
      await storageManager.delete(imageUrl)
    } catch (storageError) {
      console.warn('Failed to delete image from storage:', storageError)
      // Continue even if storage deletion fails - image is removed from database
    }

    return NextResponse.json({
      message: 'Image deleted successfully',
      images: updatedImages,
    })
  } catch (error) {
    console.error('Error deleting series image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
