import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import SequenceViewWithEdit from '@clientComponents/SequenceViewWithEdit'

// Mock next/image to avoid DOM warnings from the "fill" prop
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

// Mock Next.js app router to avoid invariant errors when EditSequence uses useRouter
jest.mock('next/navigation', () => {
  const push = jest.fn()
  ;(global as any).__routerPushMock = push
  return {
    __esModule: true,
    useRouter: () => ({
      push,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
  }
})

// Mock NextAuth session
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
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
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

    it('should handle legacy string format poses in series', () => {
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

      // Verify pose names are parsed and displayed
      expect(screen.getByText('Warrior II')).toBeInTheDocument()
      expect(screen.getByText('Triangle Pose')).toBeInTheDocument()

      // Verify Sanskrit names are parsed and displayed
      expect(screen.getByText('Virabhadrasana II')).toBeInTheDocument()
      expect(screen.getByText('Trikonasana')).toBeInTheDocument()
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
})
