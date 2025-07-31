import { NextRequest, NextResponse } from 'next/server'

import { auth } from '../../../auth'
import prisma from '../../prisma/generated/client'

// Max 2MB file size
const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export async function POST(req: NextRequest) {
  const session = await auth(req)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  // Fetch user
  const user = await prisma.userData.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const profileImages = user.profileImages || []
  if (profileImages.length >= 3) {
    return NextResponse.json(
      { error: 'Maximum 3 profile images allowed' },
      { status: 400 }
    )
  }

  // TODO: Save file to storage (Cloudflare, local, etc.) and get URL
  // For now, mock URL
  const url = `/mock/profile/${Date.now()}-${file.name}`

  // Update user profileImages
  const updated = await prisma.userData.update({
    where: { email: session.user.email },
    data: { profileImages: [...profileImages, url] },
  })

  return NextResponse.json({ success: true, images: updated.profileImages })
}
