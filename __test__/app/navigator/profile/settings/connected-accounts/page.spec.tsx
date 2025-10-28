import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConnectedAccountsPage from '@app/navigator/profile/settings/connected-accounts/page'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material'
import theme from '@styles/theme'
import { UseUser } from '@context/UserContext'
import React from 'react'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/navigator/profile/settings/connected-accounts'),
}))

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock NextAuth
const mockUseSession = jest.fn()
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useSession: () => mockUseSession(),
  signOut: jest.fn(),
}))

// Mock UserContext
jest.mock('@context/UserContext', () => ({
  UseUser: jest.fn(),
  UserStateProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Mock ProfileNavMenu
jest.mock('@app/navigator/profile/ProfileNavMenu', () => {
  return function MockProfileNavMenu() {
    return <div data-testid="profile-nav-menu">Profile Navigation Menu</div>
  }
})

// Mock auth
jest.mock('../../../../../../auth', () => ({
  auth: jest.fn(),
}))

// Mock hooks
jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@app/hooks/useActiveProfileImage', () => ({
  useActiveProfileImage: () => ({
    activeImage: '/icons/profile/profile-person.svg',
    isPlaceholder: true,
  }),
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('ConnectedAccountsPage', () => {
  const mockSession = {
    user: {
      id: 'user-123',
      name: 'Test Yogi',
      email: 'test@example.com',
      image: null,
    },
    expires: new Date().toISOString(),
  }

  const mockUserData = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test Yogi',
    username: 'testyogi',
    profileImage: '/icons/profile/profile-person.svg',
  }

  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(UseUser as jest.Mock).mockReturnValue({
      state: { userData: mockUserData },
      dispatch: mockDispatch,
    })
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })

    // Default mock for connected accounts API
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        accounts: [
          {
            provider: 'google',
            providerAccountId: 'google-123',
            connectedAt: new Date('2024-01-01'),
          },
          {
            provider: 'github',
            providerAccountId: 'github-456',
            connectedAt: new Date('2024-01-02'),
          },
        ],
        totalCount: 2,
      }),
    })
  })

  const renderPage = () => {
    return render(
      <ThemeProvider theme={theme}>
        <SessionProvider session={mockSession}>
          <ConnectedAccountsPage />
        </SessionProvider>
      </ThemeProvider>
    )
  }

  describe('Rendering', () => {
    it('should render the page without errors', async () => {
      renderPage()
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /Connected Accounts/i, level: 1 })
        ).toBeInTheDocument()
      })
    })

    it('should display loading state initially', () => {
      renderPage()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should display the ProfileNavMenu component', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByTestId('profile-nav-menu')).toBeInTheDocument()
      })
    })

    it('should render the back button to Account Settings', async () => {
      renderPage()
      await waitFor(() => {
        const backButton = screen.getByRole('link', {
          name: /Back to Account Settings/i,
        })
        expect(backButton).toBeInTheDocument()
        expect(backButton).toHaveAttribute(
          'href',
          '/navigator/profile/settings'
        )
      })
    })

    it('should display the "Add a new login method" button', async () => {
      renderPage()
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Add a new login method/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Connected Accounts List', () => {
    it('should fetch connected accounts on mount', async () => {
      renderPage()
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/user/connected-accounts',
          {
            cache: 'no-store',
          }
        )
      })
    })

    it('should display Google and GitHub as connected', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByText('Google')).toBeInTheDocument()
        expect(screen.getByText('GitHub')).toBeInTheDocument()
        const connectedStatuses = screen.getAllByText(/Status: Connected/i)
        expect(connectedStatuses).toHaveLength(2)
      })
    })

    it('should display Instagram as "Coming Soon"', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByText('Instagram')).toBeInTheDocument()
        expect(screen.getByText(/Status: Coming Soon/i)).toBeInTheDocument()
      })
    })

    it('should render account icons for all providers', async () => {
      renderPage()
      await waitFor(() => {
        const googleIcon = screen.getByAltText('Google icon')
        const instagramIcon = screen.getByAltText('Instagram icon')
        const githubIcon = screen.getByAltText('GitHub icon')

        expect(googleIcon).toBeInTheDocument()
        expect(instagramIcon).toBeInTheDocument()
        expect(githubIcon).toBeInTheDocument()

        expect(googleIcon).toHaveAttribute(
          'src',
          '/icons/profile/auth-google.svg'
        )
        expect(instagramIcon).toHaveAttribute(
          'src',
          '/icons/profile/auth-instagram.svg'
        )
        expect(githubIcon).toHaveAttribute(
          'src',
          '/icons/profile/auth-github-mark.svg'
        )
      })
    })

    it('should display disconnect buttons only for connected accounts', async () => {
      renderPage()
      await waitFor(() => {
        const googleDisconnect = screen.getByRole('button', {
          name: /Disconnect Google/i,
        })
        const githubDisconnect = screen.getByRole('button', {
          name: /Disconnect GitHub/i,
        })

        expect(googleDisconnect).toBeInTheDocument()
        expect(githubDisconnect).toBeInTheDocument()

        // Instagram should not have a disconnect button (coming soon)
        expect(
          screen.queryByRole('button', { name: /Disconnect Instagram/i })
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    it('should handle add new login method button click', async () => {
      const user = userEvent.setup()
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

      renderPage()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', {
        name: /Add a new login method/i,
      })
      await user.click(addButton)

      expect(alertSpy).toHaveBeenCalledWith(
        'Adding new login methods is coming soon!'
      )
      alertSpy.mockRestore()
    })

    it('should handle disconnect button click for Google', async () => {
      const user = userEvent.setup()
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)

      renderPage()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Google account disconnected successfully',
        }),
      })

      const disconnectButton = screen.getByRole('button', {
        name: /Disconnect Google/i,
      })
      await user.click(disconnectButton)

      expect(confirmSpy).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/user/connected-accounts',
        expect.objectContaining({
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'google' }),
        })
      )
      confirmSpy.mockRestore()
    })

    it('should prevent disconnecting when only one account is connected', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          accounts: [
            {
              provider: 'google',
              providerAccountId: 'google-123',
              connectedAt: new Date('2024-01-01'),
            },
          ],
          totalCount: 1,
        }),
      })

      renderPage()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })

      const disconnectButton = screen.getByRole('button', {
        name: /Disconnect Google/i,
      })

      // Button should be disabled when only one account is connected
      expect(disconnectButton).toBeDisabled()
    })

    it('should cancel disconnect when user declines confirmation', async () => {
      const user = userEvent.setup()
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)

      renderPage()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })

      const disconnectButton = screen.getByRole('button', {
        name: /Disconnect Google/i,
      })
      await user.click(disconnectButton)

      expect(confirmSpy).toHaveBeenCalled()
      // Should not make DELETE request
      expect(global.fetch).not.toHaveBeenCalledWith(
        '/api/user/connected-accounts',
        expect.objectContaining({ method: 'DELETE' })
      )
      confirmSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('should display error when fetch fails', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      renderPage()

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to load connected accounts/i)
        ).toBeInTheDocument()
      })
    })

    it('should handle disconnect API errors gracefully', async () => {
      const user = userEvent.setup()
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

      renderPage()

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to disconnect account' }),
      })

      const disconnectButton = screen.getByRole('button', {
        name: /Disconnect Google/i,
      })
      await user.click(disconnectButton)

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled()
      })

      confirmSpy.mockRestore()
      alertSpy.mockRestore()
    })
  })

  describe('Help Text', () => {
    it('should display help text about connected accounts', async () => {
      renderPage()

      await waitFor(() => {
        expect(
          screen.getByText(/You can connect multiple accounts/i)
        ).toBeInTheDocument()
        expect(
          screen.getByText(
            /Make sure you have at least one login method connected/i
          )
        ).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      renderPage()

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', {
          name: /Connected Accounts/i,
          level: 1,
        })
        expect(mainHeading).toBeInTheDocument()
      })
    })

    it('should have accessible button labels', async () => {
      renderPage()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Add a new login method/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /Disconnect Google/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /Disconnect GitHub/i })
        ).toBeInTheDocument()
      })
    })

    it('should have accessible links', async () => {
      renderPage()

      await waitFor(() => {
        const backLink = screen.getByRole('link', {
          name: /Back to Account Settings/i,
        })
        expect(backLink).toBeInTheDocument()
      })
    })

    it('should disable disconnect button when only one account connected', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          accounts: [
            {
              provider: 'google',
              providerAccountId: 'google-123',
              connectedAt: new Date('2024-01-01'),
            },
          ],
          totalCount: 1,
        }),
      })

      renderPage()

      await waitFor(() => {
        const disconnectButton = screen.getByRole('button', {
          name: /Disconnect Google/i,
        })
        expect(disconnectButton).toBeDisabled()
      })
    })
  })
})
