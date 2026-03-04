import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '@styles/theme'

// Mock next-auth/react useSession
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@uvuyoga.com',
        name: 'Test Yogi',
      },
      expires: '2099-12-31T23:59:59.999Z',
    },
    status: 'authenticated',
  }),
}))

// Mock UserContext UseUser
jest.mock('@context/UserContext', () => ({
  UseUser: () => ({
    state: {
      userData: {
        id: 'test-user-id',
        email: 'test@uvuyoga.com',
        name: 'Test Yogi',
      },
    },
  }),
}))

import Dashboard from '@app/profile/dashboard/page'

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
jest.mock('@app/profile/ProfileNavMenu', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="profile-nav-menu">Profile Navigation Menu</div>
  ),
}))

// Helper to set up the main fetch mock implementation
function setupMainFetchMock(loginStreak = 7) {
  // Use dynamic recent dates so tests are robust regardless of current date.
  const now = new Date()
  const mockActivityHistory = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    // Normalize to 10:00:00Z for consistency with earlier fixtures
    d.setUTCHours(10, 0, 0, 0)
    return { datePerformed: d.toISOString() }
  })

  ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
    if (url === '/api/user/recordActivity') {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          streakData: { currentStreak: loginStreak },
        }),
      })
    }
    if (url.startsWith('/api/dashboard/stats')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: mockDashboardData }),
      })
    }
    if (url.startsWith('/api/asanaActivity?userId=')) {
      return Promise.resolve({
        ok: true,
        json: async () => mockActivityHistory,
      })
    }
    if (
      url.startsWith('/api/seriesActivity?userId=') ||
      url.startsWith('/api/sequenceActivity?userId=')
    ) {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      })
    }
    return Promise.reject(new Error('Unknown URL'))
  })
}

// Mock fetch API
global.fetch = jest.fn()

interface DashboardData {
  loginStreak: number
  longestLoginStreak: number
  activityStreak: number
  activityStreakAtRisk: boolean
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
    tiersAchieved: number
    tierName?: string
    ultimateGoalsCompleted: number
  }
}

const mockDashboardData: DashboardData = {
  loginStreak: 7,
  longestLoginStreak: 21,
  activityStreak: 5,
  activityStreakAtRisk: false,
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
    tiersAchieved: 0,
    tierName: '',
    ultimateGoalsCompleted: 0,
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
    setupMainFetchMock()
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

    it('should display longest activity streak stat card', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Longest Activity Streak')).toBeInTheDocument()
        expect(screen.getByText('🏆 7 Days')).toBeInTheDocument()
      })
    })

    it('should display longest login streak stat card', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Longest Login Streak')).toBeInTheDocument()
        expect(screen.getByText('🏆 21 Days')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should display CircularProgress only while loading', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      // After data loads, verify CircularProgress is not present
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      // Only LinearProgress should remain (in the goal section)
      const progressBars = screen.getAllByRole('progressbar')
      const circularProgress = progressBars.find(
        (el) => el.tagName.toLowerCase() === 'svg'
      )
      expect(circularProgress).toBeUndefined()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            text: async () => 'Server error',
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to fetch dashboard statistics/i)
        ).toBeInTheDocument()
      })
    })

    it('should display error message when response format is invalid', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: false }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Invalid response format')).toBeInTheDocument()
      })
    })

    it('should display error message when fetch throws exception', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should display generic error message for non-Error exceptions', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.reject('Unknown error')
        }
        return Promise.reject(new Error('Unknown URL'))
      })

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
      setupMainFetchMock(7)
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Current Login Streak')).toBeInTheDocument()
        expect(screen.getAllByText('🔥 7 Days').length).toBeGreaterThanOrEqual(
          1
        )
      })
    })

    it('should display activity streak card with correct value', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Current Activity Streak')).toBeInTheDocument()
        expect(screen.getAllByText('🔥 7 Days').length).toBeGreaterThanOrEqual(
          1
        )
      })
    })

    it('should display both streak cards', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Current Login Streak')).toBeInTheDocument()
        expect(screen.getByText('Current Activity Streak')).toBeInTheDocument()
      })
    })

    it('should show warning message when activity streak is at risk today', async () => {
      const atRiskData = {
        ...mockDashboardData,
        activityStreak: 8,
        activityStreakAtRisk: true,
      }

      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              streakData: { currentStreak: 7 },
            }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, data: atRiskData }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Current Activity Streak')).toBeInTheDocument()
        expect(screen.getByText('🔥 8 Days')).toBeInTheDocument()
        expect(
          screen.getByText('Save your streak—record activity today.')
        ).toBeInTheDocument()
      })

      setupMainFetchMock()
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
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: { ...mockDashboardData, practiceHistory: [] },
            }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
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

  describe('Most Common Flows', () => {
    it('should display most common flows section', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Most Common Flows')).toBeInTheDocument()
      })
    })

    it('should display all three most common flows', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
        expect(screen.getByText('Standing Series')).toBeInTheDocument()
        expect(screen.getByText('Core Strength')).toBeInTheDocument()
      })
    })

    it('should display count for each flow', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Verify series names and counts directly
        expect(screen.getByText('Sun Salutation A')).toBeInTheDocument()
        expect(screen.getByText('Standing Series')).toBeInTheDocument()
        expect(screen.getByText('Core Strength')).toBeInTheDocument()

        // Check specific counts appear in document (they may appear elsewhere too)
        const allText = screen.getByText('Most Common Flows').closest('div')
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
        expect(
          screen.getByText('Next Goal: Practice 23 More Days')
        ).toBeInTheDocument()
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

    it('should show jeopardy warning in goals section when streak is at risk', async () => {
      const atRiskGoalData = {
        ...mockDashboardData,
        activityStreak: 9,
        activityStreakAtRisk: true,
        nextGoal: {
          ...mockDashboardData.nextGoal,
          current: 9,
          progress: 30,
        },
      }

      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              streakData: { currentStreak: 7 },
            }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, data: atRiskGoalData }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(
          screen.getByText(
            'Streak in jeopardy — record activity today or it resets to zero.'
          )
        ).toBeInTheDocument()
      })

      setupMainFetchMock()
    })
  })

  describe('Data Fetching', () => {
    it('should fetch data from correct API endpoints', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/recordActivity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String),
        })
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/dashboard/stats'),
          {
            cache: 'no-store',
          }
        )
      })
    })

    it('should fetch data on component mount', async () => {
      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Should call recordActivity + stats + 3 activity sources
        expect(global.fetch).toHaveBeenCalledTimes(5)
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
      expect(screen.getByText('Current Login Streak')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero streaks gracefully', async () => {
      const zeroStreakData = {
        ...mockDashboardData,
        loginStreak: 0,
        activityStreak: 0,
        nextGoal: {
          ...mockDashboardData.nextGoal,
          current: 0,
          target: 30,
          progress: 0,
          tiersAchieved: 0,
          tierName: 'Get started!',
        },
      }
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, data: zeroStreakData }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Only two streak cards should show "🔥 0 Days" (Login and Activity)
        const zeroStreaks = screen.getAllByText(/0\s*Days/)
        expect(zeroStreaks).toHaveLength(2)
        expect(screen.getByText('(Get started!)')).toBeInTheDocument()
      })

      // Restore the main fetch mock for other tests
      setupMainFetchMock()
    })

    it('should handle empty most common lists gracefully', async () => {
      const emptyListsData = {
        ...mockDashboardData,
        mostCommonAsanas: [],
        mostCommonSeries: [],
        mostCommonSequences: [],
      }
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, data: emptyListsData }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText('Most Common Asanas')).toBeInTheDocument()
      })

      setupMainFetchMock()
    })

    it('should handle very high streak values', async () => {
      const highStreakData = {
        ...mockDashboardData,
        loginStreak: 365,
      }
      ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === '/api/user/recordActivity') {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              success: true,
              streakData: { currentStreak: 365 },
            }),
          })
        }
        if (url.startsWith('/api/dashboard/stats')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, data: highStreakData }),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<Dashboard />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByText(/365\s*Days/)).toBeInTheDocument()
      })

      setupMainFetchMock()
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
