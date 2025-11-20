// Mock dependencies BEFORE importing the route module
jest.mock('../../../../../auth', () => ({
  __esModule: true,
  auth: jest.fn(),
}))

jest.mock('@lib/prismaClient', () => ({
  prisma: {
    userData: {
      findUnique: jest.fn(),
    },
    providerAccount: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

jest.mock('@app/utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}))

import '@testing-library/jest-dom'
import { NextRequest } from 'next/server'
import { POST } from '@app/api/user/change-password/route'
import { auth } from '../../../../../auth'
import { prisma } from '@lib/prismaClient'
import { hashPassword, comparePassword } from '@app/utils/password'

const mockAuth = auth as jest.Mock
const mockHashPassword = hashPassword as jest.Mock
const mockComparePassword = comparePassword as jest.Mock

describe('POST /api/user/change-password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Authentication', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 if session has no email', async () => {
      mockAuth.mockResolvedValueOnce({ user: {} } as any)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Request Validation', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
    })

    it('should return 400 if currentPassword is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Current password and new password are required')
    })

    it('should return 400 if newPassword is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Current password and new password are required')
    })
  })

  describe('User Validation', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
    })

    it('should return 404 if user is not found', async () => {
      ;(prisma.userData.findUnique as jest.Mock).mockResolvedValueOnce(null)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('User not found')
    })

    it('should return 403 if user does not have credentials provider', async () => {
      prisma.userData.findUnique.mockResolvedValueOnce({
        id: 'user123',
        email: 'test@example.com',
      })
      prisma.providerAccount.findFirst.mockResolvedValueOnce(null)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Password change is only available')
    })

    it('should return 400 if credentials account has no password set', async () => {
      prisma.userData.findUnique.mockResolvedValueOnce({
        id: 'user123',
        email: 'test@example.com',
      })
      prisma.providerAccount.findFirst.mockResolvedValueOnce({
        id: 'account123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: null,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No password set for this account')
    })
  })

  describe('Password Verification', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      prisma.userData.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })
      prisma.providerAccount.findFirst.mockResolvedValue({
        id: 'account123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: 'hashed_old_password',
      })
    })

    it('should return 401 if current password is incorrect', async () => {
      mockComparePassword.mockResolvedValueOnce(false)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'WrongPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Current password is incorrect')
      expect(mockComparePassword).toHaveBeenCalledWith(
        'WrongPass123!',
        'hashed_old_password'
      )
    })
  })

  describe('Password Strength Validation', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      prisma.userData.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })
      prisma.providerAccount.findFirst.mockResolvedValue({
        id: 'account123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: 'hashed_old_password',
      })
      mockComparePassword.mockResolvedValue(true)
    })

    it('should return 400 if new password is too short', async () => {
      mockComparePassword.mockResolvedValueOnce(true) // Current password correct

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'Short1!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password must be at least 8 characters long')
    })

    it('should return 400 if new password has no uppercase letter', async () => {
      mockComparePassword.mockResolvedValueOnce(true)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'newpass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        'Password must contain at least one uppercase letter'
      )
    })

    it('should return 400 if new password has no lowercase letter', async () => {
      mockComparePassword.mockResolvedValueOnce(true)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NEWPASS123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        'Password must contain at least one lowercase letter'
      )
    })

    it('should return 400 if new password has no number', async () => {
      mockComparePassword.mockResolvedValueOnce(true)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPassword!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password must contain at least one number')
    })

    it('should return 400 if new password has no special character', async () => {
      mockComparePassword.mockResolvedValueOnce(true)

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        'Password must contain at least one special character'
      )
    })

    it('should return 400 if new password is same as current password', async () => {
      mockComparePassword
        .mockResolvedValueOnce(true) // Current password correct
        .mockResolvedValueOnce(true) // New password same as old

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'SamePass123!',
            newPassword: 'SamePass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe(
        'New password must be different from current password'
      )
    })
  })

  describe('Successful Password Change', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
      prisma.userData.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })
      prisma.providerAccount.findFirst.mockResolvedValue({
        id: 'account123',
        userId: 'user123',
        provider: 'credentials',
        credentials_password: 'hashed_old_password',
      })
      mockComparePassword
        .mockResolvedValueOnce(true) // Current password correct
        .mockResolvedValueOnce(false) // New password different
      mockHashPassword.mockResolvedValue('hashed_new_password')
      prisma.providerAccount.update.mockResolvedValue({})
    })

    it('should successfully change password with valid data', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass456!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Password changed successfully')
      expect(mockHashPassword).toHaveBeenCalledWith('NewPass456!')
      expect(prisma.providerAccount.update).toHaveBeenCalledWith({
        where: { id: 'account123' },
        data: {
          credentials_password: 'hashed_new_password',
          updatedAt: expect.any(Date),
        },
      })
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({
        user: { email: 'test@example.com' },
      } as any)
    })

    it('should return 500 if database query fails', async () => {
      prisma.userData.findUnique.mockRejectedValueOnce(
        new Error('Database error')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to change password. Please try again.')
    })

    it('should disconnect Prisma client after request', async () => {
      prisma.userData.findUnique.mockResolvedValueOnce({
        id: 'user123',
        email: 'test@example.com',
      })

      const request = new NextRequest(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: 'OldPass123!',
            newPassword: 'NewPass123!',
          }),
        }
      )

      await POST(request)

      expect(prisma.$disconnect).toHaveBeenCalled()
    })
  })
})
