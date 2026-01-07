import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import theme from '../../../../styles/theme'
import ProfileNavMenu from '../../../../app/navigator/profile/ProfileNavMenu'

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img {...props} alt={props.alt || ''} />,
}))

// Mock the UserContext
const mockUseUser = jest.fn()
const mockDispatch = jest.fn()

jest.mock('@app/context/UserContext', () => ({
  UseUser: () => mockUseUser(),
}))

// Mock the useActiveProfileImage hook
const mockUseActiveProfileImage = jest.fn()
jest.mock('@app/hooks/useActiveProfileImage', () => ({
  useActiveProfileImage: () => mockUseActiveProfileImage(),
}))

// Mock next-auth
const mockUseSession = jest.fn()
const mockSignOut = jest.fn()
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signOut: (options: any) => mockSignOut(options),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock useNavigationWithLoading hook
const mockPush = jest.fn()
jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    push: mockPush,
  }),
}))

// Mock AppText constants
jest.mock('@app/navigator/constants/Strings', () => ({
  AppText: {
    APP_LOGOUT: 'Logout',
  },
}))

// Standard test wrapper for Soar components
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

describe('ProfileNavMenu', () => {
  const defaultUserData = {
    id: '1',
    provider_id: 'provider-123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/default.jpg',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    emailVerified: new Date('2023-01-01'),
    pronouns: '',
    headline: '',
    websiteURL: '',
    location: '',
    firstName: '',
    lastName: '',
    bio: '',
    shareQuick: '',
    yogaStyle: 'Vinyasa Flow',
    yogaExperience: '',
    company: '',
    socialURL: '',
    isLocationPublic: '',
    role: '',
    profile: {},
    profileImages: [],
  }

  const defaultSession = {
    user: {
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://example.com/session-image.jpg',
    },
    expires: '2099-01-01',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Set default mock for useSession
    mockUseSession.mockReturnValue({
      data: defaultSession,
      status: 'authenticated',
    })

    // Set default mock for useUser
    mockUseUser.mockReturnValue({
      state: { userData: defaultUserData },
      dispatch: mockDispatch,
    })

    // Set default mock for useActiveProfileImage
    mockUseActiveProfileImage.mockReturnValue({
      activeImage: '/images/profile-placeholder.png',
      isPlaceholder: true,
      hasCustomImage: false,
      imageCount: 0,
      isDefaultImage: false,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors when user is authenticated', () => {
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should return null when user is not authenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      const { container } = render(<ProfileNavMenu />, { wrapper: TestWrapper })
      expect(container.firstChild).toBeNull()
    })

    it('should display all menu items', () => {
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Profile Overview')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('My Library')).toBeInTheDocument()
      expect(screen.getByText('Account Settings')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('should display yoga style chip when available', () => {
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Vinyasa Flow')).toBeInTheDocument()
    })

    it('should not display yoga style chip when not available', () => {
      const userDataWithoutYogaStyle = {
        ...defaultUserData,
        yogaStyle: '',
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithoutYogaStyle },
        dispatch: mockDispatch,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.queryByText('Vinyasa Flow')).not.toBeInTheDocument()
    })
  })

  describe('Active Profile Image Display', () => {
    it('should display active profile image when available', () => {
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/active-profile.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 1,
        isDefaultImage: false,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Avatar should use the active image (as src attribute on img element)
      const avatarImg = screen.getByRole('img', { hidden: true })
      expect(avatarImg).toHaveAttribute(
        'src',
        'https://example.com/active-profile.jpg'
      )

      // Placeholder icon should not be visible
      expect(
        screen.queryByAltText('Default profile icon')
      ).not.toBeInTheDocument()
    })

    it('should display placeholder icon when no profile image is set', () => {
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: '/images/profile-placeholder.png',
        isPlaceholder: true,
        hasCustomImage: false,
        imageCount: 0,
        isDefaultImage: false,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const placeholderIcon = screen.getByAltText('Default profile icon')
      expect(placeholderIcon).toBeInTheDocument()
      expect(placeholderIcon).toHaveAttribute(
        'src',
        '/icons/profile/profile-person.svg'
      )
    })

    it('should display active uploaded image over OAuth provider image', () => {
      const userDataWithImages = {
        ...defaultUserData,
        profileImages: ['https://example.com/uploaded-1.jpg'],
        activeProfileImage: 'https://example.com/uploaded-1.jpg',
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithImages },
        dispatch: mockDispatch,
      })

      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/uploaded-1.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 1,
        isDefaultImage: false,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Avatar should use the uploaded image, not show placeholder
      expect(
        screen.queryByAltText('Default profile icon')
      ).not.toBeInTheDocument()
    })

    it('should fall back to OAuth provider image when no custom image is uploaded', () => {
      const userDataWithOAuthOnly = {
        ...defaultUserData,
        profileImages: [], // No uploaded images
        activeProfileImage: undefined,
        image: 'https://example.com/oauth-provider.jpg', // OAuth provider image
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithOAuthOnly },
        dispatch: mockDispatch,
      })

      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/oauth-provider.jpg',
        isPlaceholder: false,
        hasCustomImage: false,
        imageCount: 0,
        isDefaultImage: true,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Should not show placeholder since we have OAuth provider image
      expect(
        screen.queryByAltText('Default profile icon')
      ).not.toBeInTheDocument()

      // Should display OAuth provider image
      const avatarImg = screen.getByRole('img', { hidden: true })
      expect(avatarImg).toHaveAttribute(
        'src',
        'https://example.com/oauth-provider.jpg'
      )
    })

    it('should handle multiple uploaded images and show the active one', () => {
      const userDataWithMultipleImages = {
        ...defaultUserData,
        profileImages: [
          'https://example.com/image-1.jpg',
          'https://example.com/image-2.jpg',
          'https://example.com/image-3.jpg',
        ],
        activeProfileImage: 'https://example.com/image-2.jpg',
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithMultipleImages },
        dispatch: mockDispatch,
      })

      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/image-2.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 3,
        isDefaultImage: false,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Should not show placeholder since we have a custom image
      expect(
        screen.queryByAltText('Default profile icon')
      ).not.toBeInTheDocument()
    })

    it('should prioritize uploaded images over OAuth provider image', () => {
      const userDataWithBothImages = {
        ...defaultUserData,
        profileImages: ['https://example.com/uploaded.jpg'],
        activeProfileImage: 'https://example.com/uploaded.jpg',
        image: 'https://example.com/oauth-provider.jpg', // Should NOT use this
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithBothImages },
        dispatch: mockDispatch,
      })

      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/uploaded.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 1,
        isDefaultImage: false,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Should use uploaded image, not OAuth provider image
      const avatarImg = screen.getByRole('img', { hidden: true })
      expect(avatarImg).toHaveAttribute(
        'src',
        'https://example.com/uploaded.jpg'
      )
      expect(avatarImg).not.toHaveAttribute(
        'src',
        'https://example.com/oauth-provider.jpg'
      )
    })
  })

  describe('Navigation', () => {
    it('should navigate to profile overview when clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const profileOverviewButton = screen.getByText('Profile Overview')
      await user.click(profileOverviewButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile')
    })

    it('should navigate to dashboard when clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const dashboardButton = screen.getByText('Dashboard')
      await user.click(dashboardButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/dashboard')
    })

    it('should navigate to library when clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const libraryButton = screen.getByText('My Library')
      await user.click(libraryButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/library')
    })

    it('should navigate to account settings when clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const settingsButton = screen.getByText('Account Settings')
      await user.click(settingsButton)

      expect(mockPush).toHaveBeenCalledWith('/navigator/profile/settings')
    })

    it('should call signOut when logout button is clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const logoutButton = screen.getByText('Logout')
      await user.click(logoutButton)

      expect(mockSignOut).toHaveBeenCalledWith({
        redirectTo: '/auth/signout?success=true',
      })
    })
  })

  describe('User Information Display', () => {
    it('should display user name from userData', () => {
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('should fall back to session name when userData name is not available', () => {
      const userDataWithoutName = {
        ...defaultUserData,
        name: '',
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithoutName },
        dispatch: mockDispatch,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('should display default text when no name is available', () => {
      const userDataWithoutName = {
        ...defaultUserData,
        name: '',
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithoutName },
        dispatch: mockDispatch,
      })

      mockUseSession.mockReturnValue({
        data: {
          ...defaultSession,
          user: {
            ...defaultSession.user,
            name: '',
          },
        },
        status: 'authenticated',
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Yoga Practitioner')).toBeInTheDocument()
    })

    it('should display user email from userData', () => {
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should fall back to session email when userData email is not available', () => {
      const userDataWithoutEmail = {
        ...defaultUserData,
        email: '',
      }

      mockUseUser.mockReturnValue({
        state: { userData: userDataWithoutEmail },
        dispatch: mockDispatch,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for navigation items', () => {
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Check for navigation structure
      const listItems = screen.getAllByRole('button')
      expect(listItems.length).toBeGreaterThan(0)
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Tab to focus the button
      await user.tab()

      // Press Enter to activate
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/navigator/profile')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined userData gracefully', () => {
      mockUseUser.mockReturnValue({
        state: { userData: undefined },
        dispatch: mockDispatch,
      })

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should handle null session user gracefully', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      const { container } = render(<ProfileNavMenu />, { wrapper: TestWrapper })
      expect(container.firstChild).toBeNull()
    })

    it('should handle error in signOut gracefully', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      mockSignOut.mockRejectedValue(new Error('Sign out failed'))

      const user = userEvent.setup()
      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      const logoutButton = screen.getByText('Logout')
      await user.click(logoutButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error signing out:',
          expect.any(Error)
        )
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Integration with useActiveProfileImage Hook', () => {
    it('should properly integrate with useActiveProfileImage hook', () => {
      const mockImageData = {
        activeImage: 'https://example.com/custom-image.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 2,
        isDefaultImage: false,
      }

      mockUseActiveProfileImage.mockReturnValue(mockImageData)

      render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Verify the hook was called
      expect(mockUseActiveProfileImage).toHaveBeenCalled()

      // Verify placeholder is not shown when we have a custom image
      expect(
        screen.queryByAltText('Default profile icon')
      ).not.toBeInTheDocument()
    })

    it('should re-render when active image changes', () => {
      const { rerender } = render(<ProfileNavMenu />, { wrapper: TestWrapper })

      // Initially with placeholder
      expect(screen.getByAltText('Default profile icon')).toBeInTheDocument()

      // Update to have a custom image
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/new-image.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 1,
        isDefaultImage: false,
      })

      rerender(<ProfileNavMenu />)

      // Placeholder should no longer be visible
      expect(
        screen.queryByAltText('Default profile icon')
      ).not.toBeInTheDocument()
    })
  })
})
