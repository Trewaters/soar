import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '../../../../../styles/theme'
import Dashboard from '../../../../../app/navigator/profile/dashboard/page'

// Mock PracticeHistoryChart component
jest.mock('@clientComponents/PracticeHistoryChart', () => ({
  __esModule: true,
  default: ({ data }: { data: Array<{ month: string; days: number }> }) => (
    <div data-testid="practice-history-chart">
      {data.map((item, index) => (
        <div key={index} data-testid={`chart-item-${index}`}>
          {item.month}: {item.days}
        </div>
      ))}
    </div>
  ),
}))

// Mock ProfileNavMenu component
jest.mock('@app/navigator/profile/ProfileNavMenu', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="profile-nav-menu">Profile Navigation Menu</div>
  ),
}))

// Mock fetch API
global.fetch = jest.fn()

interface DashboardData {
  loginStreak: number
  activityStreak: number
  longestStreak: number
  practiceHistory: Array<{ month: string; days: number }>
  mostCommonAsanas: Array<{ name: string; count: number }>
  mostCommonSeries: Array<{ name: string; count: number }>
  mostCommonSequences: Array<{ name: string; count: number }>
  nextGoal: {
    text: string
    current: number
    target: number
    progress: number
  }
}

const mockDashboardData: DashboardData = {
  loginStreak: 7,
  activityStreak: 5,
  longestStreak: 14,
  practiceHistory: [
    { month: 'Nov 24', days: 12 },
    { month: 'Dec 24', days: 15 },
    { month: 'Jan 25', days: 18 },
    { month: 'Feb 25', days: 14 },
    { month: 'Mar 25', days: 20 },
    { month: 'Apr 25', days: 16 },
    { month: 'May 25', days: 19 },
    { month: 'Jun 25', days: 22 },
    { month: 'Jul 25', days: 17 },
    { month: 'Aug 25', days: 21 },
    { month: 'Sep 25', days: 18 },
    { month: 'Oct 25', days: 15 },
  ],
  mostCommonAsanas: [
    { name: 'Downward-Facing Dog', count: 45 },
    { name: 'Warrior II', count: 38 },
    { name: 'Tree Pose', count: 32 },
  ],
  mostCommonSeries: [
    { name: 'Sun Salutation A', count: 25 },
    { name: 'Standing Series', count: 18 },
    { name: 'Core Strength', count: 15 },
  ],
  mostCommonSequences: [
    { name: 'Morning Flow', count: 30 },
    { name: 'Evening Wind Down', count: 22 },
    { name: 'Power Vinyasa', count: 18 },
  ],
  nextGoal: {
    text: '30 Day Streak',
    current: 7,
    target: 30,
    progress: 23.33,
  },
}

// Standard test wrapper for Soar components
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockDashboardData }),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render without errors', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })
    })

    it('should display ProfileNavMenu component', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByTestId('profile-nav-menu')).toBeInTheDocument()
      })
    })

    it('should display header and subtitle', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(
          screen.getByText('Your progress at a glance.')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should display loading spinner while fetching data', () => {
      ;(global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({ success: true, data: mockDashboardData }),
              })
            }, 100)
          })
      )

      render(<Dashboard />, { wrapper: TestWrapper })

      // CircularProgress shows while loading
      const loadingSpinner = screen.getByRole('progressbar')
      expect(loadingSpinner).toBeInTheDocument()
      expect(loadingSpinner.tagName).toBe('svg') // CircularProgress is an SVG
    })

    it('should hide CircularProgress spinner after data is loaded', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // After loading, only LinearProgress should remain (in the goal section)
        const progressBars = screen.getAllByRole('progressbar')
        // LinearProgress is a span element
        const circularProgress = progressBars.find((el) => el.tagName === 'svg')
        expect(circularProgress).toBeUndefined()
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(
          screen.getByText('Failed to fetch dashboard statistics')
        ).toBeInTheDocument()
      })
    })

    it('should display error message when response format is invalid', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: false }),
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Invalid response format')).toBeInTheDocument()
      })
    })

    it('should display error message when fetch throws exception', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should display generic error message for non-Error exceptions', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue('Unknown error')

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load dashboard data')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Streak Cards Display', () => {
    it('should display login streak card with correct value', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
        expect(screen.getByText('🔥 7 Days')).toBeInTheDocument()
      })
    })

    it('should display activity streak card with correct value', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Activity Streak')).toBeInTheDocument()
        expect(screen.getByText('🔥 5 Days')).toBeInTheDocument()
      })
    })

    it('should display longest streak card with correct value', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Longest Streak')).toBeInTheDocument()
        expect(screen.getByText('🔥 14 Days')).toBeInTheDocument()
      })
    })

    it('should display all three streak cards', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
        expect(screen.getByText('Activity Streak')).toBeInTheDocument()
        expect(screen.getByText('Longest Streak')).toBeInTheDocument()
      })
    })
  })

  describe('Practice History Chart', () => {
    it('should display practice history chart section', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(
          screen.getByText('12 Month Practice History')
        ).toBeInTheDocument()
      })
    })

    it('should render PracticeHistoryChart component with data', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByTestId('practice-history-chart')).toBeInTheDocument()
      })
    })

    it('should pass correct practice history data to chart', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Nov 24: 12')).toBeInTheDocument()
        expect(screen.getByText('Dec 24: 15')).toBeInTheDocument()
        expect(screen.getByText('Oct 25: 15')).toBeInTheDocument()
      })
    })

    it('should display "No practice data" message when history is empty', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { ...mockDashboardData, practiceHistory: [] },
        }),
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(
          screen.getByText('No practice data available yet')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Most Common Asanas', () => {
    it('should display most common asanas section', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Most Common Asanas')).toBeInTheDocument()
      })
    })

    it('should display all three most common asanas', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Downward-Facing Dog')).toBeInTheDocument()
        expect(screen.getByText('Warrior II')).toBeInTheDocument()
        expect(screen.getByText('Tree Pose')).toBeInTheDocument()
      })
    })

    it('should display count for each asana', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        const counts = screen.getAllByText(/^(45|38|32)$/)
        expect(counts).toHaveLength(3)
      })
    })
  })

  describe('Most Common Series', () => {
    it('should display most common series section', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Most Common Series')).toBeInTheDocument()
      })
    })

    it('should display all three most common series', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
        expect(screen.getByText('Standing Series')).toBeInTheDocument()
        expect(screen.getByText('Core Strength')).toBeInTheDocument()
      })
    })

    it('should display count for each series', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Verify series names and counts directly
        expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
        expect(screen.getByText('Standing Series')).toBeInTheDocument()
        expect(screen.getByText('Core Strength')).toBeInTheDocument()

        // Check specific counts appear in document (they may appear elsewhere too)
        const allText = screen.getByText('Most Common Series').closest('div')
        expect(allText).toHaveTextContent('25')
        expect(allText).toHaveTextContent('18')
        expect(allText).toHaveTextContent('15')
      })
    })
  })

  describe('Most Common Sequences', () => {
    it('should display most common sequences section', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Most Common Sequences')).toBeInTheDocument()
      })
    })

    it('should display all three most common sequences', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
        expect(screen.getByText('Evening Wind Down')).toBeInTheDocument()
        expect(screen.getByText('Power Vinyasa')).toBeInTheDocument()
      })
    })

    it('should display count for each sequence', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Verify sequence names and counts directly
        expect(screen.getByText('Morning Flow')).toBeInTheDocument()
        expect(screen.getByText('Evening Wind Down')).toBeInTheDocument()
        expect(screen.getByText('Power Vinyasa')).toBeInTheDocument()

        // Check specific counts appear in the sequences section
        const sequencesSection = screen
          .getByText('Most Common Sequences')
          .closest('div')
        expect(sequencesSection).toHaveTextContent('30')
        expect(sequencesSection).toHaveTextContent('22')
        expect(sequencesSection).toHaveTextContent('18')
      })
    })
  })

  describe('Next Goal Section', () => {
    it('should display next goal section', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Next Goal: 30 Day Streak')).toBeInTheDocument()
      })
    })

    it('should display progress indicator', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar')
        // MUI rounds the aria-valuenow to an integer
        expect(progressBar).toHaveAttribute('aria-valuenow', '23')
      })
    })

    it('should display current and target values', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('7 / 30 days')).toBeInTheDocument()
      })
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data from correct API endpoint', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/dashboard/stats', {
          cache: 'no-store',
        })
      })
    })

    it('should fetch data on component mount', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Responsive Layout', () => {
    it('should render with Grid2 container layout', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      // Verify ProfileNavMenu and content are both rendered
      expect(screen.getByTestId('profile-nav-menu')).toBeInTheDocument()
      expect(screen.getByText('Login Streak')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero streaks gracefully', async () => {
      const zeroStreakData = {
        ...mockDashboardData,
        loginStreak: 0,
        activityStreak: 0,
        longestStreak: 0,
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: zeroStreakData }),
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // All three streak cards should show "🔥 0 Days"
        const zeroStreaks = screen.getAllByText('🔥 0 Days')
        expect(zeroStreaks).toHaveLength(3)
      })
    })

    it('should handle empty most common lists gracefully', async () => {
      const emptyListsData = {
        ...mockDashboardData,
        mostCommonAsanas: [],
        mostCommonSeries: [],
        mostCommonSequences: [],
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: emptyListsData }),
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Most Common Asanas')).toBeInTheDocument()
      })
    })

    it('should handle very high streak values', async () => {
      const highStreakData = {
        ...mockDashboardData,
        longestStreak: 365,
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: highStreakData }),
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('🔥 365 Days')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { name: 'Dashboard' })
        expect(mainHeading).toBeInTheDocument()
      })
    })

    it('should have accessible progress indicators', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        const progressBars = screen.getAllByRole('progressbar')
        expect(progressBars.length).toBeGreaterThan(0)
      })
    })
  })
})
