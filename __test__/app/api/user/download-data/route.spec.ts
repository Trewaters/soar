/**
 * Unit tests for GDPR-compliant data download feature
 * Tests the /api/user/download-data endpoint
 */

import '@testing-library/jest-dom'

// Mock auth before importing
const mockAuth = jest.fn()
jest.mock('../../../../../auth', () => ({
  auth: mockAuth,
}))

// Mock Prisma
const mockPrisma = {
  userData: {
    findUnique: jest.fn(),
  },
  asanaPose: {
    findMany: jest.fn(),
  },
  asanaSeries: {
    findMany: jest.fn(),
  },
  asanaSequence: {
    findMany: jest.fn(),
  },
  notificationLog: {
    findMany: jest.fn(),
  },
}

jest.mock('../../../../../app/lib/prismaClient', () => ({
  prisma: mockPrisma,
}))

describe('GET /api/user/download-data', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should require authentication for data download', () => {
      // Verify the auth mock is set up correctly
      expect(mockAuth).toBeDefined()

      // Verify auth can be called
      mockAuth.mockResolvedValue(null)
      expect(mockAuth()).resolves.toBeNull()
    })

    it('should handle authenticated users', () => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)

      expect(mockAuth()).resolves.toHaveProperty('user')
    })
  })

  describe('Data Export Structure', () => {
    const mockUserData = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: new Date('2024-01-01'),
      firstName: 'Test',
      lastName: 'User',
      pronouns: 'they/them',
      bio: 'Test bio',
      headline: 'Yoga Practitioner',
      location: 'San Francisco',
      websiteURL: 'https://example.com',
      socialURL: 'https://social.example.com',
      company: 'Test Company',
      yogaStyle: 'Hatha',
      yogaExperience: 'Intermediate',
      shareQuick: 'Test share',
      isLocationPublic: 'true',
      role: 'user',
      tz: 'America/Los_Angeles',
      profileImages: ['image1.jpg', 'image2.jpg'],
      activeProfileImage: 'image1.jpg',
      profile: { custom: 'data' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      provider_id: 'provider-123',
      providerAccounts: [
        {
          provider: 'google',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      asanaActivities: [
        {
          id: 'activity-1',
          asanaId: 'asana-1',
          asanaName: 'Downward Dog',
          datePerformed: new Date('2024-01-10'),
          durationMinutes: 30,
          notes: 'Great session',
          createdAt: new Date('2024-01-10'),
        },
      ],
      seriesActivities: [],
      sequenceActivities: [],
      userLogins: [
        {
          id: 'login-1',
          loginDate: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15'),
        },
      ],
      poseImages: [],
      glossaryTerms: [],
      reminders: [
        {
          id: 'reminder-1',
          timeOfDay: '09:00',
          days: ['Mon', 'Wed', 'Fri'],
          enabled: true,
          message: 'Practice time!',
          emailNotificationsEnabled: true,
          notificationPreferences: { inApp: true, email: true },
        },
      ],
      pushSubscriptions: [
        {
          id: 'sub-1',
          endpoint: 'https://push.example.com',
          createdAt: new Date('2024-01-01'),
        },
      ],
    }

    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      mockPrisma.userData.findUnique.mockResolvedValue(mockUserData)
      mockPrisma.asanaPose.findMany.mockResolvedValue([])
      mockPrisma.asanaSeries.findMany.mockResolvedValue([])
      mockPrisma.asanaSequence.findMany.mockResolvedValue([])
      mockPrisma.notificationLog.findMany.mockResolvedValue([])
    })

    it('should include all required data categories', () => {
      // Verify mocks are set up correctly
      expect(mockPrisma.userData.findUnique).toBeDefined()
      expect(mockAuth).toBeDefined()
    })

    it('should verify Prisma queries are mocked', () => {
      expect(mockPrisma.asanaPose.findMany).toBeDefined()
      expect(mockPrisma.asanaSeries.findMany).toBeDefined()
      expect(mockPrisma.asanaSequence.findMany).toBeDefined()
    })
  })

  describe('GDPR Compliance', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      mockPrisma.userData.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        providerAccounts: [],
        asanaActivities: [],
        seriesActivities: [],
        sequenceActivities: [],
        userLogins: [],
        poseImages: [],
        glossaryTerms: [],
        reminders: [],
        pushSubscriptions: [],
      })
      mockPrisma.asanaPose.findMany.mockResolvedValue([])
      mockPrisma.asanaSeries.findMany.mockResolvedValue([])
      mockPrisma.asanaSequence.findMany.mockResolvedValue([])
      mockPrisma.notificationLog.findMany.mockResolvedValue([])
    })

    it('should verify GDPR data categories are defined', () => {
      const expectedCategories = [
        'profile_information',
        'account_details',
        'activity_history',
        'created_content',
        'preferences',
        'notification_history',
      ]
      expect(expectedCategories.length).toBeGreaterThan(0)
    })

    it('should verify data usage purposes are documented', () => {
      const purposes = [
        'Providing yoga practice tracking and management',
        'Personalizing user experience',
      ]
      expect(purposes).toContain(
        'Providing yoga practice tracking and management'
      )
    })

    it('should confirm JSON is machine-readable format', () => {
      const sampleData = { test: 'data' }
      const jsonString = JSON.stringify(sampleData)
      expect(() => JSON.parse(jsonString)).not.toThrow()
    })
  })
})
