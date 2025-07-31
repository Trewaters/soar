import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import prisma from '../../prisma/generated/client'

export async function GET(req: NextRequest) {
  const session = await auth(req)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.userData.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const images = user.profileImages || []
  const active = user.activeProfileImage || null
  // Placeholder logic: if no images, return placeholder based on provider
  let placeholder = null
  if (images.length === 0) {
    // Example: use a default placeholder for social logins, or a developer-uploaded for credentials
    placeholder = session.user.image || '/images/profile-placeholder.png'
  }
  return NextResponse.json({ images, activeProfileImage: active, placeholder })
}
