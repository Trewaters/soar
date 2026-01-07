import '@testing-library/jest-dom'

import {
  getDailyPracticeReminderPayload,
  getNewFeatureAnnouncementPayload,
  getProgressMilestonePayload,
  getLoginStreakReminderPayload,
  getActivityStreakReminderPayload,
} from '../../../app/lib/pushNotificationPayloads'

describe('Push Notification Payload Generators - Happy Path', () => {
  it('getDailyPracticeReminderPayload returns default payload when no custom message provided', () => {
    const payload = getDailyPracticeReminderPayload()

    expect(payload).toBeDefined()
    expect(payload.title).toBe('🧘 Practice Time')
    expect(payload.body).toContain('Your mat is calling')
    expect(payload.icon).toBe('/icons/yoga-icon-192.png')
    expect(payload.data).toBeDefined()
    expect(payload.data?.url).toBe('/planner')
    expect(payload.data?.type).toBe('daily_practice')
  })

  it('getNewFeatureAnnouncementPayload returns payload populated from inputs', () => {
    const payload = getNewFeatureAnnouncementPayload(
      'Pose Sharing',
      'Share your favorite poses with friends',
      '/features/pose-sharing'
    )

    expect(payload.title).toBe('🆕 New Feature: Pose Sharing')
    expect(payload.body).toBe('Share your favorite poses with friends')
    expect(payload.data?.url).toBe('/features/pose-sharing')
    expect(payload.data?.type).toBe('new_feature')
    expect(payload.data?.featureTitle).toBe('Pose Sharing')
  })

  it('getProgressMilestonePayload returns sessions milestone payload with numeric value', () => {
    const payload = getProgressMilestonePayload('sessions', 100)

    expect(payload.title).toBe('🎊 Milestone Achievement!')
    expect(payload.body).toContain('100')
    expect(payload.data?.type).toBe('progress_milestone')
    expect(payload.data?.milestoneType).toBe('sessions')
    expect(payload.data?.milestoneValue).toBe('100')
  })

  it('getLoginStreakReminderPayload returns celebration payload and dashboard URL for non-warning types', () => {
    const payload = getLoginStreakReminderPayload(7, 'celebration')

    expect(payload.title).toBe('🔥 7 Day Streak!')
    expect(payload.body).toContain('7 days')
    expect(payload.data?.type).toBe('login_streak')
    expect(payload.data?.streakCount).toBe('7')
    expect(payload.data?.reminderType).toBe('celebration')
    expect(payload.data?.url).toBe('/dashboard')
  })

  it('getActivityStreakReminderPayload returns warning payload with planner URL', () => {
    const payload = getActivityStreakReminderPayload(5, 'warning')

    expect(payload.title).toBe('⚠️ Practice Streak at Risk!')
    expect(payload.body).toContain('5-day')
    expect(payload.data?.type).toBe('activity_streak')
    expect(payload.data?.streakCount).toBe('5')
    expect(payload.data?.reminderType).toBe('warning')
    expect(payload.data?.url).toBe('/planner')
  })
})
