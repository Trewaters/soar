import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import prisma from '../../../prisma/generated/client'

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
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
    if (!profileImages.includes(url)) {
      return NextResponse.json(
        { error: 'Image not found in user profile' },
        { status: 400 }
      )
    }

    await prisma.userData.update({
      where: { email: session.user.email },
      data: { activeProfileImage: url },
    })

    return NextResponse.json({ success: true, activeProfileImage: url })
  } catch (error) {
    console.error('Error setting active profile image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
