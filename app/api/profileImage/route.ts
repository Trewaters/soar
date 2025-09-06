import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import prisma from '../../prisma/generated/client'
import { storageManager } from '../../../lib/storage/manager'

// Max 2MB file size
const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  console.log('Profile image upload endpoint called')

  try {
    const session = await auth()
    console.log('Session:', session ? 'Found' : 'Not found')

    if (!session || !session.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Getting form data...')
    const formData = await req.formData()
    console.log('Form data entries:', Array.from(formData.keys()))

    const file = formData.get('file') as File | null
    if (!file) {
      console.log('No file found in form data')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large:', file.size)
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Fetch user
    const user = await prisma.userData.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      console.log('User not found:', session.user.email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profileImages = user.profileImages || []
    if (profileImages.length >= 3) {
      console.log('Max profile images reached:', profileImages.length)
      return NextResponse.json(
        { error: 'Maximum 3 profile images allowed' },
        { status: 400 }
      )
    }

    console.log('Uploading file to storage...')
    // Upload file using storage manager
    const uploadResult = await storageManager.upload(
      `profile-${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    )

    console.log('Storage upload successful:', {
      provider: storageManager.getActiveProvider().name,
      url: uploadResult.url,
      size: uploadResult.size,
      fileName: uploadResult.fileName,
    })

    const url = uploadResult.url
    const updatedImages = [...profileImages, url]

    // Set the new image as active if no active image is currently set,
    // or if this is the first image uploaded
    const shouldSetAsActive =
      !user.activeProfileImage || profileImages.length === 0

    console.log('Updating user profile images in database...')
    // Update user profileImages and potentially activeProfileImage
    const updated = await prisma.userData.update({
      where: { email: session.user.email },
      data: {
        profileImages: updatedImages,
        ...(shouldSetAsActive && { activeProfileImage: url }),
      },
    })

    console.log('Database update successful:', {
      totalImages: updated.profileImages.length,
      activeImage: updated.activeProfileImage,
    })

    return NextResponse.json({
      success: true,
      images: updated.profileImages,
      activeProfileImage: updated.activeProfileImage,
    })
  } catch (error) {
    console.error('Profile image upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
