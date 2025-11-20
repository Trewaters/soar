import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { prisma } from '@lib/prismaClient'

export async function DELETE(req: NextRequest) {
  const session = await auth(req)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { url } = await req.json()
  if (!url) {
    return NextResponse.json(
      { error: 'No image URL provided' },
      { status: 400 }
    )
  }
  const user = await prisma.userData.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const profileImages = user.profileImages || []
  const updatedImages = profileImages.filter((img: string) => img !== url)
  let activeProfileImage = user.activeProfileImage
  if (activeProfileImage === url) {
    activeProfileImage = updatedImages[0] || null
  }
  await prisma.userData.update({
    where: { email: session.user.email },
    data: {
      profileImages: updatedImages,
      activeProfileImage,
    },
  })
  return NextResponse.json({
    success: true,
    images: updatedImages,
    activeProfileImage,
  })
}
