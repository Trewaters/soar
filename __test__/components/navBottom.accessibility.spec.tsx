import React from 'react'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { axe, toHaveNoViolations } from 'jest-axe'
import { theme } from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import NavBottom from '../../components/navBottom'

// Add jest-axe matcher
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
jest.mock('@mui/icons-material/Menu', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-icon" />,
}))

jest.mock('@mui/icons-material/Person', () => ({
  __esModule: true,
  default: () => <div data-testid="person-icon" />,
}))

jest.mock('@mui/icons-material/ArrowBack', () => ({
  __esModule: true,
  default: () => <div data-testid="arrow-back-icon" />,
}))

const { useRouter } = require('next/navigation')
const { useSession } = require('next-auth/react')

const renderWithProviders = (
  component: React.ReactElement,
  session: any = null
) => {
  useRouter.mockReturnValue({
    push: mockPush,
    back: mockBack,
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  })

  useSession.mockReturnValue({
    data: session,
    status: session ? 'authenticated' : 'unauthenticated',
  })

  return render(
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <NavigationLoadingProvider>{component}</NavigationLoadingProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

describe('NavBottom Accessibility Tests', () => {
  it('should not have accessibility violations when unauthenticated', async () => {
    const mockMenuToggle = jest.fn()

    const { container } = renderWithProviders(
      <NavBottom subRoute="test" onMenuToggle={mockMenuToggle} />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when authenticated', async () => {
    const mockMenuToggle = jest.fn()
    const mockSession = {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    }

    const { container } = renderWithProviders(
      <NavBottom subRoute="test" onMenuToggle={mockMenuToggle} />,
      mockSession
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA labels for all buttons', () => {
    const mockMenuToggle = jest.fn()

    renderWithProviders(
      <NavBottom subRoute="test" onMenuToggle={mockMenuToggle} />
    )

    expect(screen.getByLabelText('Menu')).toBeInTheDocument()
    expect(screen.getByLabelText('Profile')).toBeInTheDocument()
    expect(screen.getByLabelText('Back')).toBeInTheDocument()
  })

  it('should have proper navigation structure', () => {
    const mockMenuToggle = jest.fn()

    renderWithProviders(
      <NavBottom subRoute="test" onMenuToggle={mockMenuToggle} />
    )

    const nav = screen.getByRole('navigation', { name: 'Bottom navigation' })
    expect(nav).toBeInTheDocument()

    // Check that all buttons are within the navigation
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)

    buttons.forEach((button) => {
      expect(nav).toContainElement(button)
    })
  })

  it('should indicate disabled state for profile button when unauthenticated', () => {
    const mockMenuToggle = jest.fn()

    renderWithProviders(
      <NavBottom subRoute="test" onMenuToggle={mockMenuToggle} />
    )

    const profileButton = screen.getByLabelText('Profile')
    expect(profileButton).toBeDisabled()
  })

  it('should indicate enabled state for profile button when authenticated', () => {
    const mockMenuToggle = jest.fn()
    const mockSession = {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    }

    renderWithProviders(
      <NavBottom subRoute="test" onMenuToggle={mockMenuToggle} />,
      mockSession
    )

    const profileButton = screen.getByLabelText('Profile')
    expect(profileButton).toBeEnabled()
  })
})
