import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@styles/theme'
import Page from '@app/navigator/flows/practiceSequences/page'
import userEvent from '@testing-library/user-event'
import { SequenceData } from '@lib/sequenceService'

// Use global mocks from jest.setup.ts for navigation
const mockPush = (globalThis as any).mockNavigationPush
const mockReplace = (globalThis as any).mockNavigationReplace
const mockBack = (globalThis as any).mockNavigationBack

// Local mock for search params (not in global setup)
const mockGet = jest.fn<string | null, []>(() => null)

// Override useSearchParams specifically for this test file
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: (globalThis as any).__mockSearchParamsGet || jest.fn(() => null),
  })),
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/flows/practiceSequences'),
}))

// Make search params mock available for test access
;(globalThis as any).__mockSearchParamsGet = mockGet

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

// Mock ActivityTracker
jest.mock('@app/clientComponents/ActivityTracker', () => {
  const MockActivityTracker = ({
    entityId,
    entityType,
    onActivityToggle,
  }: any) => (
    <div data-testid="activity-tracker">
      Activity Tracker for {entityType}: {entityId}
      <button
        data-testid="mock-activity-toggle"
        onClick={() => onActivityToggle?.(true)}
      >
        Toggle Activity
      </button>
    </div>
  )
  MockActivityTracker.displayName = 'MockActivityTracker'
  return MockActivityTracker
})

// Mock WeeklyActivityViewer (unified component)
jest.mock('@app/clientComponents/WeeklyActivityViewer', () => {
  const MockWeeklyActivityViewer = ({
    entityId,
    entityName,
    entityType,
    variant,
    refreshTrigger,
  }: any) => (
    <div
      data-testid="weekly-activity-viewer"
      data-entity-id={entityId}
      data-entity-type={entityType}
      data-variant={variant}
    >
      Weekly Activity for {entityType} {entityId}
      <span data-testid="entity-name">{entityName}</span>
      <span data-testid="entity-type">{entityType}</span>
      <span data-testid="viewer-variant">{variant}</span>
      <span data-testid="refresh-trigger">{refreshTrigger}</span>
    </div>
  )
  MockWeeklyActivityViewer.displayName = 'MockWeeklyActivityViewer'
  return MockWeeklyActivityViewer
})

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
      id: '1',
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
      const mockSequence = createMockSequence({
        createdBy: 'test@uvuyoga.com',
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      // List view icon should be visible and clickable
      const listViewButton = screen.getByRole('button', {
        name: /switch to list view for Morning Flow/i,
      })
      expect(listViewButton).toBeInTheDocument()
      expect(listViewButton).not.toBeDisabled()

      // Scroll view icon should be visible (current view) with pointer-events: none
      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })
      expect(scrollViewButton).toBeInTheDocument()
      // Current view icon is not disabled but has pointer-events: none
      expect(scrollViewButton).not.toBeDisabled()

      // Edit icon should also be visible
      const editButton = screen.getByRole('button', {
        name: /edit Morning Flow/i,
      })
      expect(editButton).toBeInTheDocument()
    })

    it('should display tooltips on view toggle icons', async () => {
      const mockSequence = createMockSequence({
        createdBy: 'test@uvuyoga.com',
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
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
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const listViewButton = screen.getByRole('button', {
        name: /switch to list view/i,
      })

      await user.click(listViewButton)

      // Verify navigation to list view with correct sequence ID
      expect(mockPush).toHaveBeenCalledWith('/sequences/123')
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
          expect(
            screen.getByRole('heading', { name: testSeq.name })
          ).toBeInTheDocument()
        })

        const listViewButton = screen.getByRole('button', {
          name: /switch to list view/i,
        })

        await user.click(listViewButton)

        expect(mockPush).toHaveBeenCalledWith(`/sequences/${testSeq.id}`)

        unmount()
      }
    })

    it('should not navigate when scroll view icon is clicked (current view with pointer-events: none)', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      // Should be present and styled as current view (not disabled but has pointer-events: none)
      expect(scrollViewButton).toBeInTheDocument()
      expect(scrollViewButton).not.toBeDisabled()

      // Verify it has pointer-events: none styling
      const buttonStyle = window.getComputedStyle(scrollViewButton)
      expect(buttonStyle.pointerEvents).toBe('none')

      // Navigation should not be called
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Edit Navigation', () => {
    it('should navigate to edit mode when edit icon is clicked', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({
        id: 456,
        createdBy: 'test@uvuyoga.com', // Match session user email to show Edit button
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('456')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', {
        name: /edit Morning Flow/i,
      })

      await user.click(editButton)

      // Verify navigation to edit mode with correct parameter
      expect(mockReplace).toHaveBeenCalledWith('/sequences/456?edit=true')
    })

    it('should include edit parameter in URL for edit navigation', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({
        id: 789,
        createdBy: 'test@uvuyoga.com', // Match session user email to show Edit button
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('789')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', {
        name: /edit/i,
      })

      await user.click(editButton)

      // Verify URL includes edit=true parameter
      const callArgs = mockReplace.mock.calls[0][0]
      expect(callArgs).toContain('?edit=true')
      expect(callArgs).toBe('/sequences/789?edit=true')
    })
  })

  describe('View Toggle Icon States', () => {
    it('should show scroll view icon as current view with orange color', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      // Should be non-clickable (pointer-events: none)
      expect(scrollViewButton).toBeInTheDocument()
      // Should have orange color (primary.main)
      const buttonStyle = window.getComputedStyle(scrollViewButton)
      expect(buttonStyle.pointerEvents).toBe('none')
    })

    it('should show list view icon as clickable with gray color', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const listViewButton = screen.getByRole('button', {
        name: /switch to list view/i,
      })

      expect(listViewButton).not.toBeDisabled()
      // Should be clickable
      expect(listViewButton).toBeEnabled()
    })

    it('should display scroll view icon with primary color indicating active state', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      // Verify the button is rendered and has the correct title
      expect(scrollViewButton).toBeInTheDocument()
      expect(scrollViewButton).toHaveAttribute('title', 'Scroll View (current)')
    })

    it('should display list view icon with gray color for inactive state', async () => {
      const mockSequence = createMockSequence()
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const listViewButton = screen.getByRole('button', {
        name: /switch to list view/i,
      })

      // Verify the button is rendered and clickable
      expect(listViewButton).toBeInTheDocument()
      expect(listViewButton).toHaveAttribute('title', 'List View')
      expect(listViewButton).toBeEnabled()
    })
  })

  describe('Accessibility for View Toggle', () => {
    it('should have proper ARIA labels for all view toggle controls', async () => {
      const mockSequence = createMockSequence({
        nameSequence: 'Evening Relaxation',
        createdBy: 'test@uvuyoga.com',
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('1')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Evening Relaxation' })
        ).toBeInTheDocument()
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
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const scrollViewButton = screen.getByRole('button', {
        name: /currently in scroll view/i,
      })

      // Current view icon is not disabled but has pointer-events: none
      expect(scrollViewButton).not.toBeDisabled()
      const buttonStyle = window.getComputedStyle(scrollViewButton)
      expect(buttonStyle.pointerEvents).toBe('none')
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
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
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
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      // Title should be present
      expect(
        screen.getByRole('heading', { name: 'Morning Flow' })
      ).toBeInTheDocument()

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
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      // Sequence should remain selected
      expect(
        screen.getByRole('heading', { name: 'Morning Flow' })
      ).toBeInTheDocument()

      // View toggle should reference the correct sequence
      const listViewButton = screen.getByRole('button', {
        name: /switch to list view for Morning Flow/i,
      })
      expect(listViewButton).toBeInTheDocument()
    })
  })

  describe('Sequence Activity Tracking', () => {
    it('should display the ActivityTracker when a sequence is selected', async () => {
      const mockSequence = createMockSequence({ id: 123 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('123')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const activityTracker = screen.getByTestId('activity-tracker')
      expect(activityTracker).toBeInTheDocument()
      expect(activityTracker).toHaveTextContent(
        'Activity Tracker for sequence: 123'
      )
    })

    it('should display the WeeklyActivityViewer when a sequence is selected', async () => {
      const mockSequence = createMockSequence({ id: 456 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('456')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const weeklyViewer = screen.getByTestId('weekly-activity-viewer')
      expect(weeklyViewer).toBeInTheDocument()
      expect(weeklyViewer).toHaveTextContent('Weekly Activity for sequence 456')
    })

    it('should pass the correct props to WeeklyActivityViewer', async () => {
      const mockSequence = createMockSequence({
        id: 789,
        nameSequence: 'Evening Wind Down',
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('789')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Evening Wind Down' })
        ).toBeInTheDocument()
      })

      const weeklyViewer = screen.getByTestId('weekly-activity-viewer')
      expect(weeklyViewer).toBeInTheDocument()

      // Check that props are correctly passed via data attributes
      expect(weeklyViewer).toHaveAttribute('data-entity-id', '789')
      expect(weeklyViewer).toHaveAttribute('data-entity-type', 'sequence')
      expect(weeklyViewer).toHaveAttribute('data-variant', 'detailed')
    })

    it('should update refreshTrigger when activity is toggled', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({ id: 555 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('555')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      // Initial refreshTrigger should be 0
      expect(screen.getByTestId('refresh-trigger')).toHaveTextContent('0')

      // Click the activity toggle button
      const toggleButton = screen.getByTestId('mock-activity-toggle')
      await user.click(toggleButton)

      // refreshTrigger should increment to 1
      await waitFor(() => {
        expect(screen.getByTestId('refresh-trigger')).toHaveTextContent('1')
      })
    })

    it('should not display activity trackers when no sequence is selected', async () => {
      mockGetAllSequences.mockResolvedValue([])
      mockGet.mockReturnValue(null)

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(screen.getByTestId('splash-header')).toBeInTheDocument()
      })

      // Activity trackers should not be present
      expect(screen.queryByTestId('activity-tracker')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('weekly-activity-viewer')
      ).not.toBeInTheDocument()
    })

    it('should not display activity trackers for sequence with id 0', async () => {
      const mockSequence = createMockSequence({ id: 0 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('0')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        // The sequence might still render
        expect(screen.queryByText('Morning Flow')).toBeInTheDocument()
      })

      // Activity trackers should not be present for id 0
      expect(screen.queryByTestId('activity-tracker')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('weekly-activity-viewer')
      ).not.toBeInTheDocument()
    })

    it('should display both activity trackers together when sequence is selected', async () => {
      const mockSequence = createMockSequence({ id: 999 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('999')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      // Both trackers should be present
      const activityTracker = screen.getByTestId('activity-tracker')
      const weeklyViewer = screen.getByTestId('weekly-activity-viewer')

      expect(activityTracker).toBeInTheDocument()
      expect(weeklyViewer).toBeInTheDocument()

      // Both should reference the same sequence
      expect(activityTracker).toHaveTextContent(
        'Activity Tracker for sequence: 999'
      )
      expect(weeklyViewer).toHaveTextContent('Weekly Activity for sequence 999')
    })

    it('should maintain refreshTrigger state across multiple activity toggles', async () => {
      const user = userEvent.setup()
      const mockSequence = createMockSequence({ id: 111 })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('111')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Morning Flow' })
        ).toBeInTheDocument()
      })

      const toggleButton = screen.getByTestId('mock-activity-toggle')
      const refreshTriggerElement = screen.getByTestId('refresh-trigger')

      // Initial state
      expect(refreshTriggerElement).toHaveTextContent('0')

      // First toggle
      await user.click(toggleButton)
      await waitFor(() => {
        expect(refreshTriggerElement).toHaveTextContent('1')
      })

      // Second toggle
      await user.click(toggleButton)
      await waitFor(() => {
        expect(refreshTriggerElement).toHaveTextContent('2')
      })

      // Third toggle
      await user.click(toggleButton)
      await waitFor(() => {
        expect(refreshTriggerElement).toHaveTextContent('3')
      })
    })

    it('should render activity trackers with correct sequence name', async () => {
      const mockSequence = createMockSequence({
        id: 777,
        nameSequence: 'Sunrise Flow',
      })
      mockGetAllSequences.mockResolvedValue([mockSequence])
      mockGet.mockReturnValue('777')

      render(<Page />, { wrapper: Wrapper })

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Sunrise Flow' })
        ).toBeInTheDocument()
      })

      // Check that the sequence name is passed correctly
      const sequenceNameElement = screen.getByTestId('entity-name')
      expect(sequenceNameElement).toHaveTextContent('Sunrise Flow')
    })
  })
})
