/**
 * Unit tests for DELETE /api/user/delete-account
 * Tests GDPR-compliant account deletion with cascading data removal
 */

import '@testing-library/jest-dom'
import { DELETE } from '../../../../../app/api/user/delete-account/route'

// Mock NextAuth
jest.mock('../../../../../auth', () => ({
  auth: jest.fn(),
}))

// Mock Prisma client
jest.mock('@lib/prismaClient', () => ({
  prisma: {
    userData: {
      findUnique: jest.fn() as any,
      delete: jest.fn() as any,
    },
    notificationLog: {
      deleteMany: jest.fn() as any,
    },
    userNotificationDelivery: {
      deleteMany: jest.fn() as any,
    },
    pushSubscription: {
      deleteMany: jest.fn() as any,
    },
    reminder: {
      deleteMany: jest.fn() as any,
    },
    asanaActivity: {
      deleteMany: jest.fn() as any,
    },
    seriesActivity: {
      deleteMany: jest.fn() as any,
    },
    sequenceActivity: {
      deleteMany: jest.fn() as any,
    },
    userLogin: {
      deleteMany: jest.fn() as any,
    },
    poseImage: {
      deleteMany: jest.fn() as any,
    },
    glossaryTerm: {
      deleteMany: jest.fn() as any,
    },
    asanaPose: {
      deleteMany: jest.fn() as any,
    },
    asanaSeries: {
      deleteMany: jest.fn() as any,
    },
    asanaSequence: {
      deleteMany: jest.fn() as any,
    },
    providerAccount: {
      deleteMany: jest.fn() as any,
    },
    $transaction: jest.fn() as any,
  },
}))

import { auth } from '../../../../../auth'
import { prisma } from '@lib/prismaClient'

describe('DELETE /api/user/delete-account', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>
  const mockTransaction = prisma.$transaction as jest.MockedFunction<any>
  const mockFindUnique = prisma.userData.findUnique as jest.MockedFunction<any>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Happy Path - Successful Account Deletion', () => {
    it('should delete user account and all associated data when authenticated', async () => {
      // Arrange
      const mockSession = {
        user: {
          email: 'test@example.com',
          id: 'user-123',
        },
      }

      const mockUserData = {
        id: 'user-data-123',
        email: 'test@example.com',
      }

      mockAuth.mockResolvedValue(mockSession as any)
      mockFindUnique.mockResolvedValue(mockUserData)

      // Mock transaction to execute callback
      mockTransaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          notificationLog: { deleteMany: jest.fn() },
          userNotificationDelivery: { deleteMany: jest.fn() },
          pushSubscription: { deleteMany: jest.fn() },
          reminder: { deleteMany: jest.fn() },
          asanaActivity: { deleteMany: jest.fn() },
          seriesActivity: { deleteMany: jest.fn() },
          sequenceActivity: { deleteMany: jest.fn() },
          userLogin: { deleteMany: jest.fn() },
          poseImage: { deleteMany: jest.fn() },
          glossaryTerm: { deleteMany: jest.fn() },
          asanaPose: { deleteMany: jest.fn() },
          asanaSeries: { deleteMany: jest.fn() },
          asanaSequence: { deleteMany: jest.fn() },
          providerAccount: { deleteMany: jest.fn() },
          userData: { delete: jest.fn() },
        }
        await callback(mockTx)
      })

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Account successfully deleted')
      expect(responseData.deleted_email).toBe('test@example.com')
      expect(responseData.deleted_at).toBeDefined()
      expect(responseData.gdpr_compliance).toEqual({
        article_17: 'Right to Erasure',
        data_removed: [
          'User profile and account details',
          'Activity history',
          'Created content',
          'Preferences and settings',
          'Notification history',
          'Connected accounts',
          'Sessions',
        ],
      })

      // Verify authentication was checked
      expect(mockAuth).toHaveBeenCalledTimes(1)

      // Verify user lookup
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true, email: true },
      })

      // Verify transaction was called
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should delete all related data in correct order within transaction', async () => {
      // Arrange
      const mockSession = {
        user: { email: 'test@example.com' },
      }

      const mockUserData = {
        id: 'user-data-123',
        email: 'test@example.com',
      }

      mockAuth.mockResolvedValue(mockSession as any)
      mockFindUnique.mockResolvedValue(mockUserData)

      const deletionOrder: string[] = []

      mockTransaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          notificationLog: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('notificationLog')
              return Promise.resolve()
            }),
          },
          userNotificationDelivery: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('userNotificationDelivery')
              return Promise.resolve()
            }),
          },
          pushSubscription: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('pushSubscription')
              return Promise.resolve()
            }),
          },
          reminder: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('reminder')
              return Promise.resolve()
            }),
          },
          asanaActivity: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('asanaActivity')
              return Promise.resolve()
            }),
          },
          seriesActivity: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('seriesActivity')
              return Promise.resolve()
            }),
          },
          sequenceActivity: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('sequenceActivity')
              return Promise.resolve()
            }),
          },
          userLogin: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('userLogin')
              return Promise.resolve()
            }),
          },
          poseImage: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('poseImage')
              return Promise.resolve()
            }),
          },
          glossaryTerm: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('glossaryTerm')
              return Promise.resolve()
            }),
          },
          asanaPose: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('asanaPose')
              return Promise.resolve()
            }),
          },
          asanaSeries: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('asanaSeries')
              return Promise.resolve()
            }),
          },
          asanaSequence: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('asanaSequence')
              return Promise.resolve()
            }),
          },
          providerAccount: {
            deleteMany: jest.fn(() => {
              deletionOrder.push('providerAccount')
              return Promise.resolve()
            }),
          },
          userData: {
            delete: jest.fn(() => {
              deletionOrder.push('userData')
              return Promise.resolve()
            }),
          },
        }
        await callback(mockTx)
      })

      // Act
      await DELETE()

      // Assert - verify deletion order
      expect(deletionOrder).toEqual([
        'notificationLog',
        'userNotificationDelivery',
        'pushSubscription',
        'reminder',
        'asanaActivity',
        'seriesActivity',
        'sequenceActivity',
        'userLogin',
        'poseImage',
        'glossaryTerm',
        'asanaPose',
        'asanaSeries',
        'asanaSequence',
        'providerAccount',
        'userData', // User data deleted last
      ])
    })
  })

  describe('Error Cases', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockAuth.mockResolvedValue(null)

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(responseData.error).toBe('Unauthorized - Please sign in')
      expect(mockFindUnique).not.toHaveBeenCalled()
      expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('should return 401 when session has no email', async () => {
      // Arrange
      mockAuth.mockResolvedValue({ user: {} } as any)

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(responseData.error).toBe('Unauthorized - Please sign in')
      expect(mockFindUnique).not.toHaveBeenCalled()
      expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('should return 404 when user data is not found', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { email: 'nonexistent@example.com' },
      } as any)
      mockFindUnique.mockResolvedValue(null)

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(responseData.error).toBe('User data not found')
      expect(mockTransaction).not.toHaveBeenCalled()
    })

    it('should return 500 when database transaction fails', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      mockFindUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      })
      mockTransaction.mockRejectedValue(new Error('Database error'))

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.error).toBe(
        'Failed to delete account. Please try again later.'
      )
      expect(responseData.details).toBe('Database error')
    })

    it('should return 500 when user lookup fails', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      mockFindUnique.mockRejectedValue(new Error('Database connection error'))

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.error).toBe(
        'Failed to delete account. Please try again later.'
      )
      expect(responseData.details).toBe('Database connection error')
      expect(mockTransaction).not.toHaveBeenCalled()
    })
  })

  describe('GDPR Compliance', () => {
    it('should include GDPR compliance information in response', async () => {
      // Arrange
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      mockFindUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
      })
      mockTransaction.mockImplementation(async (callback: any) => {
        await callback({
          notificationLog: { deleteMany: jest.fn() },
          userNotificationDelivery: { deleteMany: jest.fn() },
          pushSubscription: { deleteMany: jest.fn() },
          reminder: { deleteMany: jest.fn() },
          asanaActivity: { deleteMany: jest.fn() },
          seriesActivity: { deleteMany: jest.fn() },
          sequenceActivity: { deleteMany: jest.fn() },
          userLogin: { deleteMany: jest.fn() },
          poseImage: { deleteMany: jest.fn() },
          glossaryTerm: { deleteMany: jest.fn() },
          asanaPose: { deleteMany: jest.fn() },
          asanaSeries: { deleteMany: jest.fn() },
          asanaSequence: { deleteMany: jest.fn() },
          providerAccount: { deleteMany: jest.fn() },
          userData: { delete: jest.fn() },
        })
      })

      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(responseData.gdpr_compliance).toEqual({
        article_17: 'Right to Erasure',
        data_removed: [
          'User profile and account details',
          'Activity history',
          'Created content',
          'Preferences and settings',
          'Notification history',
          'Connected accounts',
          'Sessions',
        ],
      })
      expect(responseData.deleted_at).toBeDefined()
      expect(new Date(responseData.deleted_at)).toBeInstanceOf(Date)
    })

    it('should delete user-created yoga content', async () => {
      // Arrange
      const userEmail = 'creator@example.com'
      mockAuth.mockResolvedValue({ user: { email: userEmail } } as any)
      mockFindUnique.mockResolvedValue({
        id: 'user-123',
        email: userEmail,
      })

      const mockDeleteMany = jest.fn()
      mockTransaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          notificationLog: { deleteMany: jest.fn() },
          userNotificationDelivery: { deleteMany: jest.fn() },
          pushSubscription: { deleteMany: jest.fn() },
          reminder: { deleteMany: jest.fn() },
          asanaActivity: { deleteMany: jest.fn() },
          seriesActivity: { deleteMany: jest.fn() },
          sequenceActivity: { deleteMany: jest.fn() },
          userLogin: { deleteMany: jest.fn() },
          poseImage: { deleteMany: jest.fn() },
          glossaryTerm: { deleteMany: jest.fn() },
          asanaPose: { deleteMany: mockDeleteMany },
          asanaSeries: { deleteMany: jest.fn() },
          asanaSequence: { deleteMany: jest.fn() },
          providerAccount: { deleteMany: jest.fn() },
          userData: { delete: jest.fn() },
        }
        await callback(mockTx)
      })

      // Act
      await DELETE()

      // Assert - verify user-created poses are deleted
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { created_by: userEmail },
      })
    })
  })
})
