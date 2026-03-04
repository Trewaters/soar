import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { prisma } from '@lib/prismaClient'

export async function GET() {
  const session = await auth()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.userData.findUnique({
    where: { email: session.user.email },
    select: {
      profileImages: true,
      activeProfileImage: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    images: user.profileImages || [],
    activeImage: user.activeProfileImage || null,
  })
}
