/**
 * Push Notification Payload Generators
 * Creates notification payloads for Web Push API
 */

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: {
    url?: string
    type?: string
    [key: string]: any
  }
}

/**
 * Generate push notification payload for daily practice reminder
 */
export function getDailyPracticeReminderPayload(
  customMessage?: string
): PushNotificationPayload {
  return {
    title: '🧘 Practice Time',
    body: customMessage || "Your mat is calling. Let's flow! 🌟",
    icon: '/icons/yoga-icon-192.png',
    badge: '/icons/badge-icon-72.png',
    data: {
      url: '/planner',
      type: 'daily_practice',
    },
  }
}

/**
 * Generate push notification payload for new feature announcement
 */
export function getNewFeatureAnnouncementPayload(
  featureTitle: string,
  featureDescription: string,
  featureUrl?: string
): PushNotificationPayload {
  return {
    title: `🆕 New Feature: ${featureTitle}`,
    body: featureDescription,
    icon: '/icons/yoga-icon-192.png',
    badge: '/icons/badge-icon-72.png',
    data: {
      url: featureUrl || '/',
      type: 'new_feature',
      featureTitle,
    },
  }
}

/**
 * Generate push notification payload for progress milestone
 */
export function getProgressMilestonePayload(
  milestoneType: 'sessions' | 'streak' | 'goal' | 'first_time',
  milestoneValue: number | string
): PushNotificationPayload {
  const messages = {
    sessions: {
      title: '🎊 Milestone Achievement!',
      body: `Congratulations! You've completed ${milestoneValue} yoga sessions! 🌈`,
    },
    streak: {
      title: '🔥 Streak Milestone!',
      body: `Amazing! ${milestoneValue} days of consistent practice! Keep it up! 🎉`,
    },
    goal: {
      title: '🎯 Goal Achieved!',
      body: "You've reached your monthly practice goal! Incredible work! 🌟",
    },
    first_time: {
      title: '🌟 First Achievement!',
      body: `You've completed your first ${milestoneValue}! Every journey begins here. 🙏`,
    },
  }

  const message = messages[milestoneType] || {
    title: '🎉 New Milestone!',
    body: "You've reached a new milestone in your yoga journey!",
  }

  return {
    title: message.title,
    body: message.body,
    icon: '/icons/yoga-icon-192.png',
    badge: '/icons/badge-icon-72.png',
    data: {
      url: '/dashboard',
      type: 'progress_milestone',
      milestoneType,
      milestoneValue: String(milestoneValue),
    },
  }
}

/**
 * Generate push notification payload for login streak reminder
 */
export function getLoginStreakReminderPayload(
  streakCount: number,
  reminderType: 'warning' | 'celebration' | 'reengagement'
): PushNotificationPayload {
  const messages = {
    warning: {
      title: '⚠️ Streak at Risk!',
      body: `Your ${streakCount}-day login streak is at risk. Log in now! 🔥`,
    },
    celebration: {
      title: `🔥 ${streakCount} Day Streak!`,
      body: `Amazing! You've logged in for ${streakCount} days straight! 🎉`,
    },
    reengagement: {
      title: '💜 We Miss You!',
      body: "Let's restart your journey together. Your mat is waiting! 🧘",
    },
  }

  const message = messages[reminderType]

  return {
    title: message.title,
    body: message.body,
    icon: '/icons/yoga-icon-192.png',
    badge: '/icons/badge-icon-72.png',
    data: {
      url: reminderType === 'warning' ? '/' : '/dashboard',
      type: 'login_streak',
      streakCount: String(streakCount),
      reminderType,
    },
  }
}

/**
 * Generate push notification payload for activity streak reminder
 */
export function getActivityStreakReminderPayload(
  streakCount: number,
  reminderType: 'warning' | 'celebration'
): PushNotificationPayload {
  const messages = {
    warning: {
      title: '⚠️ Practice Streak at Risk!',
      body: `Your ${streakCount}-day practice streak needs attention. Quick 10-minute session? 🧘`,
    },
    celebration: {
      title: `🔥 ${streakCount} Days of Practice!`,
      body: `Incredible! ${streakCount} days of consistent yoga practice! 🌟`,
    },
  }

  const message = messages[reminderType]

  return {
    title: message.title,
    body: message.body,
    icon: '/icons/yoga-icon-192.png',
    badge: '/icons/badge-icon-72.png',
    data: {
      url: reminderType === 'warning' ? '/planner' : '/dashboard',
      type: 'activity_streak',
      streakCount: String(streakCount),
      reminderType,
    },
  }
}
