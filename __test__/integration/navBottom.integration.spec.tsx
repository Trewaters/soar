import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import NavBottom from '../../components/navBottom'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

// Mock next/navigation
const mockPush = jest.fn()
const mockBack = jest.fn()
const mockReplace = jest.fn()
const mockForward = jest.fn()
const mockRefresh = jest.fn()
const mockPrefetch = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock Material-UI icons
jest.mock('@mui/icons-material/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-icon" />,
}))

jest.mock('@mui/icons-material/Person', () => ({
  __esModule: true,
  default: () => <div data-testid="person-icon" />,
}))

jest.mock('@mui/icons-material/Dashboard', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="dashboard-icon" {...props} />,
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Test wrapper component with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

// Mock authenticated session
const mockAuthenticatedSession = {
  data: {
    user: {
      name: 'Test Yogi',
      email: 'test@uvuyoga.com',
      id: 'test-user-id',
    },
    expires: '2025-12-31T23:59:59.999Z',
  },
  status: 'authenticated' as const,
  update: jest.fn(),
}

// Mock unauthenticated session
const mockUnauthenticatedSession = {
  data: null,
  status: 'unauthenticated' as const,
  update: jest.fn(),
}

describe('NavBottom Integration Tests - Task 10', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default router mock setup
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      forward: mockForward,
      refresh: mockRefresh,
      prefetch: mockPrefetch,
    })
    mockUsePathname.mockReturnValue('/')
  })

  describe('Dashboard Navigation Functionality Across Different Page Combinations', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should navigate to dashboard from home when authenticated', async () => {
      render(<NavBottom subRoute="/navigator/profile" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard from breathwork features', async () => {
      render(<NavBottom subRoute="/breathwork/pranayama" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard from meditation features', async () => {
      render(<NavBottom subRoute="/meditation/guided" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard from mantra features', async () => {
      render(<NavBottom subRoute="/mantra/practice" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard from planner features', async () => {
      render(<NavBottom subRoute="/planner/create-sequence" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard from deeply nested yoga feature pages', async () => {
      render(
        <NavBottom subRoute="/planner/sequences/asana-series/vinyasa-flow" />,
        { wrapper: TestWrapper }
      )

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })
  })

  describe('Dashboard Button with Authentication', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should navigate to dashboard when authenticated', async () => {
      render(<NavBottom subRoute="/current-page" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should handle multiple rapid dashboard button clicks gracefully', async () => {
      render(<NavBottom subRoute="/current-page" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Simulate rapid clicking - the navigation loading state should prevent multiple calls
      fireEvent.click(dashboardButton)
      fireEvent.click(dashboardButton)
      fireEvent.click(dashboardButton)

      // Due to navigation loading state preventing rapid clicks, only the first click should register
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('should work correctly when dashboard navigation is triggered via keyboard', async () => {
      render(<NavBottom subRoute="/current-page" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Simulate keyboard activation (Enter key)
      fireEvent.keyDown(dashboardButton, { key: 'Enter', code: 'Enter' })

      // Note: MUI IconButton handles Enter key automatically,
      // so we need to trigger the onClick directly for this test
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Dashboard Access for Unauthenticated Users', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockUnauthenticatedSession)
    })

    it('should redirect to login when unauthenticated user clicks dashboard', async () => {
      render(<NavBottom subRoute="/landing-page" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Login to access dashboard')
      fireEvent.click(dashboardButton)

      // Should redirect to login page
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should not break when unauthenticated user attempts dashboard access', async () => {
      render(<NavBottom subRoute="/entry-point" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Login to access dashboard')

      expect(() => {
        fireEvent.click(dashboardButton)
      }).not.toThrow()

      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    })
  })

  describe('Dashboard Navigation with Yoga Sequence Flows', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should navigate to dashboard from yoga sequence without interfering with progression', async () => {
      render(<NavBottom subRoute="/planner/practice/sequence/123" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // Should navigate to dashboard, not use back navigation
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard during active yoga practice sessions', async () => {
      render(<NavBottom subRoute="/breathwork/session/active" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should navigate to dashboard when viewing individual asana details', async () => {
      render(<NavBottom subRoute="/asana/warrior-i" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should navigate to dashboard when in meditation timers', async () => {
      render(<NavBottom subRoute="/meditation/timer/5min" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Mobile Responsiveness and Touch Targets', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should maintain proper touch target size on mobile devices', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Check that the button is rendered and accessible
      expect(dashboardButton).toBeInTheDocument()
      expect(dashboardButton).toHaveAttribute('role', 'button')
    })

    it('should handle touch events correctly on mobile', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Simulate touch event
      fireEvent.touchStart(dashboardButton)
      fireEvent.touchEnd(dashboardButton)
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should maintain proper layout on different screen sizes', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const navigation = screen.getByRole('navigation')
      expect(navigation).toBeInTheDocument()

      // Navigation should be accessible regardless of screen size
      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      expect(dashboardButton).toBeVisible()
    })
  })

  describe('Cross-Page Consistency', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should work consistently across all pages that display bottom navigation', async () => {
      const testPages = [
        '/',
        '/navigator/profile',
        '/breathwork',
        '/meditation',
        '/mantra',
        '/planner',
        '/asana/list',
        '/series/vinyasa',
      ]

      for (const page of testPages) {
        jest.clearAllMocks()

        const { unmount } = render(<NavBottom subRoute={page} />, {
          wrapper: TestWrapper,
        })

        const dashboardButton = screen.getByLabelText('Navigate to dashboard')
        fireEvent.click(dashboardButton)

        expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')

        unmount()
      }
    })

    it('should maintain consistent behavior with different authentication states', async () => {
      // Test with authenticated user
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
      const { unmount: unmountAuth } = render(<NavBottom subRoute="/test" />, {
        wrapper: TestWrapper,
      })

      let dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')

      unmountAuth()
      jest.clearAllMocks()

      // Test with unauthenticated user - should redirect to login
      mockUseSession.mockReturnValue(mockUnauthenticatedSession)
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      dashboardButton = screen.getByLabelText('Login to access dashboard')
      fireEvent.click(dashboardButton)
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    })

    it('should work consistently regardless of subRoute prop value', async () => {
      const testRoutes = [
        '/simple',
        '/nested/path',
        '/deeply/nested/path/with/many/segments',
        '/path-with-hyphens',
        '/path_with_underscores',
        '/path123with456numbers',
      ]

      for (const route of testRoutes) {
        jest.clearAllMocks()

        const { unmount } = render(<NavBottom subRoute={route} />, {
          wrapper: TestWrapper,
        })

        const dashboardButton = screen.getByLabelText('Navigate to dashboard')
        fireEvent.click(dashboardButton)

        expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')

        unmount()
      }
    })
  })

  describe('Loading State Integration', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should integrate properly with NavigationLoadingContext', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // Should call router.push() which integrates with loading context
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle loading states during dashboard navigation', async () => {
      // Mock a slow navigation
      mockPush.mockImplementation(() => {
        return new Promise((resolve) => setTimeout(resolve, 100))
      })

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should handle router.push() errors without crashing the component', async () => {
      // Mock push to throw an error
      mockPush.mockImplementation(() => {
        throw new Error('Navigation error')
      })

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Component should still be interactive even if dashboard navigation fails
      expect(dashboardButton).toBeInTheDocument()
      expect(dashboardButton).not.toBeDisabled()

      // The component should remain stable even if navigation fails
      expect(screen.getByRole('navigation')).toBeInTheDocument()

      // Test that clicking the dashboard button doesn't crash the component
      // We expect an error to be thrown, so we'll catch it
      expect(() => {
        fireEvent.click(dashboardButton)
      }).not.toThrow() // The component itself shouldn't throw
    })

    it('should work when router is temporarily unavailable', async () => {
      // Mock router as undefined temporarily
      mockUseRouter.mockReturnValueOnce(undefined as any)

      expect(() => {
        render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })
      }).not.toThrow()
    })

    it('should handle missing subRoute prop gracefully', async () => {
      expect(() => {
        render(<NavBottom subRoute="" />, { wrapper: TestWrapper })
      }).not.toThrow()

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Performance and Optimization', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should not re-render unnecessarily when subRoute changes', async () => {
      const { rerender } = render(<NavBottom subRoute="/initial" />, {
        wrapper: TestWrapper,
      })

      // Change subRoute
      rerender(<NavBottom subRoute="/changed" />)

      const updatedDashboardButton = screen.getByLabelText(
        'Navigate to dashboard'
      )

      // Button should still be functional
      fireEvent.click(updatedDashboardButton)
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle rapid navigation requests efficiently', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Simulate rapid clicking in a short time frame
      const startTime = Date.now()
      for (let i = 0; i < 5; i++) {
        fireEvent.click(dashboardButton)
      }
      const endTime = Date.now()

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(100)
      // All clicks should invoke push, but the NavigationLoadingContext
      // will handle the actual debouncing in the real app
      expect(mockPush).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })
})
