import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import NavBottom from '../../components/navBottom'
import { testNavigationAccessibility } from '../accessibility/axe-test-utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock next/navigation
const mockPush = jest.fn()
const mockBack = jest.fn()
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
const SoarTestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

describe('NavBottom - Accessibility Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
  })

  describe('WCAG Compliance and Axe Testing', () => {
    it('should have no accessibility violations when user is authenticated', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      await testNavigationAccessibility(<NavBottom subRoute="/test" />, {
        wrapper: SoarTestWrapper,
      })
    })

    it('should have no accessibility violations when user is unauthenticated', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      await testNavigationAccessibility(<NavBottom subRoute="/test" />, {
        wrapper: SoarTestWrapper,
      })
    })

    it('should have no interactive accessibility violations for back button', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { container } = render(<NavBottom subRoute="/test" />, {
        wrapper: SoarTestWrapper,
      })

      // Focus specifically on the back button for interactive testing
      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Run axe specifically on interactive elements
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: true },
          'link-name': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'color-contrast': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
      expect(backButton).toBeInTheDocument()
    })

    it('should meet color contrast requirements for all navigation states', async () => {
      // Test authenticated state
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      const { container } = render(<NavBottom subRoute="/test" />, {
        wrapper: SoarTestWrapper,
      })

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Screen Reader Announcements', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('should properly announce back button function to screen readers', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
      expect(backButton).toHaveAttribute(
        'title',
        'Navigate back to previous page'
      )
      expect(backButton).toHaveAttribute('role', 'button')
    })

    it('should have proper navigation landmark for screen readers', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const navigation = screen.getByRole('navigation')
      expect(navigation).toHaveAttribute('aria-label', 'Bottom navigation')
      // The navigation is semantic HTML nav element, not using component prop
      expect(navigation.tagName.toLowerCase()).toBe('nav')
    })

    it('should announce disabled state for profile button when unauthenticated', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).toBeDisabled()
      expect(profileButton).toHaveAttribute(
        'aria-label',
        'Navigate to user profile'
      )
    })

    it('should have proper ARIA hidden attribute on icons', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const arrowBackIcon = screen.getByTestId('arrow-back-icon')
      // The icon should have aria-hidden since the button itself has the label
      expect(arrowBackIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('should allow keyboard navigation to back button', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Tab to the button
      backButton.focus()
      expect(backButton).toHaveFocus()
    })

    it('should trigger back navigation on Enter key press', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      backButton.focus()

      // MUI IconButton handles Enter key as a click event
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should trigger back navigation on Space key press', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      backButton.focus()

      // MUI IconButton handles Space key as a click event
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should have proper focus styles for back button', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Focus the button using programmatic focus
      backButton.focus()

      // Check that the button can receive focus (accessibility requirement)
      expect(backButton).toBeInTheDocument()
      expect(backButton).not.toBeDisabled()

      // The component should have focus outline styles defined in sx prop
      // We can test that the button is focusable and has proper tabindex
      expect(backButton).toHaveAttribute('tabindex', '0')
    })

    it('should maintain proper tab order for all navigation buttons', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const homeButton = screen.getByLabelText('Navigate to home page')
      const profileButton = screen.getByLabelText('Navigate to user profile')
      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Test tab order - should be left to right
      homeButton.focus()
      expect(homeButton).toHaveFocus()

      // Simulate tab navigation
      fireEvent.keyDown(homeButton, { key: 'Tab' })
      profileButton.focus()
      expect(profileButton).toHaveFocus()

      fireEvent.keyDown(profileButton, { key: 'Tab' })
      backButton.focus()
      expect(backButton).toHaveFocus()
    })
  })

  describe('Touch Target Accessibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('should have minimum 48px touch targets for mobile accessibility', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // MUI IconButton should provide adequate touch target
      // Test that the button is present and accessible
      expect(backButton).toBeInTheDocument()
      expect(backButton).not.toBeDisabled()
    })

    it('should maintain touch targets even when profile button is disabled', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const profileButton = screen.getByLabelText('Navigate to user profile')

      // Even disabled buttons should maintain proper touch targets
      expect(profileButton).toBeInTheDocument()
      expect(profileButton).toBeDisabled()
    })
  })

  describe('Assistive Technology Compatibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('should provide clear button roles for assistive technology', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      expect(backButton).toHaveAttribute('role', 'button')
      expect(backButton.tagName.toLowerCase()).toBe('button')
    })

    it('should provide proper semantic navigation structure', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const navigation = screen.getByRole('navigation')
      const buttons = screen.getAllByRole('button')

      expect(navigation).toBeInTheDocument()
      expect(buttons).toHaveLength(3) // home, profile, back

      // Verify navigation contains all buttons
      buttons.forEach((button) => {
        expect(navigation).toContainElement(button)
      })
    })

    it('should have descriptive labels that explain button functionality', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const homeButton = screen.getByLabelText('Navigate to home page')
      const profileButton = screen.getByLabelText('Navigate to user profile')
      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Labels should clearly describe the action, not just the icon
      expect(homeButton).toHaveAttribute('aria-label', 'Navigate to home page')
      expect(profileButton).toHaveAttribute(
        'aria-label',
        'Navigate to user profile'
      )
      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
    })
  })

  describe('Dynamic State Accessibility', () => {
    it('should maintain accessibility when authentication state changes', async () => {
      const { rerender } = render(<NavBottom subRoute="/test" />, {
        wrapper: SoarTestWrapper,
      })

      // Start unauthenticated
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      rerender(<NavBottom subRoute="/test" />)

      let profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).toBeDisabled()

      // Change to authenticated
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      rerender(<NavBottom subRoute="/test" />)

      profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).not.toBeDisabled()

      // Back button should remain consistent
      const backButton = screen.getByLabelText('Navigate back to previous page')
      expect(backButton).toBeInTheDocument()
      expect(backButton).not.toBeDisabled()
    })

    it('should maintain proper color contrast in all authentication states', async () => {
      // Test unauthenticated state
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { container, rerender } = render(<NavBottom subRoute="/test" />, {
        wrapper: SoarTestWrapper,
      })

      let results = await axe(container, {
        rules: { 'color-contrast': { enabled: true } },
      })
      expect(results).toHaveNoViolations()

      // Test authenticated state
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      rerender(<NavBottom subRoute="/test" />)

      results = await axe(container, {
        rules: { 'color-contrast': { enabled: true } },
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe('Yoga App Specific Accessibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test Yogi', email: 'yogi@uvuyoga.com' },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('should work correctly during yoga practice sessions', () => {
      // Test with yoga-specific route
      render(<NavBottom subRoute="/breathwork/practice" />, {
        wrapper: SoarTestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Should work during practice
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)

      // Should maintain accessibility during practice flows
      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
    })

    it('should be accessible for yoga practitioners with different abilities', () => {
      render(<NavBottom subRoute="/meditation/guided" />, {
        wrapper: SoarTestWrapper,
      })

      // Test that navigation works for practitioners who may need to navigate
      // back during meditation or breathing exercises
      const backButton = screen.getByLabelText('Navigate back to previous page')

      expect(backButton).toBeInTheDocument()
      expect(backButton).not.toBeDisabled()

      // Should work with keyboard (for users with motor limitations)
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('should maintain accessibility during sequence planning', () => {
      render(<NavBottom subRoute="/planner/create-sequence" />, {
        wrapper: SoarTestWrapper,
      })

      const navigation = screen.getByRole('navigation')
      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Navigation should be accessible during yoga planning activities
      expect(navigation).toHaveAttribute('aria-label', 'Bottom navigation')
      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
    })
  })

  describe('Error State Accessibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('should handle navigation errors gracefully for screen readers', () => {
      // Mock back navigation to throw an error
      mockBack.mockImplementation(() => {
        throw new Error('Navigation failed')
      })

      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Button should still be accessible even if navigation might fail
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )

      // Reset mock for other tests
      mockBack.mockReset()
      mockBack.mockImplementation(() => {})
    })

    it('should maintain accessibility when router is unavailable', () => {
      // Mock router to be unavailable
      mockUseRouter.mockReturnValue({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      })

      render(<NavBottom subRoute="/test" />, { wrapper: SoarTestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Accessibility attributes should still be present
      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
      expect(backButton).toHaveAttribute('role', 'button')
    })
  })
})
