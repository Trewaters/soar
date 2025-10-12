import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import Header from '../../components/header'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/navigator',
}))

// Mock next-auth more thoroughly
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Import the mocked version
import { useSession } from 'next-auth/react'
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock Next.js components
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height, style }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={src} alt={alt} width={width} height={height} style={style} />
    )
  }
  MockImage.displayName = 'MockImage'
  return MockImage
})

// Mock MUI icons
jest.mock('@mui/icons-material/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-icon" />,
}))

jest.mock('@mui/icons-material/Menu', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-icon" />,
}))

jest.mock('@mui/icons-material/Flare', () => ({
  __esModule: true,
  default: () => <div data-testid="flare-icon" />,
}))

jest.mock('@mui/icons-material/WaterDropOutlined', () => ({
  __esModule: true,
  default: () => <div data-testid="waterdrop-icon" />,
}))

jest.mock('@mui/icons-material/Whatshot', () => ({
  __esModule: true,
  default: () => <div data-testid="whatshot-icon" />,
}))

jest.mock('@mui/icons-material/ManageAccounts', () => ({
  __esModule: true,
  default: () => <div data-testid="manage-accounts-icon" />,
}))

jest.mock('@mui/icons-material/AdminPanelSettings', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-panel-icon" />,
}))

jest.mock('@mui/icons-material/Info', () => ({
  __esModule: true,
  default: () => <div data-testid="info-icon" />,
}))

jest.mock('@mui/icons-material/MenuBook', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-book-icon" />,
}))

// Test wrapper component with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

describe('Header Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('renders the header with logo and menu button', () => {
      render(<Header />, { wrapper: TestWrapper })

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(
        screen.getByRole('img', { name: /soar yoga main logo/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /open main navigation/i })
      ).toBeInTheDocument()
    })

    it('shows Login option when user is not authenticated', () => {
      render(<Header />, { wrapper: TestWrapper })

      // Open the drawer
      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { email: 'test@example.com' },
          expires: '2023-10-05T14:48:00.000Z', // Add a mock expires value
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('shows Logout option when user is authenticated', () => {
      render(<Header />, { wrapper: TestWrapper })

      // Open the drawer
      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      expect(screen.getByText('Logout')).toBeInTheDocument()
      expect(screen.queryByText('Login')).not.toBeInTheDocument()
    })
  })

  describe('navigation drawer functionality', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('opens navigation drawer when menu button is clicked', () => {
      render(<Header />, { wrapper: TestWrapper })

      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      expect(
        screen.getByRole('navigation', { name: /main navigation menu/i })
      ).toBeInTheDocument()
    })

    it('renders all navigation links in the drawer', () => {
      render(<Header />, { wrapper: TestWrapper })

      // Open the drawer
      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      // Check for all navigation items
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('8 Limbs')).toBeInTheDocument()
      expect(screen.getByText('Asanas')).toBeInTheDocument()
      expect(screen.getByText('Series')).toBeInTheDocument()
      expect(screen.getByText('Sequences')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Glossary')).toBeInTheDocument()
    })

    it('has correct links for navigation items', () => {
      render(<Header />, { wrapper: TestWrapper })

      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
        'href',
        '/navigator'
      )
      expect(screen.getByRole('link', { name: /8 limbs/i })).toHaveAttribute(
        'href',
        '/navigator/eightLimbs'
      )
      expect(screen.getByRole('link', { name: /asanas/i })).toHaveAttribute(
        'href',
        '/navigator/asanaPoses'
      )
      expect(screen.getByRole('link', { name: /series/i })).toHaveAttribute(
        'href',
        '/navigator/flows/practiceSeries'
      )
      expect(screen.getByRole('link', { name: /sequences/i })).toHaveAttribute(
        'href',
        '/navigator/flows/practiceSequences'
      )
    })

    it('closes drawer when a navigation item is clicked', async () => {
      render(<Header />, { wrapper: TestWrapper })

      // Open the drawer
      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      // Click on a navigation item
      const homeLink = screen.getByRole('link', { name: /home/i })
      fireEvent.click(homeLink)

      // The drawer should close (navigation should not be visible)
      await waitFor(() => {
        expect(
          screen.queryByRole('navigation', { name: /main navigation menu/i })
        ).not.toBeInTheDocument()
      })
    })

    it('has proper accessibility attributes', () => {
      render(<Header />, { wrapper: TestWrapper })

      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      // Initially, aria-controls should not be present since drawer is closed
      expect(menuButton).not.toHaveAttribute('aria-controls')

      fireEvent.click(menuButton)

      // After clicking, aria-controls should be present since drawer is open
      expect(menuButton).toHaveAttribute('aria-controls', 'main-navigation')

      const navigation = screen.getByRole('navigation', {
        name: /main navigation menu/i,
      })
      expect(navigation).toBeInTheDocument()
    })

    it('has a divider before the auth link', () => {
      render(<Header />, { wrapper: TestWrapper })

      const menuButton = screen.getByRole('button', {
        name: /open main navigation/i,
      })
      fireEvent.click(menuButton)

      // The divider should be present in the DOM
      const divider = screen.getByRole('separator')
      expect(divider).toBeInTheDocument()
    })
  })

  describe('logo functionality', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })
    })

    it('logo links to home page', () => {
      render(<Header />, { wrapper: TestWrapper })

      const logoLink = screen.getByRole('link', {
        name: /soar yoga main logo/i,
      })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('logo has correct image attributes', () => {
      render(<Header />, { wrapper: TestWrapper })

      const logoImage = screen.getByRole('img', {
        name: /soar yoga main logo/i,
      })
      expect(logoImage).toHaveAttribute(
        'src',
        '/logo/Main Logo in Contrast Light150px.png'
      )
      expect(logoImage).toHaveAttribute('width', '150')
      expect(logoImage).toHaveAttribute('height', '20')
    })
  })
})
