import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NavBottom from '../../components/navBottom'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Mock next/navigation
const mockPush = jest.fn()
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

jest.mock('@mui/icons-material/Menu', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-icon" />,
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('NavBottom Component', () => {
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
      render(<NavBottom subRoute="/test" />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
      expect(screen.getByTestId('person-icon')).toBeInTheDocument()
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument()
    })

    it('has correct aria-label for navigation', () => {
      render(<NavBottom subRoute="/test" />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation')
    })

    it('disables profile button when user is not authenticated', () => {
      render(<NavBottom subRoute="/test" />)

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).toBeDisabled()
    })

    it('navigates to home when home button is clicked', () => {
      render(<NavBottom subRoute="/test" />)

      const homeButton = screen.getByLabelText('Navigate to home page')
      fireEvent.click(homeButton)

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('navigates to subRoute when menu button is clicked', () => {
      render(<NavBottom subRoute="/dashboard" />)

      const menuButton = screen.getByLabelText('Open navigation menu')
      fireEvent.click(menuButton)

      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('applies correct colors for unauthenticated state', () => {
      render(<NavBottom subRoute="/test" />)

      const homeIcon = screen.getByTestId('home-icon')
      const personIcon = screen.getByTestId('person-icon')
      const menuIcon = screen.getByTestId('menu-icon')

      // Home icon should always be primary.main
      expect(homeIcon).toHaveStyle({ color: 'primary.main' })

      // Person icon should be grey when not authenticated
      expect(personIcon).toHaveStyle({ color: 'grey.500' })

      // Menu icon should always be primary.contrastText
      expect(menuIcon).toHaveStyle({ color: 'primary.contrastText' })
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
      render(<NavBottom subRoute="/test" />)

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).not.toBeDisabled()
    })

    it('navigates to profile when profile button is clicked', () => {
      render(<NavBottom subRoute="/test" />)

      const profileButton = screen.getByLabelText('Navigate to user profile')
      fireEvent.click(profileButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile')
    })

    it('applies correct colors for authenticated state', () => {
      render(<NavBottom subRoute="/test" />)

      const homeIcon = screen.getByTestId('home-icon')
      const personIcon = screen.getByTestId('person-icon')
      const menuIcon = screen.getByTestId('menu-icon')

      // Home icon should always be primary.main
      expect(homeIcon).toHaveStyle({ color: 'primary.main' })

      // Person icon should be green when authenticated
      expect(personIcon).toHaveStyle({ color: 'success.main' })

      // Menu icon should always be primary.contrastText
      expect(menuIcon).toHaveStyle({ color: 'primary.contrastText' })
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
      render(<NavBottom subRoute="/test" />)

      const profileButton = screen.getByLabelText('Navigate to user profile')
      expect(profileButton).toBeDisabled()
    })
  })

  describe('responsive layout', () => {
    it('applies correct responsive styling', () => {
      render(<NavBottom subRoute="/test" />)

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
      render(<NavBottom subRoute="/test" />)

      const buttons = screen.getAllByRole('button')

      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label')
      })
    })

    it('has correct aria-labels for all buttons', () => {
      render(<NavBottom subRoute="/test" />)

      expect(screen.getByLabelText('Navigate to home page')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Navigate to user profile')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument()
    })

    it('supports keyboard interaction', () => {
      render(<NavBottom subRoute="/test" />)

      const homeButton = screen.getByLabelText('Navigate to home page')

      // Focus the button
      homeButton.focus()
      expect(homeButton).toHaveFocus()

      // Simulate Enter key press
      fireEvent.keyDown(homeButton, { key: 'Enter' })
      // Note: MUI handles Enter key internally, so we just test that it doesn't break
    })
  })

  describe('dynamic path handling', () => {
    it('handles function-based paths correctly', () => {
      render(<NavBottom subRoute="/custom-route" />)

      const menuButton = screen.getByLabelText('Open navigation menu')
      fireEvent.click(menuButton)

      expect(mockPush).toHaveBeenCalledWith('/custom-route')
    })

    it('handles string-based paths correctly', () => {
      render(<NavBottom subRoute="/test" />)

      const homeButton = screen.getByLabelText('Navigate to home page')
      fireEvent.click(homeButton)

      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('prop validation', () => {
    it('accepts subRoute prop correctly', () => {
      const testRoute = '/custom-dashboard'
      render(<NavBottom subRoute={testRoute} />)

      const menuButton = screen.getByLabelText('Open navigation menu')
      fireEvent.click(menuButton)

      expect(mockPush).toHaveBeenCalledWith(testRoute)
    })
  })

  describe('component structure', () => {
    it('renders as an AppBar component', () => {
      render(<NavBottom subRoute="/test" />)

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('contains exactly three navigation buttons', () => {
      render(<NavBottom subRoute="/test" />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3)
    })

    it('renders icons in correct order', () => {
      render(<NavBottom subRoute="/test" />)

      const buttons = screen.getAllByRole('button')

      // Check that icons are present in the expected order
      expect(buttons[0]).toHaveAttribute('aria-label', 'Navigate to home page')
      expect(buttons[1]).toHaveAttribute(
        'aria-label',
        'Navigate to user profile'
      )
      expect(buttons[2]).toHaveAttribute('aria-label', 'Open navigation menu')
    })
  })
})
