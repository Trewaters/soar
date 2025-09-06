import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import LibraryPage from '@app/navigator/profile/library/page'

// Create a basic theme for testing
const theme = createTheme()

// Mock all the external dependencies
jest.mock('next-auth/react')
jest.mock('next/navigation')
jest.mock('@app/context/UserContext')
jest.mock('@lib/userLibraryService')

// Mock the ProfileNavMenu and ImageManagement components
jest.mock('@app/navigator/profile/ProfileNavMenu', () => {
  return function MockProfileNavMenu() {
    return <div data-testid="profile-nav-menu">Profile Nav Menu</div>
  }
})

jest.mock('@app/clientComponents/imageUpload/ImageManagement', () => {
  return function MockImageManagement() {
    return <div data-testid="image-management">Image Management</div>
  }
})

// Mock the library service functions
const mockGetUserCreatedAsanas = jest.fn()
const mockGetUserCreatedSeries = jest.fn()
const mockGetUserCreatedSequences = jest.fn()

jest.mock('@lib/userLibraryService', () => ({
  getUserCreatedAsanas: () => mockGetUserCreatedAsanas(),
  getUserCreatedSeries: () => mockGetUserCreatedSeries(),
  getUserCreatedSequences: () => mockGetUserCreatedSequences(),
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

// Mock session
const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date().toISOString(),
}

// Mock UseUser hook
const mockUserState = {
  userData: {
    profileImages: ['image1.jpg', 'image2.jpg'], // 2 profile images
    activeProfileImage: 'image1.jpg',
    image: '/placeholder.png',
  },
}

const mockDispatch = jest.fn()

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock UserContext
jest.mock('@app/context/UserContext', () => ({
  UseUser: () => ({
    state: mockUserState,
    dispatch: mockDispatch,
  }),
}))

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: mockSession,
    status: 'authenticated',
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('LibraryPage Profile Images Tab Count', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedAsanas.mockResolvedValue([])
    mockGetUserCreatedSeries.mockResolvedValue([])
    mockGetUserCreatedSequences.mockResolvedValue([])
  })

  it('should display profile images count in the tab label', async () => {
    render(<LibraryPage />, { wrapper: TestWrapper })

    // Wait for the component to load
    await screen.findByText('My Library')

    // Check that the Profile Images tab shows the correct count
    const profileImagesTab = screen.getByRole('tab', {
      name: /Profile Images \(2\)/i,
    })
    expect(profileImagesTab).toBeInTheDocument()
  })

  it('should display zero count when no profile images exist', async () => {
    // Update mock to have no profile images
    const mockUserStateEmpty = {
      userData: {
        profileImages: [],
        activeProfileImage: null,
        image: '/placeholder.png',
      },
    }

    jest.mocked(require('@app/context/UserContext').UseUser).mockReturnValue({
      state: mockUserStateEmpty,
      dispatch: mockDispatch,
    })

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Wait for the component to load
    await screen.findByText('My Library')

    // Check that the Profile Images tab shows zero count
    const profileImagesTab = screen.getByRole('tab', {
      name: /Profile Images \(0\)/i,
    })
    expect(profileImagesTab).toBeInTheDocument()
  })

  it('should display other tab counts correctly', async () => {
    // Mock some data for other tabs
    mockGetUserCreatedAsanas.mockResolvedValue([
      { id: 'asana1', sort_english_name: 'Test Asana' },
    ])
    mockGetUserCreatedSeries.mockResolvedValue([
      { id: 'series1', name: 'Test Series' },
      { id: 'series2', name: 'Test Series 2' },
    ])
    mockGetUserCreatedSequences.mockResolvedValue([])

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Wait for the component to load
    await screen.findByText('My Library')

    // Check all tab counts
    expect(
      screen.getByRole('tab', { name: /Asanas \(1\)/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /Series \(2\)/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /Sequences \(0\)/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /Profile Images \(2\)/i })
    ).toBeInTheDocument()
  })
})
