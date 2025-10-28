import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
const mockUseUser = jest.fn()
jest.mock('@app/context/UserContext', () => ({
  UseUser: () => mockUseUser(),
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

    // Setup default UserContext mock
    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
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

    mockUseUser.mockReturnValue({
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

// Mock image service
const mockGetUserPoseImages = jest.fn()
jest.mock('@lib/imageService', () => ({
  getUserPoseImages: () => mockGetUserPoseImages(),
}))

describe('LibraryPage - AsanaCard Delete Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedSeries.mockResolvedValue([])
    mockGetUserCreatedSequences.mockResolvedValue([])
    mockGetUserPoseImages.mockResolvedValue({
      images: [
        {
          id: 'img1',
          url: '/test-image.jpg',
          altText: 'Test Asana',
        },
      ],
      totalCount: 1,
    })

    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should display delete icon on asana card', async () => {
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeInTheDocument()
  })

  it('should open confirmation dialog when delete icon is clicked', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Check that the dialog appears
    expect(screen.getByText('Delete Asana?')).toBeInTheDocument()
    expect(
      screen.getByText(/Are you sure you want to delete "Warrior Pose"/i)
    ).toBeInTheDocument()
  })

  it('should close dialog when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Dialog should be open
    expect(screen.getByText('Delete Asana?')).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Delete Asana?')).not.toBeInTheDocument()
    })
  })

  it('should handle delete confirmation', async () => {
    const user = userEvent.setup()
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Dialog should be open
    expect(screen.getByText('Delete Asana?')).toBeInTheDocument()

    const confirmDeleteButton = screen.getByRole('button', {
      name: /^delete$/i,
    })
    await user.click(confirmDeleteButton)

    // Check that delete was called (currently logs to console)
    expect(consoleLogSpy).toHaveBeenCalledWith('Delete asana:', 'asana1')

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Delete Asana?')).not.toBeInTheDocument()
    })

    consoleLogSpy.mockRestore()
  })

  it('should not trigger card navigation when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Router push should not be called for card navigation
    expect(mockPush).not.toHaveBeenCalledWith('/navigator/asanaPoses/asana1')

    // But dialog should be open
    expect(screen.getByText('Delete Asana?')).toBeInTheDocument()
  })
})

describe('LibraryPage - AsanaCard Click to View Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedSeries.mockResolvedValue([])
    mockGetUserCreatedSequences.mockResolvedValue([])
    mockGetUserPoseImages.mockResolvedValue({
      images: [
        {
          id: 'img1',
          url: '/test-image.jpg',
          altText: 'Test Asana',
        },
      ],
      totalCount: 1,
    })

    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should navigate to asana detail page when card is clicked', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    // Click on the card (not on the buttons)
    const cardName = screen.getByText('Warrior Pose')
    await user.click(cardName)

    // Should navigate to the asana detail page
    expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPoses/asana1')
  })

  it('should navigate to edit mode when edit button is clicked', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Should navigate to the asana detail page with edit=true parameter
    expect(mockPush).toHaveBeenCalledWith(
      '/navigator/asanaPoses/asana1?edit=true'
    )
  })

  it('should not trigger card navigation when edit button is clicked', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Should only be called once with the edit parameter
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(
      '/navigator/asanaPoses/asana1?edit=true'
    )
  })

  it('should display multiple asana cards and allow clicking each', async () => {
    const user = userEvent.setup()
    const mockAsanas = [
      {
        id: 'asana1',
        sort_english_name: 'Warrior Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'asana2',
        sort_english_name: 'Tree Pose',
        created_by: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedAsanas.mockResolvedValue(mockAsanas)

    render(<LibraryPage />, { wrapper: TestWrapper })

    await screen.findByText('Warrior Pose')
    await screen.findByText('Tree Pose')

    // Click on the first card
    const warriorCard = screen.getByText('Warrior Pose')
    await user.click(warriorCard)

    expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPoses/asana1')

    mockPush.mockClear()

    // Click on the second card
    const treeCard = screen.getByText('Tree Pose')
    await user.click(treeCard)

    expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPoses/asana2')
  })
})

describe('LibraryPage - SeriesCard and SequenceCard Click to View', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedAsanas.mockResolvedValue([])
    mockGetUserPoseImages.mockResolvedValue({ images: [], totalCount: 0 })

    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should navigate to series practice page when series card is clicked', async () => {
    const user = userEvent.setup()
    const mockSeries = [
      {
        id: 'series1',
        seriesName: 'Sun Salutation',
        description: 'A flowing series of poses',
        seriesPoses: ['Warrior I', 'Warrior II'],
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSeries.mockResolvedValue(mockSeries)
    mockGetUserCreatedSequences.mockResolvedValue([])

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    // Click on the series card
    const seriesCard = screen.getByText('Sun Salutation')
    await user.click(seriesCard)

    // Should navigate to the series practice page
    expect(mockPush).toHaveBeenCalledWith(
      '/navigator/flows/practiceSeries?id=series1'
    )
  })

  it('should navigate to sequence detail page when sequence card is clicked', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 'seq1',
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSeries.mockResolvedValue([])
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    // Click on the sequence card
    const sequenceCard = screen.getByText('Morning Flow')
    await user.click(sequenceCard)

    // Should navigate to the sequence detail page
    expect(mockPush).toHaveBeenCalledWith('/navigator/sequences/seq1')
  })

  it('should not trigger series card navigation when edit button is clicked', async () => {
    const user = userEvent.setup()
    const mockSeries = [
      {
        id: 'series1',
        seriesName: 'Sun Salutation',
        description: 'A flowing series of poses',
        seriesPoses: ['Warrior I', 'Warrior II'],
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSeries.mockResolvedValue(mockSeries)
    mockGetUserCreatedSequences.mockResolvedValue([])

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])

    // Should not navigate to the series page
    expect(mockPush).not.toHaveBeenCalledWith(
      '/navigator/flows/practiceSeries?id=series1'
    )
  })
})
