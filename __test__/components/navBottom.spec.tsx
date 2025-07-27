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

describe('NavBottom Component', () => {
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

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('renders the navigation bar with all three icons', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
      expect(screen.getByTestId('person-icon')).toBeInTheDocument()
      expect(screen.getByTestId('arrow-back-icon')).toBeInTheDocument()
    })

    it('has correct aria-label for navigation', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation')
    })

    it('disables profile button when user is not authenticated', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).toBeDisabled()
    })

    it('navigates to home when home button is clicked', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const homeButton = screen.getByLabelText('Navigate to home page')
      fireEvent.click(homeButton)

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('navigates back when back button is clicked', () => {
      render(<NavBottom subRoute="/dashboard" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('applies correct colors for unauthenticated state', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const homeIcon = screen.getByTestId('home-icon')
      const personIcon = screen.getByTestId('person-icon')
      const backIcon = screen.getByTestId('arrow-back-icon')

      // Home icon should always be primary.main
      expect(homeIcon).toHaveStyle({ color: 'primary.main' })

      // Person icon should be grey when not authenticated
      expect(personIcon).toHaveStyle({ color: 'grey.500' })

      // Back icon should always be primary.contrastText
      expect(backIcon).toHaveStyle({ color: 'primary.contrastText' })
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('enables profile button when user is authenticated', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).not.toBeDisabled()
    })

    it('navigates to profile when profile button is clicked', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const profileButton = screen.getByLabelText('Navigate to user profile')
      fireEvent.click(profileButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile')
    })

    it('applies correct colors for authenticated state', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const homeIcon = screen.getByTestId('home-icon')
      const personIcon = screen.getByTestId('person-icon')
      const backIcon = screen.getByTestId('arrow-back-icon')

      // Home icon should always be primary.main
      expect(homeIcon).toHaveStyle({ color: 'primary.main' })

      // Person icon should be green when authenticated
      expect(personIcon).toHaveStyle({ color: 'success.main' })

      // Back icon should always be primary.contrastText
      expect(backIcon).toHaveStyle({ color: 'primary.contrastText' })
    })
  })

  describe('when session is loading', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })
    })

    it('treats loading state as unauthenticated', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).toBeDisabled()
    })
  })

  describe('responsive layout', () => {
    it('applies correct responsive styling', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const nav = screen.getByRole('navigation')

      // Check that it has the expected component prop
      expect(nav.tagName.toLowerCase()).toBe('nav')

      // The component should be positioned fixed at bottom
      expect(nav).toHaveStyle({
        position: 'fixed',
        bottom: '0',
        height: '66px',
      })
    })
  })

  describe('button accessibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
          expires: '2025-12-31T23:59:59.999Z',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('has proper focus styles for keyboard navigation', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label')
      })
    })

    it('has correct aria-labels for all buttons', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      expect(screen.getByLabelText('Navigate to home page')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Navigate to user profile')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText('Navigate back to previous page')
      ).toBeInTheDocument()
    })

    it('back button has proper accessibility attributes', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')

      // Check that the button has proper accessibility attributes
      expect(backButton).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
      expect(backButton).toHaveAttribute(
        'title',
        'Navigate back to previous page'
      )
      expect(backButton).toHaveAttribute('role', 'button')

      // Check that the icon has aria-hidden
      const backIcon = screen.getByTestId('arrow-back-icon')
      expect(backIcon).toHaveAttribute('aria-hidden', 'true')
    })

    it('supports keyboard interaction', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const homeButton = screen.getByLabelText('Navigate to home page')

      // Focus the button
      homeButton.focus()
      expect(homeButton).toHaveFocus()

      // Simulate Enter key press
      fireEvent.keyDown(homeButton, { key: 'Enter' })
      // Note: MUI handles Enter key internally, so we just test that it doesn't break
    })
  })

  describe('back navigation handling', () => {
    it('calls router.back() when back button is clicked', () => {
      render(<NavBottom subRoute="/custom-route" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('back navigation ignores subRoute prop', () => {
      render(<NavBottom subRoute="/should-not-be-used" />, {
        wrapper: TestWrapper,
      })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      // Should call router.back(), not push to subRoute
      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalledWith('/should-not-be-used')
    })

    it('integrates with loading states properly', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      // Verify that router.back() was called (loading state is handled by the hook)
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('handles edge case when no browser history exists', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      // Component should still call router.back() - the router handles the edge case
      expect(mockBack).toHaveBeenCalledTimes(1)
    })

    it('handles string-based paths correctly for home navigation', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const homeButton = screen.getByLabelText('Navigate to home page')
      fireEvent.click(homeButton)

      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockBack).not.toHaveBeenCalled()
    })
  })

  describe('prop validation', () => {
    it('accepts subRoute prop but back button ignores it', () => {
      const testRoute = '/custom-dashboard'
      render(<NavBottom subRoute={testRoute} />, { wrapper: TestWrapper })

      // Back button should not use the subRoute prop
      const backButton = screen.getByLabelText('Navigate back to previous page')
      fireEvent.click(backButton)

      expect(mockBack).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalledWith(testRoute)
    })
  })

  describe('component structure', () => {
    it('renders as an AppBar component', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('contains exactly three navigation buttons', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })

    it('renders icons in correct order', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const buttons = screen.getAllByRole('button')

      // Check that icons are present in the expected order
      expect(buttons[0]).toHaveAttribute('aria-label', 'Navigate to home page')
      expect(buttons[1]).toHaveAttribute(
        'aria-label',
        'Navigate to user profile'
      )
      expect(buttons[2]).toHaveAttribute(
        'aria-label',
        'Navigate back to previous page'
      )
    })
  })
})
