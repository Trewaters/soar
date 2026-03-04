import '@testing-library/jest-dom'
import { renderHook } from '@testing-library/react'
import { useCanEditContent, useIsAdmin } from '@app/hooks/useCanEditContent'
import { useSession } from 'next-auth/react'

// Mock next-auth/react
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('useCanEditContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('No Session', () => {
    it('should return canEdit false when no session exists', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useCanEditContent('user-123'))

      expect(result.current.canEdit).toBe(false)
      expect(result.current.reason).toBe('Please sign in to edit content')
      expect(result.current.isOwner).toBe(false)
      expect(result.current.isAdmin).toBe(false)
    })

    it('should return canEdit false when session user has no id', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useCanEditContent('user-123'))

      expect(result.current.canEdit).toBe(false)
      expect(result.current.reason).toBe('Please sign in to edit content')
    })
  })

  describe('Admin User', () => {
    const adminSession = {
      data: {
        user: {
          id: 'admin-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated' as const,
      update: jest.fn(),
    }

    it('should return canEdit true for admin on PUBLIC content', () => {
      mockUseSession.mockReturnValue(adminSession)

      const { result } = renderHook(() => useCanEditContent('PUBLIC'))

      expect(result.current.canEdit).toBe(true)
      expect(result.current.reason).toBe('Admin privileges')
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.isOwner).toBe(false)
    })

    it('should return canEdit true for admin on other user content', () => {
      mockUseSession.mockReturnValue(adminSession)

      const { result } = renderHook(() => useCanEditContent('other-user-456'))

      expect(result.current.canEdit).toBe(true)
      expect(result.current.reason).toBe('Admin privileges')
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.isOwner).toBe(false)
    })

    it('should return canEdit true for admin on their own content', () => {
      mockUseSession.mockReturnValue(adminSession)

      const { result } = renderHook(() => useCanEditContent('admin-123'))

      expect(result.current.canEdit).toBe(true)
      expect(result.current.reason).toBe('Admin privileges')
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.isOwner).toBe(true)
    })

    it('should return canEdit true for admin when created_by is null', () => {
      mockUseSession.mockReturnValue(adminSession)

      const { result } = renderHook(() => useCanEditContent(null))

      expect(result.current.canEdit).toBe(true)
      expect(result.current.reason).toBe('Admin privileges')
      expect(result.current.isAdmin).toBe(true)
    })
  })

  describe('Regular User - Owner', () => {
    const userSession = {
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated' as const,
      update: jest.fn(),
    }

    it('should return canEdit true when user owns the content', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent('user-123'))

      expect(result.current.canEdit).toBe(true)
      expect(result.current.reason).toBe('You own this content')
      expect(result.current.isOwner).toBe(true)
      expect(result.current.isAdmin).toBe(false)
    })
  })

  describe('Regular User - Not Owner', () => {
    const userSession = {
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated' as const,
      update: jest.fn(),
    }

    it('should return canEdit false for PUBLIC content', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent('PUBLIC'))

      expect(result.current.canEdit).toBe(false)
      expect(result.current.reason).toBe(
        'Only admins can modify PUBLIC content'
      )
      expect(result.current.isOwner).toBe(false)
      expect(result.current.isAdmin).toBe(false)
    })

    it('should return canEdit false for other user content', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent('other-user-456'))

      expect(result.current.canEdit).toBe(false)
      expect(result.current.reason).toBe('You can only edit your own content')
      expect(result.current.isOwner).toBe(false)
      expect(result.current.isAdmin).toBe(false)
    })
  })

  describe('Role Defaults', () => {
    it('should treat missing role as non-admin', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user-123',
            email: 'user@example.com',
            name: 'User Without Role',
          },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useCanEditContent('PUBLIC'))

      expect(result.current.canEdit).toBe(false)
      expect(result.current.isAdmin).toBe(false)
    })

    it('should treat empty string role as non-admin', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'user-123',
            email: 'user@example.com',
            name: 'User With Empty Role',
            role: '',
          },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useCanEditContent('PUBLIC'))

      expect(result.current.canEdit).toBe(false)
      expect(result.current.isAdmin).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    const userSession = {
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated' as const,
      update: jest.fn(),
    }

    it('should handle undefined created_by', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent(undefined))

      expect(result.current.canEdit).toBe(false)
    })

    it('should handle null created_by', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent(null))

      expect(result.current.canEdit).toBe(false)
    })

    it('should handle empty string created_by', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent(''))

      expect(result.current.canEdit).toBe(false)
    })

    it('should be case-sensitive for PUBLIC', () => {
      mockUseSession.mockReturnValue(userSession)

      const { result } = renderHook(() => useCanEditContent('public'))

      // 'public' (lowercase) should be treated as a user ID
      expect(result.current.canEdit).toBe(false)
      expect(result.current.reason).toBe('You can only edit your own content')
    })
  })

  describe('Memoization', () => {
    it('should memoize result when session and created_by do not change', () => {
      const userSession = {
        data: {
          user: {
            id: 'user-123',
            email: 'user@example.com',
            name: 'Regular User',
            role: 'user',
          },
          expires: '2025-12-31',
        },
        status: 'authenticated' as const,
        update: jest.fn(),
      }

      mockUseSession.mockReturnValue(userSession)

      const { result, rerender } = renderHook(
        ({ created_by }) => useCanEditContent(created_by),
        { initialProps: { created_by: 'user-123' } }
      )

      const firstResult = result.current

      rerender({ created_by: 'user-123' })

      // Result should be the same reference (memoized)
      expect(result.current).toBe(firstResult)
    })

    it('should update when created_by changes', () => {
      const userSession = {
        data: {
          user: {
            id: 'user-123',
            email: 'user@example.com',
            name: 'Regular User',
            role: 'user',
          },
          expires: '2025-12-31',
        },
        status: 'authenticated' as const,
        update: jest.fn(),
      }

      mockUseSession.mockReturnValue(userSession)

      const { result, rerender } = renderHook(
        ({ created_by }) => useCanEditContent(created_by),
        { initialProps: { created_by: 'user-123' } }
      )

      expect(result.current.canEdit).toBe(true)

      rerender({ created_by: 'other-user' })

      expect(result.current.canEdit).toBe(false)
    })
  })
})

describe('useIsAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true for admin user', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useIsAdmin())

    expect(result.current).toBe(true)
  })

  it('should return false for regular user', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useIsAdmin())

    expect(result.current).toBe(false)
  })

  it('should return false when no session', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useIsAdmin())

    expect(result.current).toBe(false)
  })

  it('should return false when role is missing', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'User Without Role',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useIsAdmin())

    expect(result.current).toBe(false)
  })

  it('should return false for empty string role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'User With Empty Role',
          role: '',
        },
        expires: '2025-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useIsAdmin())

    expect(result.current).toBe(false)
  })

  it('should be case-sensitive for admin role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'User With Wrong Case Role',
          role: 'Admin', // uppercase A
        },
        expires: '2025-12-31',
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useIsAdmin())

    expect(result.current).toBe(false)
  })
})
