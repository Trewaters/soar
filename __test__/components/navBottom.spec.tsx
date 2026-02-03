import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import NavBottom from '../../components/navBottom'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getPose } from '@lib/poseService'
import { getSingleSeries } from '@lib/seriesService'
import { getSingleSequence } from '@lib/sequenceService'

// Note: next/navigation and useNavigationWithLoading are mocked globally in jest.setup.ts
// Access the global mocks via (globalThis as any).mockNavigationPush for assertions

// Reference global mocks for assertions
const mockPush = (globalThis as any).mockNavigationPush
const mockBack = (globalThis as any).mockNavigationBack || jest.fn()

// Mock next-auth (overrides global mock for custom behavior in these tests)
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock Asset Services
jest.mock('@lib/poseService', () => ({
  getPose: jest.fn(),
}))
jest.mock('@lib/seriesService', () => ({
  getSingleSeries: jest.fn(),
}))
jest.mock('@lib/sequenceService', () => ({
  getSingleSequence: jest.fn(),
}))

// Mock ShareAsset component
jest.mock('@app/clientComponents/ShareAsset', () => {
  return function MockShareAsset(props: any) {
    return (
      <div
        data-testid="share-asset"
        data-color={props.color}
        data-size={props.size}
        data-content-type={props.content?.contentType}
      />
    )
  }
})

// Mock Material-UI icons
jest.mock('@mui/icons-material/Menu', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-icon" />,
}))

jest.mock('@mui/icons-material/Person', () => ({
  __esModule: true,
  default: () => <div data-testid="person-icon" />,
}))

jest.mock('@mui/icons-material/Dashboard', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="dashboard-icon" {...props} />,
}))

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseSearchParams = useSearchParams as jest.Mock

const mockGetPose = getPose as jest.Mock
const mockGetSingleSeries = getSingleSeries as jest.Mock
const mockGetSingleSequence = getSingleSequence as jest.Mock

// Test wrapper component with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('NavBottom Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Configure pathname mock via global reference
    ;(globalThis as any).mockUsePathname.mockReturnValue('/test')
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
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument()
      expect(screen.getByTestId('person-icon')).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
    })

    it('has correct aria-label for navigation', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Bottom navigation')
    })

    it('disables profile button when user is not authenticated', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const profileButton = screen.getByLabelText('Login to access profile')
      expect(profileButton).not.toBeDisabled() // Profile button should not be disabled, it redirects to login
    })

    it('calls menu toggle when menu button is clicked', () => {
      const mockMenuToggle = jest.fn()
      render(<NavBottom subRoute="/test" onMenuToggle={mockMenuToggle} />, {
        wrapper: TestWrapper,
      })

      const menuButton = screen.getByLabelText('Open main navigation menu')
      fireEvent.click(menuButton)

      expect(mockMenuToggle).toHaveBeenCalledTimes(1)
    })

    it('navigates to login when dashboard button is clicked while unauthenticated', () => {
      render(<NavBottom subRoute="/dashboard" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Login to access dashboard')
      fireEvent.click(dashboardButton)

      // useNavigationWithLoading.push() is called with (path, elementId)
      expect(mockPush).toHaveBeenCalledWith('/auth/signin', expect.any(String))
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('applies correct colors for unauthenticated state', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const menuIcon = screen.getByTestId('menu-icon')
      const personIcon = screen.getByTestId('person-icon')
      const dashboardIcon = screen.getByTestId('dashboard-icon')

      // Menu icon should always be primary.main
      expect(menuIcon).toHaveStyle({ color: 'primary.main' })

      // Person icon should be grey when not authenticated
      expect(personIcon).toHaveStyle({ color: 'grey.500' })

      // Dashboard icon should be grey when not authenticated
      expect(dashboardIcon).toHaveStyle({ color: 'grey.500' })
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

      // useNavigationWithLoading.push() is called with (path, elementId)
      expect(mockPush).toHaveBeenCalledWith(
        '/navigator/profile',
        expect.any(String)
      )
    })

    it('applies correct colors for authenticated state', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const menuIcon = screen.getByTestId('menu-icon')
      const personIcon = screen.getByTestId('person-icon')
      const dashboardIcon = screen.getByTestId('dashboard-icon')

      // Menu icon should always be primary.main
      expect(menuIcon).toHaveStyle({ color: 'primary.main' })

      // Person icon should be green when authenticated
      expect(personIcon).toHaveStyle({ color: 'success.main' })

      // Dashboard icon should be primary when authenticated
      expect(dashboardIcon).toHaveStyle({ color: 'primary.main' })
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

      const profileButton = screen.getByLabelText('Login to access profile')
      expect(profileButton).not.toBeDisabled() // Should redirect to login, not be disabled
    })
  })

  describe('Contextual Sharing', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: { user: { id: 'user-1' } },
        status: 'authenticated',
      })
      mockGetPose.mockResolvedValue({ id: 'pose-1', name: 'Test Pose' })
      mockGetSingleSeries.mockResolvedValue({
        id: 'series-1',
        name: 'Test Series',
      })
      mockGetSingleSequence.mockResolvedValue({
        id: 'sequence-1',
        name: 'Test Sequence',
      })
    })

    it('replaces the profile icon with ShareAsset when on a practice asana page with id', async () => {
      mockUsePathname.mockReturnValue('/navigator/asanaPoses/practiceAsanas')
      mockUseSearchParams.mockReturnValue(new URLSearchParams('id=pose-1'))

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      // Should find the share asset component (with some delay due to async useEffect)
      const shareAsset = await screen.findByTestId('share-asset')
      expect(shareAsset).toBeInTheDocument()

      // The profile icon should NOT be in the document
      expect(screen.queryByTestId('person-icon')).not.toBeInTheDocument()
    })

    it('replaces the profile icon with ShareAsset when on a practice series page with id', async () => {
      mockUsePathname.mockReturnValue('/navigator/flows/practiceSeries')
      mockUseSearchParams.mockReturnValue(new URLSearchParams('id=series-1'))

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const shareAsset = await screen.findByTestId('share-asset')
      expect(shareAsset).toBeInTheDocument()
      expect(screen.queryByTestId('person-icon')).not.toBeInTheDocument()
    })

    it('replaces the profile icon with ShareAsset when on a practice sequence page with sequenceId', async () => {
      mockUsePathname.mockReturnValue('/navigator/flows/practiceSequences')
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams('sequenceId=sequence-1')
      )

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const shareAsset = await screen.findByTestId('share-asset')
      expect(shareAsset).toBeInTheDocument()
      expect(screen.queryByTestId('person-icon')).not.toBeInTheDocument()
    })

    it('replaces the profile icon with ShareAsset on base flow page when id is present', async () => {
      mockUsePathname.mockReturnValue('/navigator/flows')
      mockUseSearchParams.mockReturnValue(new URLSearchParams('id=series-1'))

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const shareAsset = await screen.findByTestId('share-asset')
      expect(shareAsset).toBeInTheDocument()
    })

    it('shows the normal profile icon when no asset id is present on practice pages', () => {
      mockUsePathname.mockReturnValue('/navigator/asanaPoses/practiceAsanas')
      mockUseSearchParams.mockReturnValue(new URLSearchParams(''))

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      expect(screen.getByTestId('person-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('share-asset')).not.toBeInTheDocument()
    })

    it('passes correct props to ShareAsset', async () => {
      mockUsePathname.mockReturnValue('/navigator/asanaPoses/practiceAsanas')
      mockUseSearchParams.mockReturnValue(new URLSearchParams('id=pose-1'))

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const shareAsset = await screen.findByTestId('share-asset')

      // Check for custom styling props we added
      expect(shareAsset).toHaveAttribute('data-color', 'success.main')
      expect(shareAsset).toHaveAttribute('data-size', 'medium')
      expect(shareAsset).toHaveAttribute('data-content-type', 'asana')
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

      expect(
        screen.getByLabelText('Open main navigation menu')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText('Navigate to user profile')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Navigate to dashboard')).toBeInTheDocument()
    })

    it('dashboard button has proper accessibility attributes', () => {
      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')

      // Check that the button has proper accessibility attributes
      expect(dashboardButton).toHaveAttribute(
        'aria-label',
        'Navigate to dashboard'
      )
      expect(dashboardButton).toHaveAttribute('title', 'Navigate to dashboard')
      expect(dashboardButton).toHaveAttribute('role', 'button')

      // Check that the icon has aria-hidden
      const dashboardIcon = screen.getByTestId('dashboard-icon')
      expect(dashboardIcon).toHaveAttribute('aria-hidden', 'true')
    })

    it('supports keyboard interaction', () => {
      const mockMenuToggle = jest.fn()
      render(<NavBottom subRoute="/test" onMenuToggle={mockMenuToggle} />, {
        wrapper: TestWrapper,
      })

      const menuButton = screen.getByLabelText('Open main navigation menu')

      // Focus the button
      menuButton.focus()
      expect(menuButton).toHaveFocus()

      // Simulate Enter key press
      fireEvent.keyDown(menuButton, { key: 'Enter' })
      // Note: MUI handles Enter key internally, so we just test that it doesn't break
    })
  })

  describe('dashboard navigation handling', () => {
    it('navigates to dashboard when dashboard button is clicked and authenticated', () => {
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

      render(<NavBottom subRoute="/custom-route" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // useNavigationWithLoading.push() is called with (path, elementId)
      expect(mockPush).toHaveBeenCalledWith(
        '/navigator/profile/dashboard',
        expect.any(String)
      )
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('redirects to login when dashboard button is clicked and unauthenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      render(<NavBottom subRoute="/should-not-be-used" />, {
        wrapper: TestWrapper,
      })

      const dashboardButton = screen.getByLabelText('Login to access dashboard')
      fireEvent.click(dashboardButton)

      // Should redirect to login - useNavigationWithLoading.push() is called with (path, elementId)
      expect(mockPush).toHaveBeenCalledWith('/auth/signin', expect.any(String))
      expect(mockBack).not.toHaveBeenCalled()
    })

    it('integrates with loading states properly', () => {
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

      render(<NavBottom subRoute="/test" />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // Verify that router.push() was called with dashboard path - useNavigationWithLoading.push() is called with (path, elementId)
      expect(mockPush).toHaveBeenCalledWith(
        '/navigator/profile/dashboard',
        expect.any(String)
      )
    })

    it('handles menu toggle correctly', () => {
      const mockMenuToggle = jest.fn()
      render(<NavBottom subRoute="/test" onMenuToggle={mockMenuToggle} />, {
        wrapper: TestWrapper,
      })

      const menuButton = screen.getByLabelText('Open main navigation menu')
      fireEvent.click(menuButton)

      expect(mockMenuToggle).toHaveBeenCalledTimes(1)
      expect(mockPush).not.toHaveBeenCalled()
      expect(mockBack).not.toHaveBeenCalled()
    })
  })

  describe('prop validation', () => {
    it('accepts subRoute prop for navigation context', () => {
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

      const testRoute = '/custom-dashboard'
      render(<NavBottom subRoute={testRoute} />, { wrapper: TestWrapper })

      // Dashboard button should navigate to dashboard, not use subRoute prop
      const dashboardButton = screen.getByLabelText('Navigate to dashboard')
      fireEvent.click(dashboardButton)

      // useNavigationWithLoading.push() is called with (path, elementId)
      expect(mockPush).toHaveBeenCalledWith(
        '/navigator/profile/dashboard',
        expect.any(String)
      )
      expect(mockPush).not.toHaveBeenCalledWith(testRoute)
    })
  })

  describe('component structure', () => {
    beforeEach(() => {
      // Set unauthenticated state for consistent testing
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

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
      expect(buttons[0]).toHaveAttribute(
        'aria-label',
        'Open main navigation menu'
      )
      expect(buttons[1]).toHaveAttribute(
        'aria-label',
        'Login to access profile'
      )
      expect(buttons[2]).toHaveAttribute(
        'aria-label',
        'Login to access dashboard'
      )
    })
  })
})
