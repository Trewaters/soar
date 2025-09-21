import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../prisma/generated/client'
import { auth } from '../../../auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { timeOfDay, days, message, enabled, tz } = await req.json()

  if (!timeOfDay || !days || !Array.isArray(days)) {
    return NextResponse.json({ error: 'bad payload' }, { status: 400 })
  }

  // Update user timezone if provided
  if (tz) {
    await prisma.userData.update({
      where: { id: session.user.id },
      data: { tz },
    })
  }

  // Find existing reminder for this user
  const existingReminder = await prisma.reminder.findFirst({
    where: { userId: session.user.id },
  })

  if (existingReminder) {
    // Update existing reminder
    await prisma.reminder.update({
      where: { id: existingReminder.id },
      data: {
        timeOfDay,
        days,
        message: message || '🧘 Practice time',
        enabled: enabled ?? true,
      },
    })
  } else {
    // Create new reminder
    await prisma.reminder.create({
      data: {
        userId: session.user.id,
        timeOfDay,
        days,
        message: message || '🧘 Practice time',
        enabled: enabled ?? true,
      },
    })
  }

  return NextResponse.json({ ok: true })
}
