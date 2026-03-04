/**
 * Unit tests for Reminders API
 * Tests GET and POST endpoints for reminder settings and notification preferences
 */

import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'

// Mock Prisma client - inline to avoid hoisting issues
jest.mock('../../../app/lib/prismaClient', () => ({
  prisma: {
    userData: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    reminder: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock auth function - inline to avoid hoisting issues
jest.mock('../../../auth', () => ({
  auth: jest.fn(),
}))

// Import after mocks are set up
import { GET, POST } from '../../../app/api/reminders/route'
import { prisma } from '../../../app/lib/prismaClient'
import { auth } from '../../../auth'

describe('Reminders API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/reminders', () => {
    it('should return 401 when user is not authenticated', async () => {
      auth.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should return default values when no reminder exists', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      prisma.userData.findUnique.mockResolvedValue({
        id: 'user-1',
        tz: 'America/Los_Angeles',
      })

      prisma.reminder.findFirst.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        timeOfDay: '08:00',
        timezone: 'America/Los_Angeles',
        days: ['Mon', 'Wed', 'Fri'],
        message: 'Time for your yoga practice! 🧘‍♀️',
        enabled: false,
        emailNotificationsEnabled: true,
      })
    })

    it('should return existing reminder data with notification preferences', async () => {
      const mockPreferences = {
        inApp: true,
        email: true,
        inAppSubPreferences: {
          dailyPractice: true,
          newFeatures: false,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: false,
        },
        emailSubPreferences: {
          dailyPractice: true,
          newFeatures: true,
          progressMilestones: false,
          loginStreak: true,
          activityStreak: true,
        },
      }

      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      prisma.userData.findUnique.mockResolvedValue({
        id: 'user-1',
        tz: 'America/New_York',
      })

      prisma.reminder.findFirst.mockResolvedValue({
        id: 'reminder-1',
        userId: 'user-1',
        timeOfDay: '09:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        message: 'Time for practice!',
        enabled: true,
        emailNotificationsEnabled: true,
        notificationPreferences: mockPreferences,
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.timeOfDay).toBe('09:00')
      expect(data.days).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
      expect(data.enabled).toBe(true)
      expect(data.notificationPreferences).toEqual(mockPreferences)
    })

    it('should handle database errors gracefully', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      prisma.userData.findUnique.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch reminder settings')
    })
  })

  describe('POST /api/reminders', () => {
    it('should return 401 when user is not authenticated', async () => {
      auth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          timeOfDay: '09:00',
          days: ['Mon', 'Wed', 'Fri'],
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should return 400 when payload is invalid', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          timeOfDay: '09:00',
          // Missing days array
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('bad payload')
    })

    it('should create new reminder when none exists', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      const notificationPreferences = {
        inApp: true,
        email: true,
        inAppSubPreferences: {
          dailyPractice: true,
          newFeatures: false,
          progressMilestones: true,
          loginStreak: false,
          activityStreak: false,
        },
        emailSubPreferences: {
          dailyPractice: false,
          newFeatures: true,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: false,
        },
      }

      prisma.reminder.findFirst.mockResolvedValue(null)
      prisma.reminder.create.mockResolvedValue({
        id: 'reminder-1',
        userId: 'user-1',
        timeOfDay: '09:00',
        days: ['Mon', 'Wed', 'Fri'],
        message: 'Practice time!',
        enabled: true,
        emailNotificationsEnabled: true,
        notificationPreferences,
      })

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          timeOfDay: '09:00',
          days: ['Mon', 'Wed', 'Fri'],
          message: 'Practice time!',
          enabled: true,
          emailNotificationsEnabled: true,
          notificationPreferences,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(prisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          timeOfDay: '09:00',
          days: ['Mon', 'Wed', 'Fri'],
          notificationPreferences,
        }),
      })
    })

    it('should update existing reminder', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      const existingReminder = {
        id: 'reminder-1',
        userId: 'user-1',
        timeOfDay: '08:00',
        days: ['Mon', 'Wed', 'Fri'],
        message: 'Old message',
        enabled: false,
      }

      const notificationPreferences = {
        inApp: true,
        email: false,
        inAppSubPreferences: {
          dailyPractice: true,
          newFeatures: true,
          progressMilestones: false,
          loginStreak: true,
          activityStreak: true,
        },
        emailSubPreferences: {
          dailyPractice: false,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: false,
          activityStreak: false,
        },
      }

      prisma.reminder.findFirst.mockResolvedValue(existingReminder)
      prisma.reminder.update.mockResolvedValue({
        ...existingReminder,
        timeOfDay: '09:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        enabled: true,
        notificationPreferences,
      })

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          timeOfDay: '09:00',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          message: 'New message',
          enabled: true,
          notificationPreferences,
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(prisma.reminder.update).toHaveBeenCalledWith({
        where: { id: 'reminder-1' },
        data: expect.objectContaining({
          timeOfDay: '09:00',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          enabled: true,
          notificationPreferences,
        }),
      })
    })

    it('should update user timezone when provided', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      prisma.reminder.findFirst.mockResolvedValue({
        id: 'reminder-1',
        userId: 'user-1',
      })

      prisma.reminder.update.mockResolvedValue({
        id: 'reminder-1',
        userId: 'user-1',
        timeOfDay: '09:00',
        days: ['Mon', 'Wed', 'Fri'],
      })

      prisma.userData.update.mockResolvedValue({
        id: 'user-1',
        tz: 'Europe/London',
      })

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          timeOfDay: '09:00',
          days: ['Mon', 'Wed', 'Fri'],
          tz: 'Europe/London',
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(prisma.userData.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { tz: 'Europe/London' },
      })
    })

    it('should preserve reminder data when only updating notification preferences', async () => {
      auth.mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      })

      const existingReminder = {
        id: 'reminder-1',
        userId: 'user-1',
        timeOfDay: '08:00',
        days: ['Mon', 'Wed', 'Fri'],
        message: 'Existing message',
        enabled: true,
        emailNotificationsEnabled: true,
      }

      const newPreferences = {
        inApp: false,
        email: true,
        inAppSubPreferences: {
          dailyPractice: false,
          newFeatures: false,
          progressMilestones: false,
          loginStreak: false,
          activityStreak: false,
        },
        emailSubPreferences: {
          dailyPractice: true,
          newFeatures: true,
          progressMilestones: true,
          loginStreak: true,
          activityStreak: true,
        },
      }

      prisma.reminder.findFirst.mockResolvedValue(existingReminder)
      prisma.reminder.update.mockResolvedValue({
        ...existingReminder,
        notificationPreferences: newPreferences,
      })

      const request = new NextRequest('http://localhost:3000/api/reminders', {
        method: 'POST',
        body: JSON.stringify({
          timeOfDay: '08:00',
          days: ['Mon', 'Wed', 'Fri'],
          message: 'Existing message',
          enabled: true,
          notificationPreferences: newPreferences,
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(prisma.reminder.update).toHaveBeenCalledWith({
        where: { id: 'reminder-1' },
        data: expect.objectContaining({
          notificationPreferences: newPreferences,
        }),
      })
    })
  })
})
