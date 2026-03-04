import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import Header from '../../components/header'
import { testNavigationAccessibility } from '../accessibility/axe-test-utils'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
    update: jest.fn(),
  }),
}))

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

// Test wrapper component with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

describe('Header Accessibility Tests', () => {
  it('should not have accessibility violations in closed state', async () => {
    const { container } = render(<Header />, { wrapper: TestWrapper })
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with drawer open', async () => {
    const { container } = render(<Header />, { wrapper: TestWrapper })

    // Open the drawer
    const menuButton = screen.getByRole('button', {
      name: /open main navigation/i,
    })
    fireEvent.click(menuButton)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should pass navigation-specific accessibility tests', async () => {
    await testNavigationAccessibility(<Header />, { wrapper: TestWrapper })
  })

  it('should have proper keyboard navigation support', async () => {
    render(<Header />, { wrapper: TestWrapper })

    const menuButton = screen.getByRole('button', {
      name: /open main navigation/i,
    })

    // Test keyboard accessibility
    menuButton.focus()
    expect(menuButton).toHaveFocus()

    // Test click activation (MUI handles keyboard events internally)
    fireEvent.click(menuButton)

    // Wait for drawer to open and navigation to be accessible
    await screen.findByRole('navigation', {
      name: /main navigation menu/i,
    })

    const navigation = screen.getByRole('navigation', {
      name: /main navigation menu/i,
    })
    expect(navigation).toBeInTheDocument()
  })

  it('should have proper ARIA attributes for navigation', () => {
    render(<Header />, { wrapper: TestWrapper })

    const menuButton = screen.getByRole('button', {
      name: /open main navigation/i,
    })

    expect(menuButton).toHaveAttribute('aria-label', 'Open main navigation')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    // aria-controls should not be present when drawer is closed
    expect(menuButton).not.toHaveAttribute('aria-controls')

    // Open the drawer and check aria-controls
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(menuButton).toHaveAttribute('aria-controls', 'main-navigation')
  })

  it('should have accessible logo with proper alt text', () => {
    render(<Header />, { wrapper: TestWrapper })

    const logo = screen.getByRole('img', { name: /soar yoga main logo/i })
    expect(logo).toHaveAttribute('alt', 'Soar Yoga main logo')
  })
})
