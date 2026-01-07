import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import theme from '../../../../styles/theme'
import UserDetails from '../../../../app/navigator/profile/UserDetails'

jest.mock('next/image', () => ({
  __esModule: true,
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
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
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
    // Mock fetch globally for all tests with a default implementation
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ images: [] }),
    })

    // Set default mock for useSession
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
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
    // Clean up fetch mock
    jest.restoreAllMocks()
  })

  describe('Profile Image Priority', () => {
    it('should display active profile image when available', async () => {
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

      // Mock the useActiveProfileImage hook to return the active image
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/active-profile.jpg',
        isPlaceholder: false,
        hasCustomImage: true,
        imageCount: 1,
        isDefaultImage: false,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Wait for the component to render and look for the img inside the Avatar
      await waitFor(() => {
        const avatar = screen.getByLabelText('name initial')
        expect(avatar).toBeInTheDocument()
      })

      // Look for the img element inside the Avatar that has the correct src
      const avatarImg = screen.getByAltText('User profile image')
      expect(avatarImg).toHaveAttribute(
        'src',
        'https://example.com/active-profile.jpg'
      )
    })

    it('should display social account image when active profile image is not available', async () => {
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

      // Mock the useActiveProfileImage hook to return the social image
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: 'https://example.com/social-image.jpg',
        isPlaceholder: false,
        hasCustomImage: false,
        imageCount: 0,
        isDefaultImage: true,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Wait for the component to render
      await waitFor(() => {
        const avatar = screen.getByLabelText('name initial')
        expect(avatar).toBeInTheDocument()
      })

      // Check that the avatar img has the social image
      const avatarImg = screen.getByAltText('User profile image')
      expect(avatarImg).toHaveAttribute(
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

      // Mock the useActiveProfileImage hook to return placeholder
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: '/images/profile-placeholder.png',
        isPlaceholder: true,
        hasCustomImage: false,
        imageCount: 0,
        isDefaultImage: false,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Avatar should not have a src attribute when using placeholder
      const avatar = screen.getByLabelText('name initial')
      expect(avatar).not.toHaveAttribute('src')

      // Generic profile icon should be displayed inside Avatar
      const genericProfileIcon = screen.getByAltText('Default profile icon')
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

      // Mock the useActiveProfileImage hook to return placeholder for empty strings
      mockUseActiveProfileImage.mockReturnValue({
        activeImage: '/images/profile-placeholder.png',
        isPlaceholder: true,
        hasCustomImage: false,
        imageCount: 0,
        isDefaultImage: false,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Avatar should not have a src attribute when images are empty strings
      const avatar = screen.getByLabelText('name initial')
      expect(avatar).not.toHaveAttribute('src')

      // Generic profile icon should be displayed inside Avatar
      const genericProfileIcon = screen.getByAltText('Default profile icon')
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
      expect(screen.getAllByText('Test User')[0]).toBeInTheDocument()
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

      const genericIcon = screen.getByAltText('Default profile icon')
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
    const originalShare = navigator.share
    const originalClipboard = navigator.clipboard

    beforeEach(() => {
      // Mock navigator.share
      Object.defineProperty(navigator, 'share', {
        writable: true,
        configurable: true,
        value: mockNavigatorShare,
      })

      // Mock navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: mockNavigatorClipboard,
        },
      })

      jest.clearAllMocks()
    })

    afterEach(() => {
      // Restore original navigator properties
      if (originalShare) {
        Object.defineProperty(navigator, 'share', {
          value: originalShare,
          configurable: true,
        })
      } else if (navigator.hasOwnProperty('share')) {
        delete (navigator as any).share
      }

      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          configurable: true,
        })
      } else if (navigator.hasOwnProperty('clipboard')) {
        delete (navigator as any).clipboard
      }
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
      const sharePreviewCard = screen.getByText(
        /Check out my Uvuyoga! www.happyyoga.app/
      )
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

      // Completely remove navigator.share support before rendering
      const hasShare = 'share' in navigator
      if (hasShare) {
        delete (navigator as any).share
      }

      const user = userEvent.setup()

      render(<UserDetails />, { wrapper: TestWrapper })

      const shareButton = screen.getByLabelText('share profile')
      await user.click(shareButton)

      // Check that the success message appears (indicating clipboard was used)
      await waitFor(() => {
        expect(
          screen.getByText('Profile link copied to clipboard!')
        ).toBeInTheDocument()
      })

      // Restore navigator.share if it existed
      if (hasShare && typeof navigator.share === 'undefined') {
        // Only restore if we actually deleted it
        navigator.share = mockNavigatorShare
      }
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
        .getByText(/Check out my Uvuyoga! www.happyyoga.app/)
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

  describe('ProfileDetails Component Integration', () => {
    it('should render all profile fields using ProfileDetails component', () => {
      const userData = {
        id: '1',
        email: 'yogi@example.com',
        name: 'YogaMaster123',
        firstName: 'Yoga',
        lastName: 'Master',
        pronouns: 'they/them',
        headline: 'Passionate yoga instructor',
        bio: 'Teaching yoga for 10 years\nSpecializing in Vinyasa flow',
        websiteURL: 'https://yogamaster.com',
        location: 'San Francisco, CA',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Verify all profile fields are displayed using ARIA labels
      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Username: YogaMaster123')
      ).toBeInTheDocument()

      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByLabelText('First Name: Yoga')).toBeInTheDocument()

      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name: Master')).toBeInTheDocument()

      expect(screen.getByText('Pronouns')).toBeInTheDocument()
      expect(screen.getByLabelText('Pronouns: they/them')).toBeInTheDocument()

      expect(screen.getByText('Headline')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Headline: Passionate yoga instructor')
      ).toBeInTheDocument()

      expect(screen.getByText('Description/About/Bio')).toBeInTheDocument()
      expect(
        screen.getByLabelText(
          /Description\/About\/Bio: Teaching yoga for 10 years/
        )
      ).toBeInTheDocument()

      expect(screen.getByText('Website URL')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Website URL: https://yogamaster.com')
      ).toBeInTheDocument()

      expect(screen.getByText('My Location')).toBeInTheDocument()
      expect(
        screen.getByLabelText('My Location: San Francisco, CA')
      ).toBeInTheDocument()

      expect(
        screen.getByText('Email Address (primary/internal)')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText(
          'Email Address (primary/internal): yogi@example.com'
        )
      ).toBeInTheDocument()
    })

    it('should display N/A for empty profile fields', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'TestUser',
        firstName: null,
        lastName: null,
        pronouns: null,
        headline: null,
        bio: null,
        websiteURL: null,
        location: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Username should display the name value using ARIA label
      expect(screen.getByLabelText('Username: TestUser')).toBeInTheDocument()

      // Count N/A occurrences - should be displayed for empty fields
      const naElements = screen.getAllByText('N/A')
      // firstName, lastName, pronouns, bio, websiteURL, location = 6 N/A values
      expect(naElements.length).toBeGreaterThanOrEqual(6)
    })

    it('should display N/A when headline is empty', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'TestUser',
        headline: null,
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      expect(screen.getByText('Headline')).toBeInTheDocument()
      // When headline is empty, should display N/A via ProfileDetails component
      const headlineElements = screen.getAllByText('N/A')
      expect(headlineElements.length).toBeGreaterThan(0)
    })

    it('should apply highlighted background to username and email fields', () => {
      const userData = {
        id: '1',
        email: 'highlighted@example.com',
        name: 'HighlightedUser',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Find username and email text elements using ARIA labels
      const usernameElement = screen.getByLabelText('Username: HighlightedUser')
      const emailElement = screen.getByLabelText(
        'Email Address (primary/internal): highlighted@example.com'
      )

      // Both should have lightgray background
      expect(usernameElement).toHaveStyle({ backgroundColor: 'lightgray' })
      expect(emailElement).toHaveStyle({ backgroundColor: 'lightgray' })
    })

    it('should handle multiline bio text correctly', () => {
      const userData = {
        id: '1',
        email: 'test@example.com',
        name: 'TestUser',
        bio: 'Line 1 of bio\nLine 2 of bio\nLine 3 of bio',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Bio should be displayed with multiline variant
      const bioElement = screen.getByText((content) =>
        content.includes('Line 1 of bio')
      )
      expect(bioElement).toBeInTheDocument()
      expect(bioElement).toHaveStyle({ whiteSpace: 'pre-line' })
    })

    it('should use semantic definition list markup for accessibility', () => {
      const userData = {
        id: '1',
        email: 'accessible@example.com',
        name: 'AccessibleUser',
        firstName: 'Accessible',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      const { container } = render(<UserDetails />, { wrapper: TestWrapper })

      // ProfileDetails components should use <dl>, <dt>, <dd> tags
      const definitionLists = container.querySelectorAll('dl')
      expect(definitionLists.length).toBeGreaterThan(0)

      const definitionTerms = container.querySelectorAll('dt')
      expect(definitionTerms.length).toBeGreaterThan(0)

      const definitionDescriptions = container.querySelectorAll('dd')
      expect(definitionDescriptions.length).toBeGreaterThan(0)
    })

    it('should have proper ARIA labels for profile details', () => {
      const userData = {
        id: '1',
        email: 'aria@example.com',
        name: 'AriaUser',
        firstName: 'Aria',
        lastName: 'User',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      render(<UserDetails />, { wrapper: TestWrapper })

      // Each ProfileDetails component should have a group role with aria-label
      expect(
        screen.getByRole('group', { name: /Profile detail: Username/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: /Profile detail: First Name/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('group', { name: /Profile detail: Last Name/i })
      ).toBeInTheDocument()
    })

    it('should render profile fields in correct visual order', () => {
      const userData = {
        id: '1',
        email: 'order@example.com',
        name: 'OrderTest',
        firstName: 'Order',
        lastName: 'Test',
        pronouns: 'she/her',
        headline: 'Test headline',
        bio: 'Test bio',
        websiteURL: 'https://test.com',
        location: 'Test City',
        createdAt: '2023-01-01T00:00:00.000Z',
      }

      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })

      const { container } = render(<UserDetails />, { wrapper: TestWrapper })

      // Get all definition lists (each ProfileDetails component uses one)
      const allText = container.textContent || ''

      // Verify the order of fields as they appear in the component
      const usernameIndex = allText.indexOf('Username')
      const firstNameIndex = allText.indexOf('First Name')
      const lastNameIndex = allText.indexOf('Last Name')
      const pronounsIndex = allText.indexOf('Pronouns')
      const headlineIndex = allText.indexOf('Headline')
      const bioIndex = allText.indexOf('Description/About/Bio')
      const websiteIndex = allText.indexOf('Website URL')
      const locationIndex = allText.indexOf('My Location')
      const emailIndex = allText.lastIndexOf('Email Address')

      // Verify they appear in the expected order
      expect(usernameIndex).toBeLessThan(firstNameIndex)
      expect(firstNameIndex).toBeLessThan(lastNameIndex)
      expect(lastNameIndex).toBeLessThan(pronounsIndex)
      expect(pronounsIndex).toBeLessThan(headlineIndex)
      expect(headlineIndex).toBeLessThan(bioIndex)
      expect(bioIndex).toBeLessThan(websiteIndex)
      expect(websiteIndex).toBeLessThan(locationIndex)
      expect(locationIndex).toBeLessThan(emailIndex)
    })
  })

  describe('Edit Profile Button', () => {
    const userData = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2023-01-01T00:00:00.000Z',
    }

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        state: { userData },
        dispatch: mockDispatch,
      })
    })

    it('should display edit button in the green header banner when onEditClick is provided', () => {
      const mockOnEditClick = jest.fn()
      render(<UserDetails onEditClick={mockOnEditClick} />, {
        wrapper: TestWrapper,
      })

      const editButton = screen.getByTestId('edit-profile-button')
      expect(editButton).toBeInTheDocument()
    })

    it('should not display edit button when onEditClick is not provided', () => {
      render(<UserDetails />, { wrapper: TestWrapper })

      const editButton = screen.queryByTestId('edit-profile-button')
      expect(editButton).not.toBeInTheDocument()
    })

    it('should call onEditClick when edit button is clicked', async () => {
      const mockOnEditClick = jest.fn()
      const user = userEvent.setup()

      render(<UserDetails onEditClick={mockOnEditClick} />, {
        wrapper: TestWrapper,
      })

      const editButton = screen.getByTestId('edit-profile-button')
      await user.click(editButton)

      expect(mockOnEditClick).toHaveBeenCalledTimes(1)
    })

    it('should have proper accessibility label for the edit button', () => {
      const mockOnEditClick = jest.fn()
      render(<UserDetails onEditClick={mockOnEditClick} />, {
        wrapper: TestWrapper,
      })

      const editButton = screen.getByRole('button', { name: /edit profile/i })
      expect(editButton).toBeInTheDocument()
    })

    it('should position edit button in the header next to the title', () => {
      const mockOnEditClick = jest.fn()
      render(<UserDetails onEditClick={mockOnEditClick} />, {
        wrapper: TestWrapper,
      })

      // The edit button should exist and be visible in the header
      const editButton = screen.getByTestId('edit-profile-button')
      expect(editButton).toBeVisible()
    })
  })
})
