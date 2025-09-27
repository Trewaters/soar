import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/generated/client'
import { sendWebPush } from '../../../../lib/webPush'
import { sendReminderEmail } from '../../../../lib/email'
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz'

export const runtime = 'nodejs' // needs node for web-push

const prisma = new PrismaClient()
const WINDOW_SECONDS = 1800 // 30 minutes

export async function GET() {
  // (optional) protect with a secret header so only your cron can call this
  const now = new Date()

  // batch: fetch users with enabled reminders
  const reminders = await prisma.reminder.findMany({
    where: { enabled: true },
    include: { user: true },
  })

  const weekday = (d: Date, tz: string) => {
    const local = toZonedTime(d, tz)
    return format(local, 'EEE') // "Mon"
  }

  const timeMatches = (d: Date, tz: string, targetHHmm: string) => {
    const [h, m] = targetHHmm.split(':').map(Number)
    const local = toZonedTime(d, tz)
    const localTarget = new Date(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      h,
      m,
      0,
      0
    )
    const targetUtc = fromZonedTime(localTarget, tz).getTime()
    const diff = Math.abs(now.getTime() - targetUtc)
    return diff <= WINDOW_SECONDS * 1000
  }

  const results: any[] = []
  for (const r of reminders) {
    const tz = r.user.tz || 'America/Los_Angeles'
    if (!r.days.includes(weekday(now, tz))) continue
    if (!timeMatches(now, tz, r.timeOfDay)) continue

    // avoid double-send if lastSent in same window
    if (
      r.lastSent &&
      now.getTime() - r.lastSent.getTime() < WINDOW_SECONDS * 1000
    )
      continue

    const subs = await prisma.pushSubscription.findMany({
      where: { userId: r.userId },
    })
    let pushed = false
    for (const s of subs) {
      const res = await sendWebPush(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        {
          title: 'Practice now',
          body: r.message,
          url: '/navigator/flows/practiceSeries',
        }
      )
      if (!res.ok && res.code === 410) {
        await prisma.pushSubscription.delete({
          where: { endpoint: s.endpoint },
        })
      } else if (res.ok) {
        pushed = true
      }
    }

    if (r.user.email && r.emailNotificationsEnabled) {
      await sendReminderEmail(
        r.user.email,
        'Practice now 🧘',
        `<p>${r.message}</p><p><a href="https://www.uvuyoga.app/navigator/flows/practiceSeries">Start Practice</a></p>`
      )
    }

    await prisma.reminder.update({
      where: { id: r.id },
      data: { lastSent: now },
    })
    results.push({ reminderId: r.id, pushed })
  }

  return NextResponse.json({ ok: true, sent: results.length })
}
