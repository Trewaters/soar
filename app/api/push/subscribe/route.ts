import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../app/lib/prismaClient'
import { auth } from '../../../../auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { endpoint, keys } = await req.json()
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'bad payload' }, { status: 400 })
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth, userId: session.user.id },
    create: {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ ok: true })
}
