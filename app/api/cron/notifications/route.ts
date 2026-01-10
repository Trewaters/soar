/**
 * Cron Job Endpoint for Notification Checking
 * This endpoint should be called hourly by a cron scheduler (Vercel Cron, GitHub Actions, etc.)
 * It checks all notification types and sends notifications to eligible users
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  checkDailyPracticeReminders,
  checkLoginStreaks,
  checkActivityStreaks,
  checkProgressMilestones,
  checkNewFeatureAnnouncements,
  sendDailyPracticeReminder,
  sendLoginStreakReminder,
  sendActivityStreakReminder,
  sendProgressMilestone,
  sendFeatureAnnouncement,
} from '../../../lib/notificationService'

/**
 * GET handler for the cron job
 * Verifies authorization and processes all notification checks
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('CRON_SECRET not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Check for authorization header or query parameter
    const querySecret = request.nextUrl.searchParams.get('secret')
    const providedSecret = authHeader?.replace('Bearer ', '') || querySecret

    if (providedSecret !== cronSecret) {
      console.warn('Unauthorized cron job attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const startTime = Date.now()

    const results = {
      dailyPractice: { checked: 0, sent: 0, failed: 0 },
      loginStreak: { checked: 0, sent: 0, failed: 0 },
      activityStreak: { checked: 0, sent: 0, failed: 0 },
      progressMilestones: { checked: 0, sent: 0, failed: 0 },
      featureAnnouncements: { checked: 0, sent: 0, failed: 0 },
    }

    // 1. Check Daily Practice Reminders
    try {
      const usersNeedingReminders = await checkDailyPracticeReminders()
      results.dailyPractice.checked = usersNeedingReminders.length

      for (const user of usersNeedingReminders) {
        try {
          const success = await sendDailyPracticeReminder(user)
          if (success) {
            results.dailyPractice.sent++
          } else {
            results.dailyPractice.failed++
          }
        } catch (error) {
          console.error(
            `Failed to send daily practice reminder to ${user.userId}:`,
            error
          )
          results.dailyPractice.failed++
        }
      }
    } catch (error) {
      console.error('Error checking daily practice reminders:', error)
    }

    // 2. Check Login Streaks
    try {
      const loginStreakUsers = await checkLoginStreaks()
      results.loginStreak.checked = loginStreakUsers.length

      for (const user of loginStreakUsers) {
        try {
          const success = await sendLoginStreakReminder(
            user,
            user.streakCount,
            user.type
          )
          if (success) {
            results.loginStreak.sent++
          } else {
            results.loginStreak.failed++
          }
        } catch (error) {
          console.error(
            `Failed to send login streak notification to ${user.userId}:`,
            error
          )
          results.loginStreak.failed++
        }
      }
    } catch (error) {
      console.error('Error checking login streaks:', error)
    }

    // 3. Check Activity Streaks
    try {
      const activityStreakUsers = await checkActivityStreaks()
      results.activityStreak.checked = activityStreakUsers.length

      for (const user of activityStreakUsers) {
        try {
          const success = await sendActivityStreakReminder(
            user,
            user.streakCount,
            user.type
          )
          if (success) {
            results.activityStreak.sent++
          } else {
            results.activityStreak.failed++
          }
        } catch (error) {
          console.error(
            `Failed to send activity streak notification to ${user.userId}:`,
            error
          )
          results.activityStreak.failed++
        }
      }
    } catch (error) {
      console.error('Error checking activity streaks:', error)
    }

    // 4. Check Progress Milestones
    try {
      const milestoneUsers = await checkProgressMilestones()
      results.progressMilestones.checked = milestoneUsers.length

      for (const user of milestoneUsers) {
        try {
          const success = await sendProgressMilestone(
            user,
            user.milestoneType,
            user.milestoneValue
          )
          if (success) {
            results.progressMilestones.sent++
          } else {
            results.progressMilestones.failed++
          }
        } catch (error) {
          console.error(
            `Failed to send milestone notification to ${user.userId}:`,
            error
          )
          results.progressMilestones.failed++
        }
      }
    } catch (error) {
      console.error('Error checking progress milestones:', error)
    }

    // 5. Check Feature Announcements
    try {
      const announcements = await checkNewFeatureAnnouncements()
      let totalUsers = 0
      announcements.forEach((a) => (totalUsers += a.users.length))
      results.featureAnnouncements.checked = totalUsers

      for (const announcement of announcements) {
        for (const user of announcement.users) {
          try {
            const success = await sendFeatureAnnouncement(user, {
              id: announcement.announcementId,
              title: announcement.title,
              description: announcement.description,
              content: announcement.content,
            })
            if (success) {
              results.featureAnnouncements.sent++
            } else {
              results.featureAnnouncements.failed++
            }
          } catch (error) {
            console.error(
              `Failed to send feature announcement to ${user.userId}:`,
              error
            )
            results.featureAnnouncements.failed++
          }
        }
      }
    } catch (error) {
      console.error('Error checking feature announcements:', error)
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      results,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST handler - same as GET for flexibility
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
