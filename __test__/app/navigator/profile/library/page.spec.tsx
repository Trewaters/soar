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
// Remove local next/navigation mock - use global mock from jest.setup.ts
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

// Use global mock from jest.setup.ts for navigation
const mockPush = (globalThis as any).mockNavigationPush

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

// Mock pose service
const mockDeletePose = jest.fn()
jest.mock('@lib/poseService', () => ({
  deletePose: (id: string) => mockDeletePose(id),
}))

// Mock series service
const mockDeleteSeries = jest.fn()
jest.mock('@lib/seriesService', () => ({
  updateSeries: jest.fn(),
  deleteSeries: (id: string) => mockDeleteSeries(id),
}))

// Mock sequence service
const mockDeleteSequence = jest.fn()
jest.mock('@lib/sequenceService', () => ({
  deleteSequence: (id: string) => mockDeleteSequence(id),
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
    mockDeletePose.mockResolvedValue({ success: true })

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

    // Check that deletePose was called with the correct ID
    expect(mockDeletePose).toHaveBeenCalledWith('asana1')

    // Check that the asanas list was refreshed
    await waitFor(() => {
      expect(mockGetUserCreatedAsanas).toHaveBeenCalledTimes(2) // Once on mount, once after delete
    })

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Delete Asana?')).not.toBeInTheDocument()
    })
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

describe('LibraryPage - SeriesCard Delete Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedAsanas.mockResolvedValue([])
    mockGetUserCreatedSequences.mockResolvedValue([])
    mockDeleteSeries.mockResolvedValue({ success: true })

    // Setup default UserContext mock
    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should display delete icon on series cards', async () => {
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

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    // Check that delete button is present
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('should open confirmation dialog when delete button is clicked', async () => {
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

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Check that the dialog appears
    expect(screen.getByText('Delete Series?')).toBeInTheDocument()
    expect(
      screen.getByText(/Are you sure you want to delete "Sun Salutation"/i)
    ).toBeInTheDocument()
  })

  it('should close dialog when cancel button is clicked', async () => {
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

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Dialog should be open
    expect(screen.getByText('Delete Series?')).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Delete Series?')).not.toBeInTheDocument()
    })
  })

  it('should handle delete confirmation', async () => {
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

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Dialog should be open
    expect(screen.getByText('Delete Series?')).toBeInTheDocument()

    const confirmDeleteButtons = screen.getAllByRole('button', {
      name: /^delete$/i,
    })
    // Get the button inside the dialog (should be the last one)
    const confirmDeleteButton =
      confirmDeleteButtons[confirmDeleteButtons.length - 1]
    await user.click(confirmDeleteButton)

    // Check that deleteSeries was called with the correct ID
    expect(mockDeleteSeries).toHaveBeenCalledWith('series1')

    // Check that the series list was refreshed
    await waitFor(() => {
      expect(mockGetUserCreatedSeries).toHaveBeenCalledTimes(2) // Once on mount, once after delete
    })

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Delete Series?')).not.toBeInTheDocument()
    })
  })

  it('should not trigger card navigation when delete button is clicked', async () => {
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

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Should not navigate when delete button is clicked
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should display both edit and delete buttons on series cards', async () => {
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

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    // Check that both edit and delete buttons are present
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('should show loading state during deletion', async () => {
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

    // Make delete slow to observe loading state
    mockDeleteSeries.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100)
        )
    )

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Confirm deletion
    const confirmDeleteButtons = screen.getAllByRole('button', {
      name: /^delete$/i,
    })
    const confirmDeleteButton =
      confirmDeleteButtons[confirmDeleteButtons.length - 1]
    await user.click(confirmDeleteButton)

    // Should show "Deleting..." text
    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument()
    })

    // Wait for deletion to complete
    await waitFor(() => {
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument()
    })
  })
})

describe('LibraryPage - SequenceCard Delete Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedAsanas.mockResolvedValue([])
    mockGetUserCreatedSeries.mockResolvedValue([])
    mockDeleteSequence.mockResolvedValue({ success: true })

    // Setup default UserContext mock
    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should display delete icon on sequence cards', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    // Check that delete button is present
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('should open confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Check that the dialog appears
    expect(screen.getByText('Delete Sequence?')).toBeInTheDocument()
    expect(
      screen.getByText(/Are you sure you want to delete "Morning Flow"/i)
    ).toBeInTheDocument()
  })

  it('should close dialog when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Dialog should be open
    expect(screen.getByText('Delete Sequence?')).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Delete Sequence?')).not.toBeInTheDocument()
    })
  })

  it('should handle delete confirmation', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Dialog should be open
    expect(screen.getByText('Delete Sequence?')).toBeInTheDocument()

    const confirmDeleteButtons = screen.getAllByRole('button', {
      name: /^delete$/i,
    })
    // Get the button inside the dialog (should be the last one)
    const confirmDeleteButton =
      confirmDeleteButtons[confirmDeleteButtons.length - 1]
    await user.click(confirmDeleteButton)

    // Check that deleteSequence was called with the correct ID
    expect(mockDeleteSequence).toHaveBeenCalledWith('1')

    // Check that the sequences list was refreshed
    await waitFor(() => {
      expect(mockGetUserCreatedSequences).toHaveBeenCalledTimes(2) // Once on mount, once after delete
    })

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Delete Sequence?')).not.toBeInTheDocument()
    })
  })

  it('should not trigger card navigation when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Should not navigate when delete button is clicked
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should display both edit and delete buttons on sequence cards', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    // Check that both edit and delete buttons are present
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('should show loading state during deletion', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    // Make delete slow to observe loading state
    mockDeleteSequence.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100)
        )
    )

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    // Confirm deletion
    const confirmDeleteButtons = screen.getAllByRole('button', {
      name: /^delete$/i,
    })
    const confirmDeleteButton =
      confirmDeleteButtons[confirmDeleteButtons.length - 1]
    await user.click(confirmDeleteButton)

    // Should show "Deleting..." text
    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument()
    })

    // Wait for deletion to complete
    await waitFor(() => {
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument()
    })
  })
})

describe('LibraryPage - Asanas View Toggle Feature', () => {
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

  it('should display view toggle icons in Asanas tab', async () => {
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

    // Check for card view icon (active)
    const cardViewButton = screen.getByRole('button', {
      name: /Currently in card view/i,
    })
    expect(cardViewButton).toBeInTheDocument()

    // Check for list view icon
    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    expect(listViewButton).toBeInTheDocument()
  })

  it('should toggle from card view to list view in Asanas tab', async () => {
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

    // Click list view button
    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    await user.click(listViewButton)

    // Now list view should be active (aria-label changes)
    await waitFor(() => {
      const activeListViewButton = screen.getByRole('button', {
        name: /Currently in list view/i,
      })
      expect(activeListViewButton).toBeInTheDocument()

      const inactiveCardViewButton = screen.getByRole('button', {
        name: /Switch to card view/i,
      })
      expect(inactiveCardViewButton).toBeInTheDocument()
    })

    // Asanas should still be visible
    expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
    expect(screen.getByText('Tree Pose')).toBeInTheDocument()
  })

  it('should allow clicking asana in list view to navigate', async () => {
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

    // Switch to list view
    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    await user.click(listViewButton)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Currently in list view/i })
      ).toBeInTheDocument()
    })

    // Click on the asana name (the entire paper should be clickable)
    const asanaName = screen.getByText('Warrior Pose')
    await user.click(asanaName)

    // Should navigate to the asana detail page
    expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPoses/asana1')
  })
})

describe('LibraryPage - Series View Toggle Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedAsanas.mockResolvedValue([])
    mockGetUserCreatedSequences.mockResolvedValue([])

    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should display view toggle icons in Series tab', async () => {
    const user = userEvent.setup()
    const mockSeries = [
      {
        id: 'series1',
        seriesName: 'Sun Salutation',
        description: 'A classic yoga series',
        seriesPoses: ['pose1', 'pose2'],
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSeries.mockResolvedValue(mockSeries)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    // Check for view toggle icons
    const cardViewButton = screen.getByRole('button', {
      name: /Currently in card view/i,
    })
    expect(cardViewButton).toBeInTheDocument()

    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    expect(listViewButton).toBeInTheDocument()
  })

  it('should toggle from card view to list view in Series tab', async () => {
    const user = userEvent.setup()
    const mockSeries = [
      {
        id: 'series1',
        seriesName: 'Sun Salutation',
        description: 'A classic yoga series',
        seriesPoses: ['pose1', 'pose2'],
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSeries.mockResolvedValue(mockSeries)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Series tab
    const seriesTab = screen.getByRole('tab', { name: /Series/i })
    await user.click(seriesTab)

    await screen.findByText('Sun Salutation')

    // Click list view button
    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    await user.click(listViewButton)

    // Now list view should be active
    await waitFor(() => {
      const activeListViewButton = screen.getByRole('button', {
        name: /Currently in list view/i,
      })
      expect(activeListViewButton).toBeInTheDocument()
    })

    // Series should still be visible
    expect(screen.getByText('Sun Salutation')).toBeInTheDocument()
  })
})

describe('LibraryPage - Sequences View Toggle Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserCreatedAsanas.mockResolvedValue([])
    mockGetUserCreatedSeries.mockResolvedValue([])

    mockUseUser.mockReturnValue({
      state: mockUserState,
      dispatch: mockDispatch,
    })
  })

  it('should display view toggle icons in Sequences tab', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    // Check for view toggle icons
    const cardViewButton = screen.getByRole('button', {
      name: /Currently in card view/i,
    })
    expect(cardViewButton).toBeInTheDocument()

    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    expect(listViewButton).toBeInTheDocument()
  })

  it('should toggle from card view to list view in Sequences tab', async () => {
    const user = userEvent.setup()
    const mockSequences = [
      {
        id: 1,
        nameSequence: 'Morning Flow',
        description: 'A gentle morning sequence',
        sequencesSeries: ['series1', 'series2'],
        durationSequence: '30 minutes',
        createdBy: 'test@example.com',
        createdAt: new Date().toISOString(),
      },
    ]
    mockGetUserCreatedSequences.mockResolvedValue(mockSequences)

    render(<LibraryPage />, { wrapper: TestWrapper })

    // Switch to Sequences tab
    const sequencesTab = screen.getByRole('tab', { name: /Sequences/i })
    await user.click(sequencesTab)

    await screen.findByText('Morning Flow')

    // Click list view button
    const listViewButton = screen.getByRole('button', {
      name: /Switch to list view/i,
    })
    await user.click(listViewButton)

    // Now list view should be active (aria-label changes)
    await waitFor(() => {
      const activeListViewButton = screen.getByRole('button', {
        name: /Currently in list view/i,
      })
      expect(activeListViewButton).toBeInTheDocument()
    })

    // Sequences should still be visible
    expect(screen.getByText('Morning Flow')).toBeInTheDocument()
  })
})
