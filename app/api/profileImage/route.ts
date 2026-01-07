import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '@lib/prismaClient'
import { storageManager } from '../../../lib/storage/manager'

// Max 2MB file size
const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    const file = formData.get('file') as File | null
    if (!file) {
      console.log('No file found in form data')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large:', file.size)
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Fetch user (if not present, create a minimal user record so uploads can proceed)
    let user = await prisma.userData.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.log(
        'User not found, creating minimal user record for:',
        session.user.email
      )
      try {
        user = await prisma.userData.create({
          data: {
            email: session.user.email,
            name: session.user.email.split('@')[0],
            provider_id: session.user.id ?? undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            firstName: '',
            lastName: '',
            bio: '',
            headline: '',
            location: '',
            websiteURL: '',
            shareQuick: '',
            yogaStyle: '',
            yogaExperience: '',
            company: '',
            socialURL: '',
            isLocationPublic: '',
            role: 'user',
            profileImages: [],
            activeProfileImage: null,
          },
        })
      } catch (createErr) {
        console.error('Failed to create user record during upload:', createErr)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    }

    const profileImages = user.profileImages || []
    if (profileImages.length >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 profile images allowed' },
        { status: 400 }
      )
    }

    // Upload file using storage manager
    const uploadResult = await storageManager.upload(
      `profile-${Date.now()}-${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: true,
      }
    )

    const url = uploadResult.url
    const updatedImages = [...profileImages, url]

    // Set the new image as active if no active image is currently set,
    // or if this is the first image uploaded
    const shouldSetAsActive =
      !user.activeProfileImage || profileImages.length === 0

    // Update user profileImages and potentially activeProfileImage
    const updated = await prisma.userData.update({
      where: { email: session.user.email },
      data: {
        profileImages: updatedImages,
        ...(shouldSetAsActive && { activeProfileImage: url }),
      },
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
