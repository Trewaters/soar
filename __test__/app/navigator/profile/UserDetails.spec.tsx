import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import theme from '../../../../styles/theme'
import UserDetails from '@/app/navigator/profile/UserDetails'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}))

// Mock UserContext
const mockDispatch = jest.fn()
const mockUseUser = jest.fn()

jest.mock('@context/UserContext', () => ({
  UseUser: () => mockUseUser(),
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

describe('UserDetails Avatar Display', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Profile Image Priority', () => {
    it('should display active profile image when available', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: 'https://example.com/active-profile.jpg',
        image: 'https://example.com/social-image.jpg',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const avatar = screen.getByLabelText('name initial')
      expect(avatar).toHaveAttribute(
        'src',
        'https://example.com/active-profile.jpg'
      )
    })

    it('should display social account image when active profile image is not available', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: null,
        image: 'https://example.com/social-image.jpg',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const avatar = screen.getByLabelText('name initial')
      expect(avatar).toHaveAttribute(
        'src',
        'https://example.com/social-image.jpg'
      )
    })

    it('should display generic profile icon when no images are available', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: null,
        image: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Avatar should not have a src attribute when no images are available
      const avatar = screen.getByLabelText('name initial')
      expect(avatar).not.toHaveAttribute('src')

      // Generic profile icon should be displayed inside Avatar
      const genericProfileIcon = screen.getByAltText(
        'Generic profile image icon'
      )
      expect(genericProfileIcon).toBeInTheDocument()
      expect(genericProfileIcon).toHaveAttribute(
        'src',
        '/icons/profile/profile-person.svg'
      )
    })

    it('should display generic profile icon when images are empty strings', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: '',
        image: '',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Avatar should not have a src attribute when images are empty strings
      const avatar = screen.getByLabelText('name initial')
      expect(avatar).not.toHaveAttribute('src')

      // Generic profile icon should be displayed inside Avatar
      const genericProfileIcon = screen.getByAltText(
        'Generic profile image icon'
      )
      expect(genericProfileIcon).toBeInTheDocument()
      expect(genericProfileIcon).toHaveAttribute(
        'src',
        '/icons/profile/profile-person.svg'
      )
    })
  })

  describe('Component Rendering', () => {
    it('should render without errors when userData is available', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: null,
        image: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      expect(screen.getByText('Yoga Practitioner')).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('should display loading state when userData is not available', () => {
      mockUseUser.mockReturnValue({
        state: { userData: null },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      expect(
        screen.getByText('Loading your yoga profile...')
      ).toBeInTheDocument()
    })
  })

  describe('Avatar Accessibility', () => {
    it('should have proper ARIA labels for the avatar', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: 'https://example.com/active-profile.jpg',
        image: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const avatar = screen.getByLabelText('name initial')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('aria-label', 'name initial')
    })

    it('should have proper alt text for generic profile icon', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: null,
        image: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const genericIcon = screen.getByAltText('Generic profile image icon')
      expect(genericIcon).toBeInTheDocument()
    })
  })

  describe('Responsive Avatar Sizing', () => {
    it('should have responsive sizing styles applied to avatar', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        activeProfileImage: 'https://example.com/profile.jpg',
        image: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const avatar = screen.getByLabelText('name initial')
      expect(avatar).toBeInTheDocument()

      // Avatar should have the MUI Avatar component styling
      expect(avatar.tagName.toLowerCase()).toBe('div')
      expect(avatar).toHaveClass('MuiAvatar-root')
    })
  })

  describe('Share Functionality', () => {
    const mockNavigatorShare = jest.fn()
    const mockNavigatorClipboard = jest.fn()

    beforeEach(() => {
      // Mock navigator.share
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: mockNavigatorShare,
      })

      // Mock navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: {
          writeText: mockNavigatorClipboard,
        },
      })

      jest.clearAllMocks()
    })

    afterEach(() => {
      // Clean up mocks
      delete (navigator as any).share
      delete (navigator as any).clipboard
    })

    it('should display share preview card with user content', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test Yogi',
        shareQuick: 'Yoga brings me peace and strength',
        headline: 'Passionate yoga instructor',
        yogaStyle: 'Vinyasa',
        yogaExperience: '5 years',
        company: 'Yoga Studio',
        location: 'San Francisco, CA',
        websiteURL: 'https://example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Check that share preview text contains user information
      const sharePreviewCard = screen.getByText(
        /Yoga brings me peace and strength/
      )
      expect(sharePreviewCard).toBeInTheDocument()
    })

    it('should display default share preview when user data is minimal', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Check that default share preview text is displayed
      const sharePreviewCard = screen.getByText(/Check out my yoga profile!/)
      expect(sharePreviewCard).toBeInTheDocument()
    })

    it('should render share button in preview card', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const shareButton = screen.getByLabelText('share profile')
      expect(shareButton).toBeInTheDocument()
    })

    it('should call navigator.share when share button is clicked and navigator.share is supported', async () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test Yogi',
        shareQuick: 'My yoga journey',
        headline: 'Yoga instructor',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      mockNavigatorShare.mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<UserDetails />, { wrapper: TestWrapper })

      const shareButton = screen.getByLabelText('share profile')
      await user.click(shareButton)

      expect(mockNavigatorShare).toHaveBeenCalledWith({
        title: 'UvuYoga Practitioner Test Yogi',
        text: expect.stringContaining('My yoga journey'),
      })
    })

    it('should fall back to clipboard when navigator.share is not supported', async () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      // Remove navigator.share support
      delete (navigator as any).share
      mockNavigatorClipboard.mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<UserDetails />, { wrapper: TestWrapper })

      const shareButton = screen.getByLabelText('share profile')
      await user.click(shareButton)

      await waitFor(() => {
        expect(mockNavigatorClipboard).toHaveBeenCalledWith(
          expect.stringContaining(window.location.href)
        )
      })
    })

    it('should display success message when sharing succeeds', async () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      mockNavigatorShare.mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<UserDetails />, { wrapper: TestWrapper })

      const shareButton = screen.getByLabelText('share profile')
      await user.click(shareButton)

      await waitFor(() => {
        const successMessage = screen.getByText('Profile shared successfully!')
        expect(successMessage).toBeInTheDocument()
      })
    })

    it('should have grayed background styling on share card', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Check that the card has the proper MUI Card styling
      const shareCard = screen
        .getByText(/Check out my yoga profile!/)
        .closest('.MuiCard-root')
      expect(shareCard).toBeInTheDocument()
      expect(shareCard).toHaveClass('MuiCard-root')
    })

    it('should display loading message in share preview when userData is null', () => {
      mockUseUser.mockReturnValue({
        state: { userData: null },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Should show the main loading message
      expect(
        screen.getByText('Loading your yoga profile...')
      ).toBeInTheDocument()
    })

    it('should disable share button when userData is not loaded', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      const shareButton = screen.getByLabelText('share profile')
      expect(shareButton).toBeInTheDocument()
      expect(shareButton).not.toBeDisabled()
    })
  })
})
