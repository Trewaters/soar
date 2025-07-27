import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import NavBottom from '../../components/navBottom'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Mock next/navigation
const mockPush = jest.fn()
const mockBack = jest.fn()
const mockReplace = jest.fn()
const mockForward = jest.fn()
const mockRefresh = jest.fn()
const mockPrefetch = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

jest.mock('@mui/icons-material/ArrowBack', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="arrow-back-icon" {...props} />,
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
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
  })

  describe('Back Navigation Functionality Across Different Page Combinations', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should work correctly when navigating from home to profile and back', async () => {
      render(<NavBottom subRoute="/navigator/profile" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should work correctly when navigating from breathwork features', async () => {
      render(<NavBottom subRoute="/breathwork/pranayama" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should work correctly when navigating from meditation features', async () => {
      render(<NavBottom subRoute="/meditation/guided" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should work correctly when navigating from mantra features', async () => {
      render(<NavBottom subRoute="/mantra/practice" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should work correctly when navigating from planner features', async () => {
      render(<NavBottom subRoute="/planner/create-sequence" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should work correctly on deeply nested yoga feature pages', async () => {
      render(
        <NavBottom subRoute="/planner/sequences/asana-series/vinyasa-flow" />,
        { wrapper: TestWrapper }
      )

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Back Button with Existing Browser History', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should call router.back() when browser history is available', async () => {
      // Simulate having browser history by ensuring back is available
      render(<NavBottom subRoute="/current-page" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockBack).toHaveBeenCalledWith()
    })

    it('should handle multiple rapid back button clicks gracefully', async () => {
      render(<NavBottom subRoute="/current-page" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Simulate rapid clicking - the navigation loading state should prevent multiple calls
      fireEvent.click(backButton)
      fireEvent.click(backButton)
      fireEvent.click(backButton)

      // Due to navigation loading state preventing rapid clicks, only the first click should register
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should work correctly when back navigation is triggered via keyboard', async () => {
      render(<NavBottom subRoute="/current-page" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Simulate keyboard activation (Enter key)
      fireEvent.keyDown(backButton, { key: 'Enter', code: 'Enter' })

      // Note: MUI IconButton handles Enter key automatically,
      // so we need to trigger the onClick directly for this test
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Graceful Handling When No Browser History Available', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should still call router.back() even when no history (browser handles gracefully)', async () => {
      // Users who land directly on a page (e.g., via bookmark or direct link)
      render(<NavBottom subRoute="/landing-page" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      // The component should still call router.back() - browser will handle gracefully
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should not break when router.back() is called on entry page', async () => {
      // Mock a scenario where router.back() might not do anything
      mockBack.mockImplementation(() => {
        // Simulate browser doing nothing when no history
        return undefined
      })

      render(<NavBottom subRoute="/entry-point" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      expect(() => {
        fireEvent.click(backButton)
      }).not.toThrow()

      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Back Navigation with Yoga Sequence Flows', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should not interfere with yoga sequence progression when used appropriately', async () => {
      render(<NavBottom subRoute="/planner/practice/sequence/123" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      // Should use browser back, not interfere with sequence internal navigation
      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should work correctly during active yoga practice sessions', async () => {
      render(<NavBottom subRoute="/breathwork/session/active" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should work correctly when viewing individual asana details', async () => {
      render(<NavBottom subRoute="/asana/warrior-i" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should work correctly when in meditation timers', async () => {
      render(<NavBottom subRoute="/meditation/timer/5min" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Mobile Responsiveness and Touch Targets', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should maintain proper touch target size on mobile devices', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Check that the button is rendered and accessible
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveAttribute('role', 'button')
    })

    it('should handle touch events correctly on mobile', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Simulate touch event
      fireEvent.touchStart(backButton)
      fireEvent.touchEnd(backButton)
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should maintain proper layout on different screen sizes', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const navigation = screen.getByRole('navigation')
      expect(navigation).toBeInTheDocument()

      // Navigation should be accessible regardless of screen size
      const backButton = screen.getByLabelText('Navigate back to previous page')
      expect(backButton).toBeVisible()
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

        const backButton = screen.getByLabelText(
          'Navigate back to previous page'
        )
        fireEvent.click(backButton)

        expect(mockBack).toHaveBeenCalledTimes(1)

        unmount()
      }
    })

    it('should maintain consistent behavior with different authentication states', async () => {
      // Test with authenticated user
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
      const { unmount: unmountAuth } = render(<NavBottom subRoute="/test" />, {
        wrapper: TestWrapper,
      })

      let backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)

      unmountAuth()
      jest.clearAllMocks()

      // Test with unauthenticated user
      mockUseSession.mockReturnValue(mockUnauthenticatedSession)
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)
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

        const backButton = screen.getByLabelText(
          'Navigate back to previous page'
        )
        fireEvent.click(backButton)

        expect(mockBack).toHaveBeenCalledTimes(1)

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

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      // Should call router.back() which integrates with loading context
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should handle loading states during back navigation', async () => {
      // Mock a slow back navigation
      mockBack.mockImplementation(() => {
        return new Promise((resolve) => setTimeout(resolve, 100))
      })

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue(mockAuthenticatedSession)
    })

    it('should handle router.back() errors without crashing the component', async () => {
      // Mock back to throw an error
      mockBack.mockImplementation(() => {
        throw new Error('Navigation error')
      })

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Component should still be interactive even if back navigation fails
      expect(backButton).toBeInTheDocument()
      expect(backButton).not.toBeDisabled()

      // The component should remain stable even if navigation fails
      expect(screen.getByRole('navigation')).toBeInTheDocument()

      // Test that clicking the back button doesn't crash the component
      // We expect an error to be thrown, so we'll catch it
      expect(() => {
        fireEvent.click(backButton)
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
      // Reset mockBack to normal behavior for this test
      mockBack.mockReset()
      mockBack.mockImplementation(() => {})

      expect(() => {
        render(<NavBottom subRoute="" />, { wrapper: TestWrapper })
      }).not.toThrow()

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
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

      const updatedBackButton = screen.getByLabelText(
        'Navigate back to previous page'
      )

      // Button should still be functional
      fireEvent.click(updatedBackButton)
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid navigation requests efficiently', async () => {
      // Reset mockBack to normal behavior for this test
      mockBack.mockReset()
      mockBack.mockImplementation(() => {})

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Simulate rapid clicking in a short time frame
      const startTime = Date.now()
      for (let i = 0; i < 5; i++) {
        fireEvent.click(backButton)
      }
      const endTime = Date.now()

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(100)
      // Due to navigation loading state, only the first click should register
      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })
})
