import { renderHook } from '@testing-library/react'
import { useFreemiumNotification } from '../../../../app/clientComponents/freemiumNotification/hooks/useFreemiumNotification'
import { NavigationLoadingProvider } from '../../../../app/context/NavigationLoadingContext'

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Create a wrapper component that provides all necessary contexts
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
)

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('useFreemiumNotification', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter)
  })

  describe('userAuthState determination', () => {
    it('returns unauthenticated when no session', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      expect(result.current.userAuthState).toBe('unauthenticated')
    })

    it('returns authenticated-pro for all authenticated users (current implementation)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      expect(result.current.userAuthState).toBe('authenticated-pro')
    })

    // Note: The current implementation treats all authenticated users as having full access
    // This test documents the current behavior since no payment system is implemented
    it('returns authenticated-pro for all authenticated users (no payment system yet)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            // subscription property would be ignored in current implementation
          } as any,
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      // Current implementation always returns 'authenticated-pro' for authenticated users
      expect(result.current.userAuthState).toBe('authenticated-pro')
    })

    it('returns authenticated-pro when subscription is undefined', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      expect(result.current.userAuthState).toBe('authenticated-pro')
    })
  })

  describe('checkFeatureAccess', () => {
    it('denies access for unauthenticated users', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })
      const accessResult = result.current.checkFeatureAccess('createSeries')

      expect(accessResult.hasAccess).toBe(false)
      expect(accessResult.requiresLogin).toBe(true)
      expect(accessResult.requiresUpgrade).toBe(false)
    })

    it('grants access for all authenticated users (current implementation)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })
      const accessResult = result.current.checkFeatureAccess('createAsana')

      expect(accessResult.hasAccess).toBe(true)
      expect(accessResult.requiresLogin).toBe(false)
      expect(accessResult.requiresUpgrade).toBe(false)
    })

    it('handles all feature types correctly (current implementation grants access)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      const features = [
        'createAsana',
        'createFlow',
        'createSeries',
        'createSequence',
      ] as const

      features.forEach((feature) => {
        const accessResult = result.current.checkFeatureAccess(feature)
        expect(accessResult.hasAccess).toBe(true)
        expect(accessResult.requiresLogin).toBe(false)
        expect(accessResult.requiresUpgrade).toBe(false)
      })
    })
  })

  describe('handleCtaAction', () => {
    it('redirects to signin for unauthenticated users', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      result.current.handleCtaAction('createSeries', '/current-path')

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/auth/signin?callbackUrl=%2Fcurrent-path'
      )
    })

    it('does nothing for authenticated users (they have access)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          },
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      result.current.handleCtaAction('createAsana', '/current-path')

      // No redirect should happen since authenticated users have access
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('handles all authenticated users gracefully (current implementation gives full access)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          } as any,
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      result.current.handleCtaAction('createSequence', '/current-path')

      // No redirect should happen since authenticated users have access
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('handles missing currentPath gracefully', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      result.current.handleCtaAction('createFlow')

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/auth/signin?callbackUrl=%2F'
      )
    })
  })

  describe('session status handling', () => {
    it('handles loading state', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      expect(result.current.userAuthState).toBe('unauthenticated')
    })

    it('handles invalid session data', () => {
      mockUseSession.mockReturnValue({
        data: {} as any,
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      expect(result.current.userAuthState).toBe('unauthenticated')
    })
  })

  describe('edge cases', () => {
    it('handles malformed user data', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: null,
          expires: '2024-12-31',
        } as any,
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      expect(result.current.userAuthState).toBe('unauthenticated')
    })

    it('handles subscription with different casing (current implementation ignores subscription)', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
          } as any,
          expires: '2024-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { result } = renderHook(() => useFreemiumNotification(), {
        wrapper: TestWrapper,
      })

      // Current implementation doesn't check subscription field
      expect(result.current.userAuthState).toBe('authenticated-pro')
    })
  })
})
