import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import NavigationButton from '@clientComponents/NavigationButton'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import GlobalNavigationOverlay from '@clientComponents/GlobalNavigationOverlay'
import React, { ReactNode } from 'react'

// Create a mock router push function that returns a promise
const mockPush = jest.fn(() => new Promise(() => {})) // Never-resolving promise to keep loading state

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(() => new Promise(() => {})),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider session={null}>
    <ThemeProvider theme={theme}>
      <NavigationLoadingProvider>
        {children}
        <GlobalNavigationOverlay />
      </NavigationLoadingProvider>
    </ThemeProvider>
  </SessionProvider>
)

describe('NavigationLoadingSystem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  describe('NavigationButton', () => {
    it('should render navigation button with loading state', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Test Navigation</NavigationButton>
        </TestWrapper>
      )

      // Button should have auto-generated aria-label from href
      expect(
        screen.getByRole('button', { name: /navigate to \/test-page/i })
      ).toBeInTheDocument()
    })

    it('should show loading state when clicked', async () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Test Navigation</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button', {
        name: /navigate to \/test-page/i,
      })

      // Click the button to trigger navigation
      fireEvent.click(button)

      // Button should be disabled during navigation
      expect(button).toBeDisabled()

      // Should show loading spinner within the button
      expect(
        button.querySelector('.MuiCircularProgress-root')
      ).toBeInTheDocument()
    })

    it('should prevent multiple clicks during navigation', async () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Test Navigation</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button', {
        name: /navigate to \/test-page/i,
      })

      // Click the button multiple times rapidly
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      // Button should be disabled after first click
      expect(button).toBeDisabled()
    })
  })

  describe('GlobalNavigationOverlay', () => {
    it('should not show overlay initially', () => {
      render(
        <TestWrapper>
          <div>Test content</div>
        </TestWrapper>
      )

      // Overlay backdrop should be hidden
      const backdrop = document.querySelector('.MuiBackdrop-root')
      expect(backdrop).toHaveStyle('opacity: 0')
      expect(backdrop).toHaveStyle('visibility: hidden')
    })

    it('should show overlay during navigation', async () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: /navigate/i })

      // Click to start navigation
      fireEvent.click(button)

      // Global overlay should be visible
      await waitFor(() => {
        const backdrop = document.querySelector('.MuiBackdrop-root')
        expect(backdrop).not.toHaveStyle('opacity: 0')
      })

      // Should show target path information
      await waitFor(() => {
        expect(screen.getByText('Going to /test-page')).toBeInTheDocument()
      })
    })
  })

  describe('Mobile Touch Optimization', () => {
    it('should handle touch events properly', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Touch Test</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button', {
        name: /navigate to \/test-page/i,
      })

      // Simulate touch start and end, then click
      fireEvent.touchStart(button)
      fireEvent.touchEnd(button)
      fireEvent.click(button) // This triggers the navigation

      // Should trigger navigation and show loading state
      expect(button).toBeDisabled()
    })

    it('should have proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <NavigationButton
            href="/test-page"
            aria-label="Navigate to test page"
          >
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button', {
        name: /navigate to test page/i,
      })

      // Should have proper ARIA attributes
      expect(button).toHaveAttribute('aria-label', 'Navigate to test page')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      render(
        <TestWrapper>
          <NavigationButton href="/invalid-page">Error Test</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button', {
        name: /navigate to \/invalid-page/i,
      })

      // Click button
      fireEvent.click(button)

      // Wait for potential error handling
      await waitFor(() => {
        // Button should still be disabled during navigation
        expect(button).toBeDisabled()
      })

      consoleSpy.mockRestore()
    })
  })
})
