/**
 * Notification Service
 * Core notification system for Soar yoga application
 * Handles detection, sending, and logging of all notification types
 */

import { prisma } from './prismaClient'
import {
  calculateCurrentActivityStreakFromDateKeys,
  getUniqueActivityDateKeys,
} from './activityStreakCalculator'
import {
  extractActivityDatesFromSources,
  fetchUserActivitySourceRecords,
} from './activityStreakServer'

// Type definitions
export interface NotificationPreferences {
  inApp: boolean
  email: boolean
  subPreferences: {
    dailyPractice: boolean
    newFeatures: boolean
    progressMilestones: boolean
    loginStreak: boolean
    activityStreak: boolean
  }
}

export interface NotificationPayload {
  userId: string
  notificationType:
    | 'daily_practice'
    | 'new_feature'
    | 'progress_milestone'
    | 'login_streak'
    | 'activity_streak'
  triggerData: Record<string, any>
  emailData?: {
    subject: string
    html: string
    text: string
  }
  pushData?: {
    title: string
    body: string
    icon?: string
    badge?: string
    data?: Record<string, any>
  }
}

export interface UserToNotify {
  userId: string
  email: string
  name: string
  timezone: string
}

/**
 * Check if a specific notification has already been sent
 * @param userId - User ID
 * @param notificationType - Type of notification
 * @param triggerData - Data that triggered the notification
 * @returns True if notification was already sent
 */
export async function hasBeenSent(
  userId: string,
  notificationType: string,
  triggerData: Record<string, any>
): Promise<boolean> {
  try {
    const existingLog = await prisma.notificationLog.findFirst({
      where: {
        userId,
        notificationType,
        // For milestone notifications, check if the specific milestone was already celebrated
        ...(notificationType === 'progress_milestone' && {
          triggerData: {
            equals: triggerData,
          },
        }),
      },
    })

    return existingLog !== null
  } catch (error) {
    console.error('Error checking if notification was sent:', error)
    return false // Fail open - allow notification if check fails
  }
}

/**
 * Log a sent notification to the database
 * @param payload - Notification payload with user and trigger information
 * @param sentVia - Array of delivery methods used
 * @returns Created log entry or null on failure
 */
export async function logNotification(
  payload: NotificationPayload,
  sentVia: string[]
): Promise<any> {
  try {
    const log = await prisma.notificationLog.create({
      data: {
        userId: payload.userId,
        notificationType: payload.notificationType,
        triggerData: payload.triggerData,
        sentVia,
        sentAt: new Date(),
      },
    })

    return log
  } catch (error) {
    console.error('Error logging notification:', error)
    throw new Error('Failed to log notification')
  }
}

/**
 * Get user's notification preferences from database
 * @param userId - User ID
 * @returns Notification preferences object
 */
export async function getUserNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  try {
    const reminder = await prisma.reminder.findFirst({
      where: { userId },
      select: {
        emailNotificationsEnabled: true,
        notificationPreferences: true,
      },
    })

    if (!reminder || !reminder.notificationPreferences) {
      // Return default preferences (all disabled)
      return {
        inApp: false,
        email: false,
        subPreferences: {
          dailyPractice: false,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: false,
          activityStreak: false,
        },
      }
    }

    const prefs = reminder.notificationPreferences as any

    return {
      inApp: prefs.inApp ?? false,
      email: prefs.email ?? false,
      subPreferences: {
        dailyPractice: prefs.subPreferences?.dailyPractice ?? false,
        newFeatures: prefs.subPreferences?.newFeatures ?? false,
        progressMilestones: prefs.subPreferences?.progressMilestones ?? false,
        loginStreak: prefs.subPreferences?.loginStreak ?? false,
        activityStreak: prefs.subPreferences?.activityStreak ?? false,
      },
    }
  } catch (error) {
    console.error('Error getting notification preferences:', error)
    // Return disabled preferences on error
    return {
      inApp: false,
      email: false,
      subPreferences: {
        dailyPractice: false,
        newFeatures: false,
        progressMilestones: false,
        loginStreak: false,
        activityStreak: false,
      },
    }
  }
}

/**
 * Check if a specific notification type is enabled for a user
 * @param preferences - User's notification preferences
 * @param notificationType - Type of notification to check
 * @returns Object with inApp and email boolean flags
 */
export function isNotificationEnabled(
  preferences: NotificationPreferences,
  notificationType: string
): { inApp: boolean; email: boolean } {
  // Map notification types to preference keys
  const typeMap: Record<
    string,
    keyof NotificationPreferences['subPreferences']
  > = {
    daily_practice: 'dailyPractice',
    new_feature: 'newFeatures',
    progress_milestone: 'progressMilestones',
    login_streak: 'loginStreak',
    activity_streak: 'activityStreak',
  }

  const prefKey = typeMap[notificationType]
  if (!prefKey) {
    return { inApp: false, email: false }
  }

  const isSubEnabled = preferences.subPreferences[prefKey]

  return {
    inApp: preferences.inApp && isSubEnabled,
    email: preferences.email && isSubEnabled,
  }
}

/**
 * Send notification via configured channels
 * @param payload - Notification payload
 * @param preferences - User notification preferences
 * @returns Status object with success/failure details
 */
export async function sendNotification(
  payload: NotificationPayload,
  preferences: NotificationPreferences
): Promise<{ success: boolean; sentVia: string[]; errors: string[] }> {
  const sentVia: string[] = []
  const errors: string[] = []

  const enabled = isNotificationEnabled(preferences, payload.notificationType)

  // Check if notification has already been sent
  const alreadySent = await hasBeenSent(
    payload.userId,
    payload.notificationType,
    payload.triggerData
  )

  if (alreadySent) {
    return { success: false, sentVia: [], errors: ['Already sent'] }
  }

  // Send email if enabled
  if (enabled.email && payload.emailData) {
    try {
      // TODO: Implement email sending
      // await sendEmail(...)
      sentVia.push('email')
    } catch (error) {
      errors.push(`Email failed: ${error}`)
      console.error('Email notification failed:', error)
    }
  }

  // Send push notification if enabled
  if (enabled.inApp && payload.pushData) {
    try {
      // TODO: Implement push notification sending
      // await sendPushNotification(...)
      sentVia.push('push')
    } catch (error) {
      errors.push(`Push failed: ${error}`)
      console.error('Push notification failed:', error)
    }
  }

  // Log the notification if any method succeeded
  if (sentVia.length > 0) {
    try {
      await logNotification(payload, sentVia)
    } catch (error) {
      errors.push(`Logging failed: ${error}`)
      console.error('Failed to log notification:', error)
    }
  }

  return {
    success: sentVia.length > 0,
    sentVia,
    errors,
  }
}

/**
 * Check which users need daily practice reminders
 * @returns Array of users who should receive reminders
 */
export async function checkDailyPracticeReminders(): Promise<UserToNotify[]> {
  try {
    const now = new Date()
    const currentDay = now.toLocaleString('en-US', { weekday: 'short' })
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Find users with reminders enabled for today
    const reminders = await prisma.reminder.findMany({
      where: {
        enabled: true,
        days: {
          has: currentDay,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            tz: true,
          },
        },
      },
    })

    const usersToNotify: UserToNotify[] = []

    for (const reminder of reminders) {
      // Check if reminder time matches (within 5-minute window)
      const [reminderHour, reminderMinute] = reminder.timeOfDay
        .split(':')
        .map(Number)
      const timeDiffMinutes = Math.abs(
        currentHour * 60 + currentMinute - (reminderHour * 60 + reminderMinute)
      )

      if (timeDiffMinutes <= 5) {
        // Check if already practiced today
        const todayStart = new Date(now.setHours(0, 0, 0, 0))
        const practiceToday = await prisma.asanaActivity.findFirst({
          where: {
            userId: reminder.userId,
            datePerformed: {
              gte: todayStart,
            },
          },
        })

        if (!practiceToday) {
          usersToNotify.push({
            userId: reminder.user.id,
            email: reminder.user.email || '',
            name: reminder.user.name || '',
            timezone: reminder.user.tz,
          })
        }
      }
    }

    return usersToNotify
  } catch (error) {
    console.error('Error checking daily practice reminders:', error)
    return []
  }
}

/**
 * Check which users need login streak reminders
 * @returns Array of users with streak warnings or celebrations
 */
export async function checkLoginStreaks(): Promise<
  Array<
    UserToNotify & {
      streakCount: number
      type: 'warning' | 'celebration' | 'reengagement'
    }
  >
> {
  try {
    const usersToNotify: Array<
      UserToNotify & {
        streakCount: number
        type: 'warning' | 'celebration' | 'reengagement'
      }
    > = []

    // Get all users
    const users = await prisma.userData.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        tz: true,
      },
    })

    const today = new Date()
    const todayTime = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    ).getTime()
    const yesterdayTime = todayTime - 24 * 60 * 60 * 1000

    for (const user of users) {
      // Get login events
      const loginEvents = await prisma.userLogin.findMany({
        where: { userId: user.id },
        orderBy: { loginDate: 'desc' },
        select: { loginDate: true },
      })

      if (loginEvents.length === 0) continue

      // Get unique dates
      const uniqueDates = Array.from(
        new Set(
          loginEvents.map((login: { loginDate: Date }) => {
            const date = new Date(login.loginDate)
            return new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate()
            ).getTime()
          })
        )
      ) as number[]

      uniqueDates.sort((a, b) => b - a)

      const isActiveToday = uniqueDates[0] === todayTime

      // Calculate current streak
      let currentStreak = 0
      let expectedDate = isActiveToday ? todayTime : yesterdayTime

      for (const loginDate of uniqueDates) {
        if (loginDate === expectedDate) {
          currentStreak++
          expectedDate -= 24 * 60 * 60 * 1000
        } else if (loginDate < expectedDate) {
          break
        }
      }

      // Streak about to break warning (had streak yesterday, but not today)
      if (!isActiveToday && currentStreak >= 3) {
        usersToNotify.push({
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
          timezone: user.tz,
          streakCount: currentStreak,
          type: 'warning',
        })
      }

      // Milestone celebrations (7, 30, 60, 90, 180, 365 days)
      const milestones = [7, 30, 60, 90, 180, 365]
      if (isActiveToday && milestones.includes(currentStreak)) {
        usersToNotify.push({
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
          timezone: user.tz,
          streakCount: currentStreak,
          type: 'celebration',
        })
      }

      // Re-engagement for users who haven't logged in for 7+ days
      const daysSinceLastLogin = Math.floor(
        (todayTime - uniqueDates[0]) / (24 * 60 * 60 * 1000)
      )
      if (daysSinceLastLogin >= 7 && currentStreak === 0) {
        usersToNotify.push({
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
          timezone: user.tz,
          streakCount: 0,
          type: 'reengagement',
        })
      }
    }

    return usersToNotify
  } catch (error) {
    console.error('Error checking login streaks:', error)
    return []
  }
}

/**
 * Check which users need activity streak reminders
 * @returns Array of users with practice streak warnings or celebrations
 */
export async function checkActivityStreaks(): Promise<
  Array<UserToNotify & { streakCount: number; type: 'warning' | 'celebration' }>
> {
  try {
    const usersToNotify: Array<
      UserToNotify & { streakCount: number; type: 'warning' | 'celebration' }
    > = []

    // Get all users
    const users = await prisma.userData.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        tz: true,
      },
    })

    for (const user of users) {
      const activitySources = await fetchUserActivitySourceRecords(user.id)
      const allActivities = extractActivityDatesFromSources(activitySources)

      if (allActivities.length === 0) continue

      const sortedDays = getUniqueActivityDateKeys(allActivities)
      const streakStatus =
        calculateCurrentActivityStreakFromDateKeys(sortedDays)
      const currentStreak = streakStatus.currentStreak

      // Streak about to break warning (practiced yesterday, but not today)
      if (streakStatus.isAtRisk && currentStreak >= 3) {
        usersToNotify.push({
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
          timezone: user.tz,
          streakCount: currentStreak,
          type: 'warning',
        })
      }

      // Milestone celebrations (7, 14, 30, 60, 90, 180, 365 days)
      const milestones = [7, 14, 30, 60, 90, 180, 365]
      if (streakStatus.isActiveToday && milestones.includes(currentStreak)) {
        usersToNotify.push({
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
          timezone: user.tz,
          streakCount: currentStreak,
          type: 'celebration',
        })
      }
    }

    return usersToNotify
  } catch (error) {
    console.error('Error checking activity streaks:', error)
    return []
  }
}

/**
 * Check which users reached progress milestones
 * @returns Array of users with milestone achievements
 */
export async function checkProgressMilestones(): Promise<
  Array<
    UserToNotify & {
      milestoneType: 'sessions' | 'streak' | 'goal' | 'first_time'
      milestoneValue: number | string
    }
  >
> {
  try {
    const usersToNotify: Array<
      UserToNotify & {
        milestoneType: 'sessions' | 'streak' | 'goal' | 'first_time'
        milestoneValue: number | string
      }
    > = []

    // Get all users
    const users = await prisma.userData.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        tz: true,
      },
    })

    const sessionMilestones = [10, 25, 50, 100, 250, 500, 1000]

    for (const user of users) {
      // Get total session counts
      const [asanaCount, seriesCount, sequenceCount] = await Promise.all([
        prisma.asanaActivity.count({ where: { userId: user.id } }),
        prisma.seriesActivity.count({ where: { userId: user.id } }),
        prisma.sequenceActivity.count({ where: { userId: user.id } }),
      ])

      const totalSessions = asanaCount + seriesCount + sequenceCount

      // Check for session milestone (check if just reached today)
      for (const milestone of sessionMilestones) {
        if (totalSessions === milestone) {
          usersToNotify.push({
            userId: user.id,
            email: user.email || '',
            name: user.name || '',
            timezone: user.tz,
            milestoneType: 'sessions',
            milestoneValue: milestone,
          })
          break // Only notify for one milestone at a time
        }
      }

      // Check for first asana completion
      if (asanaCount === 1) {
        const firstAsana = await prisma.asanaActivity.findFirst({
          where: { userId: user.id },
          orderBy: { datePerformed: 'asc' },
          select: { asanaName: true, datePerformed: true },
        })

        if (firstAsana) {
          // Check if it happened today
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const asanaDate = new Date(firstAsana.datePerformed)
          asanaDate.setHours(0, 0, 0, 0)

          if (asanaDate.getTime() === today.getTime()) {
            usersToNotify.push({
              userId: user.id,
              email: user.email || '',
              name: user.name || '',
              timezone: user.tz,
              milestoneType: 'first_time',
              milestoneValue: `First ${firstAsana.asanaName || 'asana'} completed`,
            })
          }
        }
      }

      // Check for first series completion
      if (seriesCount === 1) {
        const firstSeries = await prisma.seriesActivity.findFirst({
          where: { userId: user.id },
          orderBy: { datePerformed: 'asc' },
          select: { seriesName: true, datePerformed: true },
        })

        if (firstSeries) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const seriesDate = new Date(firstSeries.datePerformed)
          seriesDate.setHours(0, 0, 0, 0)

          if (seriesDate.getTime() === today.getTime()) {
            usersToNotify.push({
              userId: user.id,
              email: user.email || '',
              name: user.name || '',
              timezone: user.tz,
              milestoneType: 'first_time',
              milestoneValue: `First ${firstSeries.seriesName || 'flow'} completed`,
            })
          }
        }
      }

      // Check for first sequence completion
      if (sequenceCount === 1) {
        const firstSequence = await prisma.sequenceActivity.findFirst({
          where: { userId: user.id },
          orderBy: { datePerformed: 'asc' },
          select: { sequenceName: true, datePerformed: true },
        })

        if (firstSequence) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const sequenceDate = new Date(firstSequence.datePerformed)
          sequenceDate.setHours(0, 0, 0, 0)

          if (sequenceDate.getTime() === today.getTime()) {
            usersToNotify.push({
              userId: user.id,
              email: user.email || '',
              name: user.name || '',
              timezone: user.tz,
              milestoneType: 'first_time',
              milestoneValue: `First ${firstSequence.sequenceName || 'sequence'} completed`,
            })
          }
        }
      }
    }

    return usersToNotify
  } catch (error) {
    console.error('Error checking progress milestones:', error)
    return []
  }
}

/**
 * Check for new feature announcements that need to be delivered
 * @returns Array of announcement-user pairs to deliver
 */
export async function checkNewFeatureAnnouncements(): Promise<
  Array<{
    announcementId: string
    title: string
    description: string
    content: string
    users: UserToNotify[]
  }>
> {
  try {
    const announcements: Array<{
      announcementId: string
      title: string
      description: string
      content: string
      users: UserToNotify[]
    }> = []

    // Get published announcements from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activeAnnouncements = await prisma.featureAnnouncement.findMany({
      where: {
        active: true,
        releaseDate: {
          gte: sevenDaysAgo,
        },
      },
    })

    for (const announcement of activeAnnouncements) {
      // Get all users who haven't been notified yet
      const deliveredToUsers = await prisma.userNotificationDelivery.findMany({
        where: {
          announcementId: announcement.id,
        },
        select: {
          userId: true,
        },
      })

      const deliveredUserIds = new Set(
        deliveredToUsers.map((d: { userId: string }) => d.userId)
      )

      // Get all users except those already notified
      const users = await prisma.userData.findMany({
        where: {
          id: {
            notIn: Array.from(deliveredUserIds),
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          tz: true,
        },
      })

      if (users.length > 0) {
        announcements.push({
          announcementId: announcement.id,
          title: announcement.title,
          description: announcement.description,
          content: announcement.content,
          users: users.map(
            (user: {
              id: string
              email: string | null
              name: string | null
              tz: string
            }) => ({
              userId: user.id,
              email: user.email || '',
              name: user.name || '',
              timezone: user.tz,
            })
          ),
        })
      }
    }

    return announcements
  } catch (error) {
    console.error('Error checking feature announcements:', error)
    return []
  }
}

/**
 * Send a daily practice reminder to a user
 * @param user - User to notify
 * @param customMessage - Custom reminder message
 * @returns Success status
 */
export async function sendDailyPracticeReminder(
  user: UserToNotify,
  customMessage?: string
): Promise<boolean> {
  try {
    const preferences = await getUserNotificationPreferences(user.userId)

    const payload: NotificationPayload = {
      userId: user.userId,
      notificationType: 'daily_practice',
      triggerData: {
        scheduledTime: new Date().toISOString(),
        timezone: user.timezone,
      },
      // TODO: Generate email and push data using template functions
      emailData: {
        subject: '🧘 Time for your yoga practice!',
        html: "<p>Your mat is calling. Let's flow! 🌟</p>",
        text: "Time for your yoga practice! Your mat is calling. Let's flow! 🌟",
      },
      pushData: {
        title: '🧘 Practice Time',
        body: customMessage || "Your mat is calling. Let's flow! 🌟",
        icon: '/icons/yoga-icon.png',
        data: {
          url: '/planner',
        },
      },
    }

    const result = await sendNotification(payload, preferences)
    return result.success
  } catch (error) {
    console.error('Error sending daily practice reminder:', error)
    return false
  }
}

/**
 * Send a login streak reminder to a user
 * @param user - User to notify
 * @param streakCount - Current streak count
 * @param type - Type of streak notification
 * @returns Success status
 */
export async function sendLoginStreakReminder(
  user: UserToNotify,
  streakCount: number,
  type: 'warning' | 'celebration' | 'reengagement'
): Promise<boolean> {
  try {
    const preferences = await getUserNotificationPreferences(user.userId)

    const payload: NotificationPayload = {
      userId: user.userId,
      notificationType: 'login_streak',
      triggerData: {
        streakCount,
        type,
        checkedAt: new Date().toISOString(),
      },
      // TODO: Generate email and push data using template functions
      emailData: {
        subject:
          type === 'celebration'
            ? `🎉 ${streakCount}-day login streak!`
            : type === 'warning'
              ? `⚠️ Don't break your ${streakCount}-day streak!`
              : 'We miss you! Come back to Soar',
        html:
          type === 'celebration'
            ? `<p>Congratulations on ${streakCount} consecutive days! 🎉</p>`
            : type === 'warning'
              ? `<p>You've logged in ${streakCount} days in a row. Don't lose it now! 💪</p>`
              : '<p>Your yoga community is waiting for you. Come back! 🧘</p>',
        text:
          type === 'celebration'
            ? `Congratulations on ${streakCount} consecutive days!`
            : type === 'warning'
              ? `You've logged in ${streakCount} days in a row. Don't lose it now!`
              : 'Your yoga community is waiting for you. Come back!',
      },
      pushData: {
        title:
          type === 'celebration'
            ? `🎉 ${streakCount}-day Streak!`
            : type === 'warning'
              ? `⚠️ Streak Warning`
              : 'We Miss You!',
        body:
          type === 'celebration'
            ? `Amazing! ${streakCount} days in a row!`
            : type === 'warning'
              ? `Don't break your ${streakCount}-day streak!`
              : 'Come back and continue your yoga journey',
        icon: '/icons/streak-icon.png',
        data: {
          url: '/dashboard',
          streakCount: streakCount.toString(),
        },
      },
    }

    const result = await sendNotification(payload, preferences)
    return result.success
  } catch (error) {
    console.error('Error sending login streak reminder:', error)
    return false
  }
}

/**
 * Send an activity streak reminder to a user
 * @param user - User to notify
 * @param streakCount - Current streak count
 * @param type - Type of streak notification
 * @returns Success status
 */
export async function sendActivityStreakReminder(
  user: UserToNotify,
  streakCount: number,
  type: 'warning' | 'celebration'
): Promise<boolean> {
  try {
    const preferences = await getUserNotificationPreferences(user.userId)

    const payload: NotificationPayload = {
      userId: user.userId,
      notificationType: 'activity_streak',
      triggerData: {
        streakCount,
        type,
        checkedAt: new Date().toISOString(),
      },
      // TODO: Generate email and push data using template functions
      emailData: {
        subject:
          type === 'celebration'
            ? `🎉 ${streakCount}-day practice streak!`
            : `⚠️ Don't break your ${streakCount}-day practice streak!`,
        html:
          type === 'celebration'
            ? `<p>Incredible dedication! ${streakCount} consecutive days of practice! 🧘✨</p>`
            : `<p>You've practiced ${streakCount} days in a row. Keep it going! 💪</p>`,
        text:
          type === 'celebration'
            ? `Incredible dedication! ${streakCount} consecutive days of practice!`
            : `You've practiced ${streakCount} days in a row. Keep it going!`,
      },
      pushData: {
        title:
          type === 'celebration'
            ? `🎉 ${streakCount}-day Practice Streak!`
            : `⚠️ Practice Streak Warning`,
        body:
          type === 'celebration'
            ? `${streakCount} days of yoga excellence!`
            : `Don't break your ${streakCount}-day practice streak!`,
        icon: '/icons/practice-icon.png',
        data: {
          url: '/planner',
          streakCount: streakCount.toString(),
        },
      },
    }

    const result = await sendNotification(payload, preferences)
    return result.success
  } catch (error) {
    console.error('Error sending activity streak reminder:', error)
    return false
  }
}

/**
 * Send a progress milestone notification to a user
 * @param user - User to notify
 * @param milestoneType - Type of milestone
 * @param milestoneValue - Value of the milestone
 * @returns Success status
 */
export async function sendProgressMilestone(
  user: UserToNotify,
  milestoneType: 'sessions' | 'streak' | 'goal' | 'first_time',
  milestoneValue: number | string
): Promise<boolean> {
  try {
    const preferences = await getUserNotificationPreferences(user.userId)

    const payload: NotificationPayload = {
      userId: user.userId,
      notificationType: 'progress_milestone',
      triggerData: {
        milestoneType,
        milestoneValue,
        achievedAt: new Date().toISOString(),
      },
      // TODO: Generate email and push data using template functions
      emailData: {
        subject: `🎉 Milestone achieved: ${milestoneValue}!`,
        html: `<p>Congratulations! You've reached a major milestone: ${milestoneValue}! 🎉✨</p>`,
        text: `Congratulations! You've reached a major milestone: ${milestoneValue}!`,
      },
      pushData: {
        title: '🎉 Milestone Unlocked!',
        body: `Amazing! ${milestoneValue}`,
        icon: '/icons/milestone-icon.png',
        data: {
          url: '/dashboard',
          milestoneType,
          milestoneValue: milestoneValue.toString(),
        },
      },
    }

    const result = await sendNotification(payload, preferences)
    return result.success
  } catch (error) {
    console.error('Error sending progress milestone:', error)
    return false
  }
}

/**
 * Send a feature announcement to a user
 * @param user - User to notify
 * @param announcement - Announcement details
 * @returns Success status
 */
export async function sendFeatureAnnouncement(
  user: UserToNotify,
  announcement: {
    id: string
    title: string
    description: string
    content: string
  }
): Promise<boolean> {
  try {
    const preferences = await getUserNotificationPreferences(user.userId)

    const payload: NotificationPayload = {
      userId: user.userId,
      notificationType: 'new_feature',
      triggerData: {
        announcementId: announcement.id,
        sentAt: new Date().toISOString(),
      },
      // TODO: Generate email and push data using template functions
      emailData: {
        subject: `🎉 New Feature: ${announcement.title}`,
        html: `<h2>${announcement.title}</h2><p>${announcement.description}</p><div>${announcement.content}</div>`,
        text: `${announcement.title}\n\n${announcement.description}\n\n${announcement.content}`,
      },
      pushData: {
        title: `🎉 ${announcement.title}`,
        body: announcement.description,
        icon: '/icons/feature-icon.png',
        data: {
          url: '/dashboard',
          announcementId: announcement.id,
        },
      },
    }

    const result = await sendNotification(payload, preferences)

    // Mark announcement as delivered to this user
    if (result.success) {
      try {
        await prisma.userNotificationDelivery.create({
          data: {
            userId: user.userId,
            announcementId: announcement.id,
            deliveredAt: new Date(),
          },
        })
      } catch (error) {
        console.error('Error marking announcement as delivered:', error)
      }
    }

    return result.success
  } catch (error) {
    console.error('Error sending feature announcement:', error)
    return false
  }
}
