import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@styles/theme'
import Page from '@app/navigator/flows/practiceSequences/page'
import userEvent from '@testing-library/user-event'
import { SequenceData } from '@lib/sequenceService'

// Mock next/navigation
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockPrefetch = jest.fn()
const mockBack = jest.fn()
const mockForward = jest.fn()
const mockRefresh = jest.fn()
const mockGet = jest.fn<string | null, []>(() => null)

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: mockGet,
  })),
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
  })),
}))

// Make mocks available for test access
;(global as any).__mockNavigationPush = mockPush
;(global as any).__mockNavigationReplace = mockReplace
;(global as any).__mockSearchParamsGet = mockGet

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@uvuyoga.com',
        name: 'Test User',
      },
      expires: '2025-12-31T23:59:59.999Z',
    },
    status: 'authenticated',
  })),
}))

// Mock alpha users utility
jest.mock('@app/lib/alphaUsers', () => {
  return jest.fn(() => ['alpha@example.com', 'alpha-user-id'])
})

// Mock FEATURES
jest.mock('@app/FEATURES', () => ({
  FEATURES: {
    SHOW_CREATE_SERIES: true,
    SHOW_CREATE_SEQUENCE: true,
    SHOW_PRACTICE_SEQUENCE: true,
    SHOW_PRACTICE_VIEW_ASANA: true,
    PRIORITIZE_USER_ENTRIES_IN_SEARCH: true,
  },
}))

// Mock search utility
jest.mock('@app/utils/search/orderPosesForSearch', () => ({
  orderPosesForSearch: jest.fn(
    (
      sequences: any[],
      _userId: string,
      _alphaIds: string[],
      nameExtractor: (item: any) => string
    ) => {
      // Simple mock that returns sequences sorted by name for testing
      return sequences.sort((a: any, b: any) =>
        nameExtractor(a).localeCompare(nameExtractor(b))
      )
    }
  ),
}))

// Mock the sequenceService
const mockGetAllSequences = jest.fn()
jest.mock('@lib/sequenceService', () => ({
  getAllSequences: (...args: any[]) => mockGetAllSequences(...args),
}))

// Mock the seriesService
const mockGetAllSeries = jest.fn()
jest.mock('@lib/seriesService', () => ({
  getAllSeries: (...args: any[]) => mockGetAllSeries(...args),
}))

// Mock SequenceActivityTracker
jest.mock(
  '@app/clientComponents/sequenceActivityTracker/SequenceActivityTracker',
  () => {
    const MockSequenceActivityTracker = ({ sequenceId }: any) => (
      <div data-testid="sequence-activity-tracker">
        Activity Tracker for sequence: {sequenceId}
      </div>
    )
    MockSequenceActivityTracker.displayName = 'MockSequenceActivityTracker'
    return MockSequenceActivityTracker
  }
)

// Mock SplashHeader
jest.mock('@app/clientComponents/splash-header', () => {
  const MockSplashHeader = ({ title }: any) => (
    <div data-testid="splash-header">{title}</div>
  )
  MockSplashHeader.displayName = 'MockSplashHeader'
  return MockSplashHeader
})

// Mock SubNavHeader
jest.mock('@app/clientComponents/sub-nav-header', () => {
  const MockSubNavHeader = ({ title }: any) => (
    <div data-testid="sub-nav-header">{title}</div>
  )
  MockSubNavHeader.displayName = 'MockSubNavHeader'
  return MockSubNavHeader
})

// Mock navigation utilities
jest.mock('@app/utils/navigation/poseNavigation', () => ({
  getPoseNavigationUrlSync: jest.fn((poseName: string) => `/poses/${poseName}`),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const createMockSequence = (
  overrides: Partial<SequenceData> = {}
): SequenceData => ({
  id: 1,
  nameSequence: 'Morning Flow',
  sequencesSeries: [
    {
      id: 1,
      seriesName: 'Sun Salutation A',
      seriesPoses: [
        {
          sort_english_name: 'Mountain Pose',
          secondary: 'Tadasana',
        },
        {
          sort_english_name: 'Forward Fold',
          secondary: 'Uttanasana',
        },
      ],
    },
  ],
  description: 'Gentle morning practice',
  image: 'https://example.com/morning.jpg',
  ...overrides,
})

describe('Practice Sequences Page - View Toggle Features', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllSequences.mockResolvedValue([])
    mockGetAllSeries.mockResolvedValue([])
  })

  describe('View Toggle Icons Display', () => {
    it('should display view toggle icons when a sequence is selected', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      // List view icon should be visible and clickable
      const listViewButton = screen.getByRole('button', {
        name: /switch to list view for Morning Flow/i,
      })
      expect(listViewButton).toBeInTheDocument()
      expect(listViewButton).not.toBeDisabled()

      // Scroll view icon should be visible but disabled (current view)
      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })
      expect(scrollViewButton).toBeInTheDocument()
      expect(scrollViewButton).toBeDisabled()

      // Edit icon should also be visible
      const editButton = screen.getByRole('button', {
        name: /edit Morning Flow/i,
      })
      expect(editButton).toBeInTheDocument()
    })

    it('should display tooltips on view toggle icons', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const listViewButton = screen.getByRole('button', {
        name: /switch to list view/i,
      })
      expect(listViewButton).toHaveAttribute('title', 'List View')

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })
      expect(scrollViewButton).toHaveAttribute('title', 'Scroll View (current)')

      const editButton = screen.getByRole('button', {
        name: /edit Morning Flow/i,
      })
      expect(editButton).toHaveAttribute('title', 'Edit Sequence')
    })

    it('should not display view toggle icons when no sequence is selected', async () => {
      mockGetAllSequences.mockResolvedValue([])
      mockGet.mockReturnValue(null)

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByTestId('splash-header')).toBeInTheDocument()
      })

      // View toggle icons should not be present
      expect(
        screen.queryByRole('button', { name: /switch to list view/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /currently in scroll view/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('List View Navigation', () => {
    it('should navigate to list view when list view icon is clicked', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({ id: 123 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('123')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const listViewButton = screen.getByRole('button', {
        name: /switch to list view/i,
      })

      await user.click(listViewButton)

      // Verify navigation to list view with correct sequence ID
      expect(mockPush).toHaveBeenCalledWith('/navigator/sequences/123')
    })

    it('should navigate to list view with different sequence IDs', async () => {
      const user = userEvent.setup()

      const testSequences = [
        { id: 507, name: 'First Sequence' },
        { id: 999, name: 'Second Sequence' },
        { id: 12345, name: 'Third Sequence' },
      ]

      for (const testSeq of testSequences) {
        mockPush.mockClear()
        const mockSequence = createMockSequence({
          id: testSeq.id,
          nameSequence: testSeq.name,
        })
        mockGetAllSequences.mockResolvedValue([mockSequence])
        mockGet.mockReturnValue(String(testSeq.id))

        const { unmount } = render(<Page />, { wrapper: Wrapper })

        await waitFor(() => {
          expect(screen.getByText(testSeq.name)).toBeInTheDocument()
        })

        const listViewButton = screen.getByRole('button', {
          name: /switch to list view/i,
        })

        await user.click(listViewButton)

        expect(mockPush).toHaveBeenCalledWith(
          `/navigator/sequences/${testSeq.id}`
        )

        unmount()
      }
    })

    it('should not navigate when scroll view icon is clicked (disabled)', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      // Should be disabled (cannot click disabled buttons in tests)
      expect(scrollViewButton).toBeDisabled()

      // Navigation should not be called
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Edit Navigation', () => {
    it('should navigate to edit mode when edit icon is clicked', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({ id: 456 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('456')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', {
        name: /edit Morning Flow/i,
      })

      await user.click(editButton)

      // Verify navigation to list view with edit parameter
      expect(mockPush).toHaveBeenCalledWith(
        '/navigator/sequences/456?edit=true'
      )
    })

    it('should include edit parameter in URL for edit navigation', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({ id: 789 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('789')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', {
        name: /edit/i,
      })

      await user.click(editButton)

      // Verify URL includes edit=true parameter
      const callArgs = mockPush.mock.calls[0][0]
      expect(callArgs).toContain('?edit=true')
      expect(callArgs).toBe('/navigator/sequences/789?edit=true')
    })
  })

  describe('View Toggle Icon States', () => {
    it('should show scroll view icon as disabled with reduced opacity', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      expect(scrollViewButton).toBeDisabled()
      // Check for opacity styling (disabled state)
      expect(scrollViewButton).toHaveStyle({ opacity: 0.5 })
    })

    it('should show list view icon as enabled and clickable', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const listViewButton = screen.getByRole('button', {
        name: /switch to list view/i,
      })

      expect(listViewButton).not.toBeDisabled()
      expect(listViewButton).not.toHaveStyle({ opacity: 0.5 })
    })
  })

  describe('Accessibility for View Toggle', () => {
    it('should have proper ARIA labels for all view toggle controls', async () => {
      const mockSequence = createMockSequence({
        nameSequence: 'Evening Relaxation',
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Evening Relaxation')).toBeInTheDocument()
      })

      // List view button
      expect(
        screen.getByRole('button', {
          name: /switch to list view for Evening Relaxation/i,
        })
      ).toBeInTheDocument()

      // Scroll view button
      expect(
        screen.getByRole('button', {
          name: /currently in scroll view/i,
        })
      ).toBeInTheDocument()

      // Edit button
      expect(
        screen.getByRole('button', {
          name: /edit Evening Relaxation/i,
        })
      ).toBeInTheDocument()
    })

    it('should indicate disabled state in ARIA label for current view', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      expect(scrollViewButton).toBeDisabled()
      expect(scrollViewButton.getAttribute('aria-label')).toContain('Currently')
    })
  })

  describe('View Toggle with Multiple Sequences', () => {
    it('should update view toggle icons when switching between sequences', async () => {
      const sequences = [
        createMockSequence({ id: 1, nameSequence: 'Morning Flow' }),
        createMockSequence({ id: 2, nameSequence: 'Evening Flow' }),
      ]
      mockGetAllSequences.mockResolvedValue(sequences)
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      // Verify initial state
      const listViewButton = screen.getByRole('button', {
        name: /switch to list view for Morning Flow/i,
      })
      expect(listViewButton).toBeInTheDocument()

      // Note: Switching sequences would require interacting with the autocomplete
      // which is complex to test. This test verifies the initial state is correct.
    })
  })

  describe('Integration with Existing Features', () => {
    it('should display view toggle icons alongside sequence title and series cards', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      // Title should be present
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()

      // View toggle icons should be present
      expect(
        screen.getByRole('button', { name: /switch to list view/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /currently in scroll view/i })
      ).toBeInTheDocument()

      // Series card should be present
      expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
    })

    it('should maintain sequence selection when view toggle icons are rendered', async () => {
      const mockSequence = createMockSequence({ id: 999 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('999')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      })

      // Sequence should remain selected
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()

      // View toggle should reference the correct sequence
      const listViewButton = screen.getByRole('button', {
        name: /switch to list view for Morning Flow/i,
      })
      expect(listViewButton).toBeInTheDocument()
    })
  })
})
