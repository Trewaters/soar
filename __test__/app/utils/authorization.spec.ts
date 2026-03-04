import '@testing-library/jest-dom'
import type { Session } from 'next-auth'

// Mock the auth function BEFORE importing the module that uses it
jest.mock('../../../auth', () => ({
  auth: jest.fn(),
}))

import { auth } from '../../../auth'
import {
  requireAuth,
  requireRole,
  isAdmin,
  hasRole,
  canModifyContent,
  hasValidRole,
} from '../../../app/utils/authorization'

const mockAuth = auth as jest.MockedFunction<typeof auth>

describe('Authorization Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('requireAuth', () => {
    it('should return session when user is authenticated', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const session = await requireAuth()

      expect(session).toEqual(mockSession)
      expect(mockAuth).toHaveBeenCalledTimes(1)
    })

    it('should throw error when no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      await expect(requireAuth()).rejects.toThrow(
        'Unauthorized - Please sign in'
      )
    })

    it('should throw error when session has no user', async () => {
      const mockSession = {
        expires: '2025-12-31',
      } as Session

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireAuth()).rejects.toThrow(
        'Unauthorized - Please sign in'
      )
    })

    it('should handle auth function returning undefined', async () => {
      mockAuth.mockResolvedValue(undefined as any)

      await expect(requireAuth()).rejects.toThrow(
        'Unauthorized - Please sign in'
      )
    })

    it('should reject user with null role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: null as any, // Invalid null role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireAuth()).rejects.toThrow(
        'Unauthorized - Invalid or missing role. Please contact support.'
      )
    })

    it('should reject user with undefined role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: undefined as any, // Invalid undefined role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireAuth()).rejects.toThrow(
        'Unauthorized - Invalid or missing role. Please contact support.'
      )
    })

    it('should reject user with invalid role string', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'invalid_role' as any, // Invalid role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireAuth()).rejects.toThrow(
        'Unauthorized - Invalid or missing role. Please contact support.'
      )
    })
  })

  describe('requireRole', () => {
    it('should return session when user has the required role', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const session = await requireRole(['admin'])

      expect(session).toEqual(mockSession)
    })

    it('should allow user when role is in allowed roles array', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const session = await requireRole(['user', 'admin'])

      expect(session).toEqual(mockSession)
    })

    it('should throw error when user does not have required role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireRole(['admin'])).rejects.toThrow(
        'Forbidden - Required role: admin. Your role: user'
      )
    })

    it('should throw error with multiple roles in message', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireRole(['admin'])).rejects.toThrow(
        /Required role: admin/
      )
    })

    it('should throw unauthorized error when no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      await expect(requireRole(['admin'])).rejects.toThrow(
        'Unauthorized - Please sign in'
      )
    })

    it('should handle empty allowed roles array gracefully', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireRole([])).rejects.toThrow(/Forbidden/)
    })

    it('should reject user with null role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: null as any, // Invalid null role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      await expect(requireRole(['user'])).rejects.toThrow(
        'Unauthorized - Invalid or missing role. Please contact support.'
      )
    })

    it('should reject user with invalid role in requireRole', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'superuser' as any, // Invalid role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      // requireAuth() is called first and throws "Unauthorized" for invalid roles
      await expect(requireRole(['user', 'admin'])).rejects.toThrow(
        'Unauthorized - Invalid or missing role. Please contact support.'
      )
    })
  })

  describe('isAdmin', () => {
    it('should return true when user is admin', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await isAdmin()

      expect(result).toBe(true)
    })

    it('should return false when user is not admin', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await isAdmin()

      expect(result).toBe(false)
    })

    it('should return false when no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await isAdmin()

      expect(result).toBe(false)
    })

    it('should return false when session has no user', async () => {
      mockAuth.mockResolvedValue({
        expires: '2025-12-31',
      } as Session)

      const result = await isAdmin()

      expect(result).toBe(false)
    })

    it('should return false when user has no role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await isAdmin()

      expect(result).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('should return true when user has the specified role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await hasRole('user')

      expect(result).toBe(true)
    })

    it('should return false when user does not have the specified role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await hasRole('admin')

      expect(result).toBe(false)
    })

    it('should return false when no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await hasRole('admin')

      expect(result).toBe(false)
    })

    it('should return false when user has no role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await hasRole('user')

      expect(result).toBe(false)
    })

    it('should check for admin role correctly', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await hasRole('admin')

      expect(result).toBe(true)
    })
  })

  describe('canModifyContent', () => {
    it('should return true when user is admin', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('someOtherUserId')

      expect(result).toBe(true)
    })

    it('should return true when user is admin modifying PUBLIC content', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('PUBLIC')

      expect(result).toBe(true)
    })

    it('should return true when user is the content creator (by ID)', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('user123')

      expect(result).toBe(true)
    })

    it('should return true when user is the content creator (by email)', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('user@example.com')

      expect(result).toBe(true)
    })

    it('should return false when user is not the creator and not admin', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('differentUser456')

      expect(result).toBe(false)
    })

    it('should return false when non-admin user tries to modify PUBLIC content', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('PUBLIC')

      expect(result).toBe(false)
    })

    it('should return false when no session exists', async () => {
      mockAuth.mockResolvedValue(null)

      const result = await canModifyContent('user123')

      expect(result).toBe(false)
    })

    it('should return false when session has no user', async () => {
      mockAuth.mockResolvedValue({
        expires: '2025-12-31',
      } as Session)

      const result = await canModifyContent('user123')

      expect(result).toBe(false)
    })

    it('should handle empty contentCreatorId', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('')

      expect(result).toBe(false)
    })

    it('should return false when user has null role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: null as any, // Invalid null role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('user123')

      expect(result).toBe(false)
    })

    it('should return false when user has undefined role', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: undefined as any, // Invalid undefined role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('user123')

      expect(result).toBe(false)
    })

    it('should return false when user has invalid role string', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'invalid_role' as any, // Invalid role
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('user123')

      expect(result).toBe(false)
    })
  })

  describe('hasValidRole', () => {
    it('should return true for session with user role', () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      const result = hasValidRole(mockSession)

      expect(result).toBe(true)
    })

    it('should return true for session with admin role', () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      const result = hasValidRole(mockSession)

      expect(result).toBe(true)
    })

    it('should return false for null session', () => {
      const result = hasValidRole(null)

      expect(result).toBe(false)
    })

    it('should return false for session without user', () => {
      const mockSession = {
        expires: '2025-12-31',
      } as Session

      const result = hasValidRole(mockSession)

      expect(result).toBe(false)
    })

    it('should return false for session without role', () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
        },
        expires: '2025-12-31',
      }

      const result = hasValidRole(mockSession)

      expect(result).toBe(false)
    })

    it('should return false for invalid role value', () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'invalidRole' as any,
        },
        expires: '2025-12-31',
      }

      const result = hasValidRole(mockSession)

      expect(result).toBe(false)
    })

    it('should type guard correctly in TypeScript', () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      if (hasValidRole(mockSession)) {
        // TypeScript should know role exists here
        const role: string = mockSession.user.role
        expect(role).toBe('user')
      }
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete admin workflow', async () => {
      const adminSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(adminSession)

      // Admin checks
      expect(await isAdmin()).toBe(true)
      expect(await hasRole('admin')).toBe(true)
      expect(await hasRole('user')).toBe(false)

      // Admin can modify any content
      expect(await canModifyContent('PUBLIC')).toBe(true)
      expect(await canModifyContent('otherUser123')).toBe(true)
      expect(await canModifyContent('admin123')).toBe(true)

      // Admin has required role
      const session = await requireRole(['admin'])
      expect(session).toEqual(adminSession)
    })

    it('should handle complete regular user workflow', async () => {
      const userSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(userSession)

      // User checks
      expect(await isAdmin()).toBe(false)
      expect(await hasRole('user')).toBe(true)
      expect(await hasRole('admin')).toBe(false)

      // User can only modify their own content
      expect(await canModifyContent('user123')).toBe(true)
      expect(await canModifyContent('user@example.com')).toBe(true)
      expect(await canModifyContent('PUBLIC')).toBe(false)
      expect(await canModifyContent('otherUser456')).toBe(false)

      // User has required role
      const session = await requireRole(['user'])
      expect(session).toEqual(userSession)

      // User doesn't have admin role
      await expect(requireRole(['admin'])).rejects.toThrow(/Forbidden/)
    })

    it('should handle unauthenticated user workflow', async () => {
      mockAuth.mockResolvedValue(null)

      // All checks return false
      expect(await isAdmin()).toBe(false)
      expect(await hasRole('user')).toBe(false)
      expect(await hasRole('admin')).toBe(false)
      expect(await canModifyContent('user123')).toBe(false)

      // Cannot access protected resources
      await expect(requireAuth()).rejects.toThrow(/Unauthorized/)
      await expect(requireRole(['user'])).rejects.toThrow(/Unauthorized/)
    })
  })

  describe('"alpha users" Content Protection', () => {
    it('should prevent regular users from modifying "alpha users" content', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('alpha users')

      expect(result).toBe(false)
    })

    it('should allow admin users to modify "alpha users" content', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      const result = await canModifyContent('alpha users')

      expect(result).toBe(true)
    })

    it('should treat "alpha users" content same as "PUBLIC" content for regular users', async () => {
      const mockSession: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      // Both should be false for regular users
      expect(await canModifyContent('PUBLIC')).toBe(false)
      expect(await canModifyContent('alpha users')).toBe(false)
    })

    it('should allow admins to modify both "PUBLIC" and "alpha users" content', async () => {
      const mockSession: Session = {
        user: {
          id: 'admin123',
          email: 'admin@example.com',
          name: 'Admin',
          role: 'admin',
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSession)

      // Both should be true for admins
      expect(await canModifyContent('PUBLIC')).toBe(true)
      expect(await canModifyContent('alpha users')).toBe(true)
    })

    it('should prevent users without valid roles from accessing "alpha users" content', async () => {
      const mockSessionNullRole: Session = {
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'User',
          role: null as any,
        },
        expires: '2025-12-31',
      }

      mockAuth.mockResolvedValue(mockSessionNullRole)

      expect(await canModifyContent('alpha users')).toBe(false)
    })
  })
})
