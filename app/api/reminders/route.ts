import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../app/lib/prismaClient'
import { auth } from '../../../auth'

// Use shared prisma client

export async function GET() {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    // Get user data including timezone
    const userData = await prisma.userData.findUnique({
      where: { id: session.user.id },
      select: { tz: true },
    })

    // Get existing reminder for this user
    const reminder = await prisma.reminder.findFirst({
      where: { userId: session.user.id },
    })

    if (!reminder) {
      // Return default values if no reminder exists
      return NextResponse.json({
        timeOfDay: '08:00',
        timezone: userData?.tz || 'America/Los_Angeles',
        days: ['Mon', 'Wed', 'Fri'],
        message: 'Time for your yoga practice! 🧘‍♀️',
        enabled: false,
        emailNotificationsEnabled: true,
      })
    }

    // Return existing reminder data
    return NextResponse.json({
      timeOfDay: reminder.timeOfDay,
      timezone: userData?.tz || 'America/Los_Angeles',
      days: reminder.days,
      message: reminder.message,
      enabled: reminder.enabled,
      emailNotificationsEnabled: reminder.emailNotificationsEnabled ?? true,
    })
  } catch (error) {
    console.error('Error fetching reminder settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminder settings' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { timeOfDay, days, message, enabled, tz, emailNotificationsEnabled } =
    await req.json()

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
        emailNotificationsEnabled: emailNotificationsEnabled ?? true,
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
        emailNotificationsEnabled: emailNotificationsEnabled ?? true,
      },
    })
  }

  return NextResponse.json({ ok: true })
}
