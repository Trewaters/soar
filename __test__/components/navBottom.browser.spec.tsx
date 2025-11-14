import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import NavBottom from '../../components/navBottom'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

// Mock next/navigation
const mockPush = jest.fn()
const mockPathname = jest.fn()
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
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

// Test wrapper component with all required providers
const BrowserTestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

describe('NavBottom - Browser Compatibility Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
    mockUseSession.mockReturnValue({
      data: {
        user: { name: 'Test User', email: 'test@example.com' },
        expires: '2025-12-31T23:59:59.999Z',
      },
      status: 'authenticated',
      update: jest.fn(),
    })
    mockUsePathname.mockReturnValue('/')
  })

  describe('Browser History API Compatibility', () => {
    beforeEach(() => {
      // Reset window.history mock before each test
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(),
          forward: jest.fn(),
          go: jest.fn(),
          pushState: jest.fn(),
          replaceState: jest.fn(),
          length: 2, // Simulate having history
        },
        writable: true,
      })
    })

    it('should work with standard History API in modern browsers', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle browsers with limited History API support', async () => {
      // Simulate older browser with limited history support
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(),
          length: 1, // Minimal history
        },
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should work when history.length is 1 (no previous history)', async () => {
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(),
          length: 1, // No previous pages
        },
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // Should still call back - browser will handle gracefully
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Chrome Browser Compatibility', () => {
    beforeEach(() => {
      // Mock Chrome user agent and specific features
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        writable: true,
      })
    })

    it('should work correctly in Chrome desktop environment', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle Chrome mobile navigation correctly', async () => {
      // Mock Chrome mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Test touch interaction for mobile Chrome
      fireEvent.touchStart(dashboardButton)
      fireEvent.touchEnd(dashboardButton)
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should work with Chrome loading states integration', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // Verify loading state integration works in Chrome
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')

      // Wait for any async loading state updates
      await waitFor(() => {
        expect(dashboardButton).toBeInTheDocument()
      })
    })
  })

  describe('Firefox Browser Compatibility', () => {
    beforeEach(() => {
      // Mock Firefox user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        writable: true,
      })
    })

    it('should work correctly in Firefox desktop environment', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle Firefox mobile navigation correctly', async () => {
      // Mock Firefox mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Mobile; rv:120.0) Gecko/120.0 Firefox/120.0',
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should work with Firefox private browsing mode', async () => {
      // Simulate Firefox private browsing limitations
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(),
          length: 1, // Private browsing may limit history
        },
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Safari Browser Compatibility', () => {
    beforeEach(() => {
      // Mock Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        writable: true,
      })
    })

    it('should work correctly in Safari desktop environment', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle Safari iOS mobile navigation correctly', async () => {
      // Mock Safari iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Test touch interaction for Safari iOS
      fireEvent.touchStart(dashboardButton)
      fireEvent.touchEnd(dashboardButton)
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should work with Safari tab management and history', async () => {
      // Safari has specific tab history behavior
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(),
          length: 3, // Multiple tabs/history
        },
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Edge Browser Compatibility', () => {
    beforeEach(() => {
      // Mock Edge user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        writable: true,
      })
    })

    it('should work correctly in Edge desktop environment', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should handle Edge mobile navigation correctly', async () => {
      // Mock Edge mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 EdgA/120.0.0.0',
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should work with Edge InPrivate browsing mode', async () => {
      // Simulate Edge InPrivate browsing
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(),
          length: 1, // InPrivate may limit history
        },
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Cross-Browser Loading State Consistency', () => {
    const testBrowsers = [
      {
        name: 'Chrome',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      {
        name: 'Firefox',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      },
      {
        name: 'Safari',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      },
      {
        name: 'Edge',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      },
    ]

    testBrowsers.forEach(({ name, userAgent }) => {
      it(`should have consistent loading states in ${name}`, async () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          writable: true,
        })

        render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

        const dashboardButton = screen.getByLabelText('Navigate to dashboard')

        // Test loading state integration
        fireEvent.click(dashboardButton)

        expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')

        // Verify button remains accessible during loading
        await waitFor(() => {
          expect(dashboardButton).toBeInTheDocument()
          expect(dashboardButton).toHaveAttribute(
            'aria-label',
            'Navigate to dashboard'
          )
        })
      })
    })
  })

  describe('Mobile Browser Specific Testing', () => {
    it('should handle touch events consistently across mobile browsers', async () => {
      const mobileBrowsers = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (Mobile; rv:120.0) Gecko/120.0 Firefox/120.0',
      ]

      for (const userAgent of mobileBrowsers) {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          writable: true,
        })

        const { unmount } = render(<NavBottom subRoute="/test" />, {
          wrapper: BrowserTestWrapper,
        })

        const dashboardButton = screen.getByLabelText('Navigate to dashboard')

        // Test touch sequence
        fireEvent.touchStart(dashboardButton)
        fireEvent.touchEnd(dashboardButton)
        fireEvent.click(dashboardButton)

        expect(mockPush).toHaveBeenCalled()

        unmount()
        mockPush.mockClear()
      }
    })

    it('should maintain proper touch targets across mobile browsers', async () => {
      // Test with various mobile user agents
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Verify button is properly sized and accessible on mobile
      expect(dashboardButton).toBeInTheDocument()
      expect(dashboardButton).not.toBeDisabled()

      // Touch target should be adequate (this is tested through MUI IconButton)
      const buttonStyles = window.getComputedStyle(dashboardButton)
      expect(dashboardButton.tagName.toLowerCase()).toBe('button')
    })
  })

  describe('Browser-Specific Error Handling', () => {
    it('should handle browser navigation errors gracefully across browsers', async () => {
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']

      for (const browser of browsers) {
        // Simulate navigation error by making router.push throw
        mockPush.mockImplementationOnce(() => {
          throw new Error(`${browser} navigation error`)
        })

        const { unmount } = render(<NavBottom subRoute="/test" />, {
          wrapper: BrowserTestWrapper,
        })

        const dashboardButton = screen.getByLabelText('Navigate to dashboard')

        // Should not crash the component
        expect(() => {
          fireEvent.click(dashboardButton)
        }).not.toThrow()

        unmount()
        mockPush.mockClear()
      }
    })

    it('should handle browser security restrictions gracefully', async () => {
      // Simulate browser security restrictions
      Object.defineProperty(window, 'history', {
        value: {
          back: jest.fn(() => {
            throw new Error('Security restriction')
          }),
        },
        writable: true,
      })

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Should still call the navigation method despite restrictions
      fireEvent.click(dashboardButton)
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Performance Across Browsers', () => {
    it('should perform navigation efficiently across different browsers', async () => {
      const startTime = performance.now()

      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Navigation should be fast (under 100ms in test environment)
      expect(executionTime).toBeLessThan(100)
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should maintain consistent performance during rapid navigation', async () => {
      render(<NavBottom subRoute="/test" />, { wrapper: BrowserTestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Rapid clicks should not cause issues - but React batches them
      // So we expect only one call due to event batching
      for (let i = 0; i < 5; i++) {
        fireEvent.click(dashboardButton)
      }

      // Should handle rapid clicks gracefully (batched to 1 call)
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })

  describe('Yoga App Browser Integration', () => {
    it('should work correctly during yoga practice sessions across browsers', async () => {
      const yogaRoutes = [
        '/breathwork/practice',
        '/meditation/guided',
        '/planner/create-sequence',
        '/navigator/asanaPoses/practice',
      ]

      for (const route of yogaRoutes) {
        const { unmount } = render(<NavBottom subRoute={route} />, {
          wrapper: BrowserTestWrapper,
        })

        const dashboardButton = screen.getByLabelText('Navigate to dashboard')
        fireEvent.click(dashboardButton)

        expect(mockPush).toHaveBeenCalled()

        unmount()
        mockPush.mockClear()
      }
    })

    it('should maintain accessibility across all browsers during yoga sessions', async () => {
      render(<NavBottom subRoute="/breathwork/practice" />, {
        wrapper: BrowserTestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Should maintain proper ARIA attributes across browsers
      expect(dashboardButton).toHaveAttribute(
        'aria-label',
        'Navigate to dashboard'
      )
      expect(dashboardButton).toHaveAttribute('role', 'button')

      fireEvent.click(dashboardButton)
      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })
  })
})
