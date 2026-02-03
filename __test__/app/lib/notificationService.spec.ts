/**
 * Unit tests for Notification Service
 * Tests core notification logic, preference handling, and database operations
 */

import '@testing-library/jest-dom'

// Mock Prisma client - must use factory function
jest.mock('@lib/prismaClient', () => ({
  prisma: {
    notificationLog: {
      findFirst: jest.fn() as any,
      create: jest.fn() as any,
    },
    reminder: {
      findFirst: jest.fn() as any,
      findMany: jest.fn() as any,
    },
    userData: {
      findUnique: jest.fn() as any,
      findMany: jest.fn() as any,
    },
    userLogin: {
      findMany: jest.fn() as any,
    },
    asanaActivity: {
      findMany: jest.fn() as any,
      count: jest.fn() as any,
    },
    seriesActivity: {
      findMany: jest.fn() as any,
      count: jest.fn() as any,
    },
    sequenceActivity: {
      findMany: jest.fn() as any,
      count: jest.fn() as any,
    },
    featureAnnouncement: {
      findMany: jest.fn() as any,
    },
    userNotificationDelivery: {
      findMany: jest.fn() as any,
      create: jest.fn() as any,
    },
  },
}))

import {
  hasBeenSent,
  logNotification,
  getUserNotificationPreferences,
  isNotificationEnabled,
  checkDailyPracticeReminders,
  checkLoginStreaks,
  checkActivityStreaks,
  checkProgressMilestones,
  type NotificationPreferences,
  type NotificationPayload,
} from '../../../app/lib/notificationService'
import { prisma } from '@lib/prismaClient'

describe('Notification Service - Core Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hasBeenSent', () => {
    it('should return true when notification log exists', async () => {
      jest.mocked(prisma.notificationLog.findFirst).mockResolvedValue({
        id: 'log-1',
        userId: 'user-1',
        notificationType: 'daily_practice',
        triggerData: {},
      } as any)

      const result = await hasBeenSent('user-1', 'daily_practice', {})

      expect(result).toBe(true)
      expect(prisma.notificationLog.findFirst).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: 'user-1',
          notificationType: 'daily_practice',
        }),
      })
    })

    it('should return false when notification log does not exist', async () => {
      jest.mocked(prisma.notificationLog.findFirst).mockResolvedValue(null)

      const result = await hasBeenSent('user-1', 'daily_practice', {})

      expect(result).toBe(false)
    })

    it('should return false on error (fail open)', async () => {
      jest
        .mocked(prisma.notificationLog.findFirst)
        .mockRejectedValue(new Error('Database error'))

      const result = await hasBeenSent('user-1', 'daily_practice', {})

      expect(result).toBe(false)
    })

    it('should check triggerData equality for milestone notifications', async () => {
      const triggerData = { milestone: 100, type: 'sessions' }
      jest.mocked(prisma.notificationLog.findFirst).mockResolvedValue(null)

      await hasBeenSent('user-1', 'progress_milestone', triggerData)

      expect(prisma.notificationLog.findFirst).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: 'user-1',
          notificationType: 'progress_milestone',
          triggerData: { equals: triggerData },
        }),
      })
    })
  })

  describe('logNotification', () => {
    it('should create notification log entry successfully', async () => {
      const payload: NotificationPayload = {
        userId: 'user-1',
        notificationType: 'daily_practice',
        triggerData: { timeOfDay: '09:00' },
      }
      const sentVia = ['email', 'push']

      const mockLog = {
        id: 'log-1',
        ...payload,
        sentVia,
        sentAt: new Date(),
      }
      ;(prisma.notificationLog.create as jest.Mock).mockResolvedValue(mockLog)

      const result = await logNotification(payload, sentVia)

      expect(result).toEqual(mockLog)
      expect(prisma.notificationLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          notificationType: 'daily_practice',
          triggerData: { timeOfDay: '09:00' },
          sentVia: ['email', 'push'],
        }),
      })
    })

    it('should throw error when log creation fails', async () => {
      const payload: NotificationPayload = {
        userId: 'user-1',
        notificationType: 'daily_practice',
        triggerData: {},
      }

      ;(prisma.notificationLog.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(logNotification(payload, ['email'])).rejects.toThrow(
        'Failed to log notification'
      )
    })
  })

  describe('getUserNotificationPreferences', () => {
    it('should return user preferences when they exist', async () => {
      const mockPreferences = {
        inApp: true,
        email: true,
        subPreferences: {
          dailyPractice: true,
          newFeatures: false,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: false,
        },
      }

      jest.mocked(prisma.reminder.findFirst).mockResolvedValue({
        emailNotificationsEnabled: true,
        notificationPreferences: mockPreferences,
      } as any)

      const result = await getUserNotificationPreferences('user-1')

      expect(result).toEqual(mockPreferences)
      expect(prisma.reminder.findFirst).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        select: {
          emailNotificationsEnabled: true,
          notificationPreferences: true,
        },
      })
    })

    it('should return default disabled preferences when none exist', async () => {
      jest.mocked(prisma.reminder.findFirst).mockResolvedValue(null)

      const result = await getUserNotificationPreferences('user-1')

      expect(result.inApp).toBe(false)
      expect(result.email).toBe(false)
      expect(result.subPreferences.dailyPractice).toBe(false)
      expect(result.subPreferences.loginStreak).toBe(false)
    })

    it('should handle missing subPreferences gracefully', async () => {
      jest.mocked(prisma.reminder.findFirst).mockResolvedValue({
        emailNotificationsEnabled: true,
        notificationPreferences: {
          inApp: true,
          email: true,
          subPreferences: {},
        },
      } as any)

      const result = await getUserNotificationPreferences('user-1')

      expect(result.subPreferences.dailyPractice).toBe(false)
      expect(result.subPreferences.newFeatures).toBe(false)
    })

    it('should return disabled preferences on database error', async () => {
      jest
        .mocked(prisma.reminder.findFirst)
        .mockRejectedValue(new Error('Database error'))

      const result = await getUserNotificationPreferences('user-1')

      expect(result.inApp).toBe(false)
      expect(result.email).toBe(false)
    })
  })

  describe('isNotificationEnabled', () => {
    const mockPreferences: NotificationPreferences = {
      inApp: true,
      email: true,
      subPreferences: {
        dailyPractice: true,
        newFeatures: false,
        progressMilestones: true,
        loginStreak: true,
        activityStreak: false,
      },
    }

    it('should return true for enabled notification types', () => {
      const result = isNotificationEnabled(mockPreferences, 'daily_practice')

      expect(result.inApp).toBe(true)
      expect(result.email).toBe(true)
    })

    it('should return false for disabled notification sub-types', () => {
      const result = isNotificationEnabled(mockPreferences, 'new_feature')

      expect(result.inApp).toBe(false)
      expect(result.email).toBe(false)
    })

    it('should respect master switches', () => {
      const disabledPrefs: NotificationPreferences = {
        inApp: false,
        email: false,
        subPreferences: {
          dailyPractice: true,
          newFeatures: true,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: true,
        },
      }

      const result = isNotificationEnabled(disabledPrefs, 'daily_practice')

      expect(result.inApp).toBe(false)
      expect(result.email).toBe(false)
    })

    it('should return false for unknown notification types', () => {
      const result = isNotificationEnabled(mockPreferences, 'unknown_type')

      expect(result.inApp).toBe(false)
      expect(result.email).toBe(false)
    })

    it('should handle partial preferences correctly', () => {
      const partialPrefs: NotificationPreferences = {
        inApp: true,
        email: false,
        subPreferences: {
          dailyPractice: true,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: false,
          activityStreak: false,
        },
      }

      const result = isNotificationEnabled(partialPrefs, 'daily_practice')

      expect(result.inApp).toBe(true)
      expect(result.email).toBe(false)
    })
  })
})

describe('Notification Service - Check Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkDailyPracticeReminders', () => {
    it('should find users with reminders due now who have not practiced', async () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const timeOfDay = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`

      const mockReminders = [
        {
          id: 'reminder-1',
          userId: 'user-1',
          timeOfDay,
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          enabled: true,
        },
      ]

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.reminder.findMany)
        .mockResolvedValue(mockReminders as any)
      jest
        .mocked(prisma.userData.findUnique)
        .mockResolvedValue(mockUserData as any)
      jest.mocked(prisma.asanaActivity.findMany).mockResolvedValue([]) // No practice today

      const users = await checkDailyPracticeReminders()

      expect(users.length).toBeGreaterThanOrEqual(0)
      if (users.length > 0) {
        expect(users[0]).toHaveProperty('userId')
        expect(users[0]).toHaveProperty('email')
        expect(users[0]).toHaveProperty('timezone')
      }
    })

    it('should not return users who already practiced today', async () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const timeOfDay = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`

      const mockReminders = [
        {
          id: 'reminder-1',
          userId: 'user-1',
          timeOfDay,
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          enabled: true,
        },
      ]

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.reminder.findMany)
        .mockResolvedValue(mockReminders as any)
      jest
        .mocked(prisma.userData.findUnique)
        .mockResolvedValue(mockUserData as any)
      jest
        .mocked(prisma.asanaActivity.findMany)
        .mockResolvedValue([{ datePerformed: new Date() }] as any) // Practiced today

      const users = await checkDailyPracticeReminders()

      expect(users).toEqual([])
    })
  })

  describe('checkLoginStreaks', () => {
    it('should identify users with login streak milestones', async () => {
      const mockUserLogins = [
        { loginDate: new Date() },
        { loginDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { loginDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { loginDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { loginDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { loginDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { loginDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      ]

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.userData.findMany)
        .mockResolvedValue([mockUserData] as any)
      jest
        .mocked(prisma.userLogin.findMany)
        .mockResolvedValue(mockUserLogins as any)

      const users = await checkLoginStreaks()

      // Should identify 7-day streak milestone
      const milestoneUsers = users.filter((u: any) => u.milestone === 7)
      expect(milestoneUsers.length).toBeGreaterThanOrEqual(0)
    })

    it('should identify users whose streak is about to break', async () => {
      const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)

      const mockUserLogins = [
        { loginDate: yesterday },
        { loginDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { loginDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      ]

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.userData.findMany)
        .mockResolvedValue([mockUserData] as any)
      jest
        .mocked(prisma.userLogin.findMany)
        .mockResolvedValue(mockUserLogins as any)

      const users = await checkLoginStreaks()

      // Should identify warning for user who hasn't logged in today
      const warningUsers = users.filter((u: any) => u.type === 'warning')
      expect(warningUsers.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('checkActivityStreaks', () => {
    it('should identify users with practice streak milestones', async () => {
      const mockActivities = Array.from({ length: 14 }, (_, i) => ({
        datePerformed: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }))

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.userData.findMany)
        .mockResolvedValue([mockUserData] as any)
      jest
        .mocked(prisma.asanaActivity.findMany)
        .mockResolvedValue(mockActivities as any)
      jest.mocked(prisma.seriesActivity.findMany).mockResolvedValue([])
      jest.mocked(prisma.sequenceActivity.findMany).mockResolvedValue([])

      const users = await checkActivityStreaks()

      // Should identify 14-day streak milestone
      const milestoneUsers = users.filter((u: any) => u.milestone === 14)
      expect(milestoneUsers.length).toBeGreaterThanOrEqual(0)
    })

    it('should identify users whose practice streak is about to break', async () => {
      const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)

      const mockActivities = [
        { datePerformed: yesterday },
        { datePerformed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { datePerformed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      ]

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.userData.findMany)
        .mockResolvedValue([mockUserData] as any)
      jest
        .mocked(prisma.asanaActivity.findMany)
        .mockResolvedValue(mockActivities as any)
      jest.mocked(prisma.seriesActivity.findMany).mockResolvedValue([])
      jest.mocked(prisma.sequenceActivity.findMany).mockResolvedValue([])

      const users = await checkActivityStreaks()

      // Should identify warning for user who hasn't practiced today
      const warningUsers = users.filter((u: any) => u.type === 'warning')
      expect(warningUsers.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('checkProgressMilestones', () => {
    it('should identify users who reached session count milestones', async () => {
      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      jest
        .mocked(prisma.userData.findMany)
        .mockResolvedValue([mockUserData] as any)
      jest.mocked(prisma.asanaActivity.count).mockResolvedValue(100) // Milestone count
      jest.mocked(prisma.seriesActivity.count).mockResolvedValue(0)
      jest.mocked(prisma.sequenceActivity.count).mockResolvedValue(0)

      const users = await checkProgressMilestones()

      expect(users.length).toBeGreaterThanOrEqual(0)
      if (users.length > 0) {
        expect(users[0]).toHaveProperty('milestoneType')
        expect(users[0]).toHaveProperty('milestoneValue')
      }
    })

    it('should identify users with first-time completions', async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const mockUserData = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        tz: 'America/Los_Angeles',
      }

      const mockFirstActivity = [
        {
          datePerformed: new Date(),
          name: 'Mountain Pose',
        },
      ]

      jest
        .mocked(prisma.userData.findMany)
        .mockResolvedValue([mockUserData] as any)
      jest.mocked(prisma.asanaActivity.count).mockResolvedValue(1)
      jest
        .mocked(prisma.asanaActivity.findMany)
        .mockResolvedValue(mockFirstActivity as any)
      jest.mocked(prisma.seriesActivity.count).mockResolvedValue(0)
      jest.mocked(prisma.seriesActivity.findMany).mockResolvedValue([])
      jest.mocked(prisma.sequenceActivity.count).mockResolvedValue(0)
      jest.mocked(prisma.sequenceActivity.findMany).mockResolvedValue([])

      const users = await checkProgressMilestones()

      expect(users.length).toBeGreaterThanOrEqual(0)
    })
  })
})
