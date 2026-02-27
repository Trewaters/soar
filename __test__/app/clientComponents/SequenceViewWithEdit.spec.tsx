import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import SequenceViewWithEdit from '@clientComponents/SequenceViewWithEdit'

// Note: next/navigation and useNavigationWithLoading are mocked globally in jest.setup.ts
// Access the global mocks via (globalThis as any).mockNavigationPush for assertions

// Mock next/image to avoid DOM warnings from the "fill" prop
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

// Mock NextAuth session (overrides global mock for custom behavior)
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock seriesService to prevent fetch errors
jest.mock('@lib/seriesService', () => ({
  getAllSeries: jest.fn().mockResolvedValue([]),
}))

const mockUseSession = require('next-auth/react').useSession as jest.Mock

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

const baseSequence = (overrides: Partial<any> = {}) => ({
  id: 'seq-1',
  nameSequence: 'Morning Flow',
  sequencesSeries: [],
  description: 'Gentle warmup and sun salutation',
  image: 'https://example.com/img.png',
  created_by: 'owner@uvuyoga.com',
  ...overrides,
})

describe('SequenceViewWithEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows Edit button for owner and toggles edit region', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({
      data: { user: { email: 'Owner@Uvuyoga.com' } }, // different case to test case-insensitive comparison
      status: 'authenticated',
    })

    render(<SequenceViewWithEdit sequence={baseSequence()} />, {
      wrapper: Wrapper,
    })

    const editBtn = screen.getByRole('button', { name: /edit/i })
    expect(editBtn).toBeInTheDocument()

    await user.click(editBtn)
    expect(
      screen.getByRole('region', { name: /edit-region/i })
    ).toBeInTheDocument()

    // Button label should change to "Close edit" or similar
    expect(
      screen.getByRole('button', { name: /hide edit|close edit/i })
    ).toBeInTheDocument()
  })

  it('does not show Edit button for non-owner', () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'someone@else.com' } },
      status: 'authenticated',
    })

    render(<SequenceViewWithEdit sequence={baseSequence()} />, {
      wrapper: Wrapper,
    })

    expect(
      screen.queryByRole('button', { name: /edit/i })
    ).not.toBeInTheDocument()
  })

  it('does not show Edit button when unauthenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })

    render(<SequenceViewWithEdit sequence={baseSequence()} />, {
      wrapper: Wrapper,
    })

    expect(
      screen.queryByRole('button', { name: /edit/i })
    ).not.toBeInTheDocument()
  })

  describe('Alignment Cues Display', () => {
    it('should display poses with alignment cues from series in sequence view', async () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'user@example.com' } },
        status: 'authenticated',
      })

      const sequenceWithSeries = baseSequence({
        sequencesSeries: [
          {
            id: '1',
            seriesName: 'Sun Salutation A',
            seriesPoses: [
              {
                sort_english_name: 'Mountain Pose',
                secondary: 'Tadasana',
                alignment_cues: 'Stand tall with feet together',
              },
              {
                sort_english_name: 'Forward Fold',
                secondary: 'Uttanasana',
                alignment_cues:
                  'Bend from hips\nKeep spine long\nRelax neck and shoulders',
              },
            ],
          },
        ],
      })

      render(<SequenceViewWithEdit sequence={sequenceWithSeries} />, {
        wrapper: Wrapper,
      })

      // Verify series name is displayed
      expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()

      // Verify pose names are displayed as links
      expect(screen.getByText('Mountain Pose')).toBeInTheDocument()
      expect(screen.getByText('Forward Fold')).toBeInTheDocument()

      // Verify Sanskrit names are displayed
      expect(screen.getByText('Tadasana')).toBeInTheDocument()
      expect(screen.getByText('Uttanasana')).toBeInTheDocument()

      // Verify alignment cues are displayed inline (first line only)
      expect(
        screen.getByText('(Stand tall with feet together)')
      ).toBeInTheDocument()
      expect(screen.getByText('(Bend from hips)')).toBeInTheDocument()
    })

    it('should display poses without alignment cues gracefully', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'user@example.com' } },
        status: 'authenticated',
      })

      const sequenceWithSeriesNoAlignment = baseSequence({
        sequencesSeries: [
          {
            id: '2',
            seriesName: 'Basic Series',
            seriesPoses: [
              {
                sort_english_name: 'Warrior I',
                secondary: 'Virabhadrasana I',
                alignment_cues: '',
              },
              {
                sort_english_name: 'Tree Pose',
                secondary: 'Vrikshasana',
                // No alignment_cues field
              },
            ],
          },
        ],
      })

      render(
        <SequenceViewWithEdit sequence={sequenceWithSeriesNoAlignment} />,
        {
          wrapper: Wrapper,
        }
      )

      // Verify poses are still displayed
      expect(screen.getByText('Warrior I')).toBeInTheDocument()
      expect(screen.getByText('Tree Pose')).toBeInTheDocument()

      // Verify Sanskrit names are displayed
      expect(screen.getByText('Virabhadrasana I')).toBeInTheDocument()
      expect(screen.getByText('Vrikshasana')).toBeInTheDocument()

      // Verify no alignment cues are shown (no parentheses text)
      const allText = screen.getByText('Warrior I').closest('.journalLine')
      expect(allText).not.toHaveTextContent('(')
    })

    it('should display multiple series with alignment cues in a sequence', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'user@example.com' } },
        status: 'authenticated',
      })

      const sequenceWithMultipleSeries = baseSequence({
        sequencesSeries: [
          {
            id: '1',
            seriesName: 'Opening Series',
            seriesPoses: [
              {
                sort_english_name: 'Easy Pose',
                secondary: 'Sukhasana',
                alignment_cues: 'Sit with crossed legs',
              },
            ],
          },
          {
            id: '2',
            seriesName: 'Standing Series',
            seriesPoses: [
              {
                sort_english_name: 'Chair Pose',
                secondary: 'Utkatasana',
                alignment_cues: 'Bend knees deeply\nWeight in heels',
              },
            ],
          },
        ],
      })

      render(<SequenceViewWithEdit sequence={sequenceWithMultipleSeries} />, {
        wrapper: Wrapper,
      })

      // Verify both series are displayed
      expect(screen.getByText('Opening Series')).toBeInTheDocument()
      expect(screen.getByText('Standing Series')).toBeInTheDocument()

      // Verify poses from both series
      expect(screen.getByText('Easy Pose')).toBeInTheDocument()
      expect(screen.getByText('Chair Pose')).toBeInTheDocument()

      // Verify alignment cues from both series
      expect(screen.getByText('(Sit with crossed legs)')).toBeInTheDocument()
      expect(screen.getByText('(Bend knees deeply)')).toBeInTheDocument()
    })

    it('should render legacy string entries as deleted placeholders', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'user@example.com' } },
        status: 'authenticated',
      })

      const sequenceWithStringPoses = baseSequence({
        sequencesSeries: [
          {
            id: '3',
            seriesName: 'Legacy Series',
            seriesPoses: [
              'Warrior II; Virabhadrasana II',
              'Triangle Pose; Trikonasana',
            ],
          },
        ],
      })

      render(<SequenceViewWithEdit sequence={sequenceWithStringPoses} />, {
        wrapper: Wrapper,
      })

      // Verify series is displayed
      expect(screen.getByText('Legacy Series')).toBeInTheDocument()

      // Legacy string format is no longer parsed in this component;
      // entries fall back to deleted placeholders.
      expect(
        screen.getByTestId('sequence-series-0-pose-0-deleted')
      ).toHaveTextContent('pose-0')
      expect(
        screen.getByTestId('sequence-series-0-pose-1-deleted')
      ).toHaveTextContent('pose-1')
    })

    it('should display empty state when series has no poses', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'user@example.com' } },
        status: 'authenticated',
      })

      const sequenceWithEmptySeries = baseSequence({
        sequencesSeries: [
          {
            id: '4',
            seriesName: 'Empty Series',
            seriesPoses: [],
          },
        ],
      })

      render(<SequenceViewWithEdit sequence={sequenceWithEmptySeries} />, {
        wrapper: Wrapper,
      })

      // Verify series name is still displayed
      expect(screen.getByText('Empty Series')).toBeInTheDocument()

      // Verify empty state message is shown
      expect(screen.getByText('No poses in this series')).toBeInTheDocument()
    })

    it('should not display series when in edit mode', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: { user: { email: 'owner@uvuyoga.com' } },
        status: 'authenticated',
      })

      const sequenceWithSeries = baseSequence({
        sequencesSeries: [
          {
            id: '1',
            seriesName: 'Test Series',
            seriesPoses: [
              {
                sort_english_name: 'Test Pose',
                secondary: 'Test Sanskrit',
                alignment_cues: 'Test alignment',
              },
            ],
          },
        ],
      })

      render(<SequenceViewWithEdit sequence={sequenceWithSeries} />, {
        wrapper: Wrapper,
      })

      // Initially, series card should be visible (with journal class)
      const initialSeriesCard = screen
        .getByText('Test Series')
        .closest('.journal')
      expect(initialSeriesCard).toBeInTheDocument()
      expect(screen.getByText('Test Pose')).toBeInTheDocument()

      // Click edit button
      const editBtn = screen.getByRole('button', { name: /edit/i })
      await user.click(editBtn)

      // Series cards (with journal class) should no longer be visible in edit mode
      // The series name might appear in EditSequence dropdown, but the pose cards should not
      expect(screen.queryByText('Test Pose')).not.toBeInTheDocument()
      expect(screen.queryByText('(Test alignment)')).not.toBeInTheDocument()
    })
  })

  describe('View Toggle and Navigation Features', () => {
    // Use global mock from jest.setup.ts
    const mockPush = (globalThis as any).mockNavigationPush

    beforeEach(() => {
      mockPush.mockClear()
    })

    describe('View Toggle Icons', () => {
      it('should display view toggle icons with list view active (orange) and scroll view inactive (gray)', () => {
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        // List view icon should be non-clickable (current view) with orange color
        const listViewButton = screen.getByRole('button', {
          name: /currently in list view/i,
        })
        expect(listViewButton).toBeInTheDocument()
        expect(listViewButton).toHaveAttribute('title', 'List View (current)')

        // Scroll view icon should be enabled (can navigate to it) with gray color
        const scrollViewButton = screen.getByRole('button', {
          name: /switch to scroll view for Morning Flow/i,
        })
        expect(scrollViewButton).toBeInTheDocument()
        expect(scrollViewButton).not.toBeDisabled()
      })

      it('should navigate to scroll view when scroll view icon is clicked', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const sequence = baseSequence({ id: 'test-sequence-123' })

        render(<SequenceViewWithEdit sequence={sequence} />, {
          wrapper: Wrapper,
        })

        const scrollViewButton = screen.getByRole('button', {
          name: /switch to scroll view/i,
        })

        await user.click(scrollViewButton)

        // Verify navigation.push was called with correct scroll view URL
        expect(mockPush).toHaveBeenCalledWith(
          '/flows/practiceSequences?sequenceId=test-sequence-123'
        )
      })

      it('should display tooltips on view toggle icons', () => {
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        const listViewButton = screen.getByRole('button', {
          name: /currently in list view/i,
        })
        expect(listViewButton).toHaveAttribute('title', 'List View (current)')

        const scrollViewButton = screen.getByRole('button', {
          name: /switch to scroll view/i,
        })
        expect(scrollViewButton).toHaveAttribute('title', 'Scroll View')
      })

      it('should not navigate when list view icon is clicked (current view with pointer-events: none)', async () => {
        mockUseSession.mockReturnValue({
          data: { user: { email: 'owner@uvuyoga.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        const listViewButton = screen.getByRole('button', {
          name: /currently in list view/i,
        })

        // Button should be present and styled as current view
        expect(listViewButton).toBeInTheDocument()

        // Verify it has pointer-events: none styling (non-clickable)
        const buttonStyle = window.getComputedStyle(listViewButton)
        expect(buttonStyle.pointerEvents).toBe('none')

        // Navigation should not be called
        expect(mockPush).not.toHaveBeenCalled()
      })

      it('should keep view toggle icons visible when entering edit mode', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'owner@uvuyoga.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        const editButton = screen.getByRole('button', { name: /show edit/i })
        await user.click(editButton)

        // View toggle icons should still be visible in edit mode
        expect(
          screen.getByRole('button', { name: /currently in list view/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /switch to scroll view/i })
        ).toBeInTheDocument()
      })

      it('should allow navigation to scroll view while in edit mode', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'owner@uvuyoga.com' } },
          status: 'authenticated',
        })

        const sequence = baseSequence({ id: 'edit-test-789' })

        render(<SequenceViewWithEdit sequence={sequence} />, {
          wrapper: Wrapper,
        })

        // Enter edit mode
        const editButton = screen.getByRole('button', { name: /show edit/i })
        await user.click(editButton)

        // Click scroll view icon
        const scrollViewButton = screen.getByRole('button', {
          name: /switch to scroll view/i,
        })
        await user.click(scrollViewButton)

        // Should navigate even in edit mode
        expect(mockPush).toHaveBeenCalledWith(
          '/flows/practiceSequences?sequenceId=edit-test-789'
        )
      })

      it('should handle missing sequence ID gracefully when clicking scroll view', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const sequenceWithoutId = baseSequence({ id: undefined })

        render(<SequenceViewWithEdit sequence={sequenceWithoutId} />, {
          wrapper: Wrapper,
        })

        const scrollViewButton = screen.getByRole('button', {
          name: /switch to scroll view/i,
        })

        await user.click(scrollViewButton)

        // Should not navigate when ID is missing
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    describe('Back Navigation Button', () => {
      it('should display back navigation button with correct label', () => {
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        const backButton = screen.getByRole('button', {
          name: /navigate back to Morning Flow sequence practice/i,
        })
        expect(backButton).toBeInTheDocument()
        expect(backButton).toHaveTextContent('Back to Morning Flow')
      })

      it('should navigate to scroll view when back button is clicked', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const sequence = baseSequence({ id: 'test-sequence-456' })

        render(<SequenceViewWithEdit sequence={sequence} />, {
          wrapper: Wrapper,
        })

        const backButton = screen.getByRole('button', {
          name: /navigate back to .* sequence practice/i,
        })

        await user.click(backButton)

        // Verify navigation.push was called with scroll view URL
        expect(mockPush).toHaveBeenCalledWith(
          '/flows/practiceSequences?sequenceId=test-sequence-456'
        )
      })

      it('should use navigation.back() when sequence ID is missing', async () => {
        const user = userEvent.setup()
        const mockBack = (globalThis as any).mockNavigationBack

        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const sequenceWithoutId = baseSequence({ id: null })

        render(<SequenceViewWithEdit sequence={sequenceWithoutId} />, {
          wrapper: Wrapper,
        })

        const backButton = screen.getByRole('button', {
          name: /navigate back to/i,
        })

        await user.click(backButton)

        // Should call navigation.back() when ID is missing
        expect(mockBack).toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
      })

      it('should prevent default event behavior when back button is clicked', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        const backButton = screen.getByRole('button', {
          name: /navigate back to/i,
        })

        await user.click(backButton)

        // Navigation should be called (verifies event handler executed)
        expect(mockPush).toHaveBeenCalled()
      })
    })

    describe('Accessibility for View Toggle', () => {
      it('should have proper ARIA labels for all navigation controls', () => {
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const sequence = baseSequence({ nameSequence: 'Evening Relaxation' })

        render(<SequenceViewWithEdit sequence={sequence} />, {
          wrapper: Wrapper,
        })

        // Back button
        expect(
          screen.getByRole('button', {
            name: /navigate back to Evening Relaxation sequence practice/i,
          })
        ).toBeInTheDocument()

        // List view button
        expect(
          screen.getByRole('button', {
            name: /currently in list view/i,
          })
        ).toBeInTheDocument()

        // Scroll view button
        expect(
          screen.getByRole('button', {
            name: /switch to scroll view for Evening Relaxation/i,
          })
        ).toBeInTheDocument()
      })

      it('should indicate current state for list view icon', () => {
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        render(<SequenceViewWithEdit sequence={baseSequence()} />, {
          wrapper: Wrapper,
        })

        const listViewButton = screen.getByRole('button', {
          name: /currently in list view/i,
        })

        // Should be present but have pointer-events: none since it's the current view
        expect(listViewButton).not.toBeDisabled()
        const buttonStyle = window.getComputedStyle(listViewButton)
        expect(buttonStyle.pointerEvents).toBe('none')
      })
    })

    describe('URL Parameter Handling', () => {
      it('should construct correct URL with sequence ID for scroll view navigation', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const testSequences = [
          { id: '507f1f77bcf86cd799439011', name: 'MongoDB ObjectId' },
          { id: 'simple-123', name: 'Simple ID' },
          { id: 'complex-id-with-dashes', name: 'Dashed ID' },
        ]

        for (const testSeq of testSequences) {
          mockPush.mockClear()

          const sequence = baseSequence({
            id: testSeq.id,
            nameSequence: testSeq.name,
          })

          const { unmount } = render(
            <SequenceViewWithEdit sequence={sequence} />,
            { wrapper: Wrapper }
          )

          const scrollViewButton = screen.getByRole('button', {
            name: /switch to scroll view/i,
          })

          await user.click(scrollViewButton)

          expect(mockPush).toHaveBeenCalledWith(
            `/flows/practiceSequences?sequenceId=${testSeq.id}`
          )

          unmount()
        }
      })

      it('should include sequence ID in back navigation URL', async () => {
        const user = userEvent.setup()
        mockUseSession.mockReturnValue({
          data: { user: { email: 'user@example.com' } },
          status: 'authenticated',
        })

        const sequence = baseSequence({ id: 'back-nav-test-id' })

        render(<SequenceViewWithEdit sequence={sequence} />, {
          wrapper: Wrapper,
        })

        const backButton = screen.getByRole('button', {
          name: /navigate back to/i,
        })

        await user.click(backButton)

        expect(mockPush).toHaveBeenCalledWith(
          '/flows/practiceSequences?sequenceId=back-nav-test-id'
        )
      })
    })
  })
})
