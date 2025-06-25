import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSession } from 'next-auth/react'
import ActivityStreaks, {
  StreakType,
} from '@app/clientComponents/activityStreaks/ActivityStreaks'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock fetch for API calls
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock MUI icons
jest.mock('@mui/icons-material/TrendingUp', () => ({
  __esModule: true,
  default: () => <div data-testid="trending-up-icon" />,
}))

jest.mock('@mui/icons-material/Whatshot', () => ({
  __esModule: true,
  default: () => <div data-testid="whatshot-icon" />,
}))

jest.mock('@mui/icons-material/CalendarToday', () => ({
  __esModule: true,
  default: () => <div data-testid="calendar-today-icon" />,
}))

describe('ActivityStreaks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()

    // Reset fetch mock to a default successful response
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      url: '/api/user/recordActivity',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      json: async () => ({
        success: true,
        loginRecorded: true,
        streakData: {
          currentStreak: 7,
          longestStreak: 12,
          lastLoginDate: new Date().toISOString(),
          isActiveToday: true,
        },
      }),
    } as Response)

    // Mock browser APIs that the component uses
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (test browser)',
      writable: true,
    })

    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    })

    // Mock window.location.origin for the component
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    })
  })

  describe('authentication states', () => {
    it('shows loading state when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })

      const { container } = render(<ActivityStreaks />)

      // The LoadingSkeleton component shows skeleton elements with MUI classes
      const skeletonElements = container.querySelectorAll('.MuiSkeleton-root')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('shows sign-in message when user is unauthenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      render(<ActivityStreaks />)

      expect(
        screen.getByText('Sign in to view your activity streaks')
      ).toBeInTheDocument()
    })

    it('shows sign-in message when session data is null', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      render(<ActivityStreaks />)

      expect(
        screen.getByText('Sign in to view your activity streaks')
      ).toBeInTheDocument()
    })
  })

  describe('authenticated user with login streak data', () => {
    const mockActivityResponse = {
      success: true,
      loginRecorded: true,
      streakData: {
        currentStreak: 5,
        longestStreak: 12,
        lastLoginDate: new Date().toISOString(),
        isActiveToday: true,
      },
    }

    beforeEach(() => {
      // Clear all mocks first
      jest.clearAllMocks()
      mockFetch.mockClear()

      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => mockActivityResponse,
      } as Response)
    })

    it('renders compact variant with streak data correctly', async () => {
      render(<ActivityStreaks variant="compact" />)

      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })

      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('days')).toBeInTheDocument()
      // Compact variant doesn't show additional details like "Longest:" or "Last:"
    })

    it('renders detailed variant with all streak information', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streaks')).toBeInTheDocument()
      })

      expect(screen.getByText('Login Streak')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('days')).toBeInTheDocument()
      expect(screen.getByText('Best: 12')).toBeInTheDocument()
      expect(screen.getByText('Last: Today')).toBeInTheDocument()
    })

    it('shows active today indicator when user logged in today', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByTestId('whatshot-icon')).toBeInTheDocument()
      })
    })

    it('makes correct API call for recording activity and getting streak data', async () => {
      render(<ActivityStreaks />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/user/recordActivity',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'user123',
              activityType: 'view_streaks',
            }),
          })
        )
      })
    })

    it('displays appropriate streak message based on streak length', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(
          screen.getByText("You're building momentum!")
        ).toBeInTheDocument()
      })
    })
  })

  describe('streak message logic', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('shows start message for zero streak', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: false,
          streakData: {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isActiveToday: false,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(
          screen.getByText('Start your login streak streak!')
        ).toBeInTheDocument()
      })
    })

    it('shows momentum message for moderate streak', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 5,
            longestStreak: 8,
            lastLoginDate: '2025-06-14T10:00:00Z',
            isActiveToday: true,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(
          screen.getByText("You're building momentum!")
        ).toBeInTheDocument()
      })
    })

    it('shows excellent message for long streak', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 15,
            longestStreak: 20,
            lastLoginDate: '2025-06-14T10:00:00Z',
            isActiveToday: true,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Excellent consistency!')).toBeInTheDocument()
      })
    })

    it('shows amazing message for very long streak', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 45,
            longestStreak: 50,
            lastLoginDate: '2025-06-14T10:00:00Z',
            isActiveToday: true,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Amazing dedication!')).toBeInTheDocument()
      })
    })
  })

  describe('extensibility with multiple streak types', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 3,
            longestStreak: 7,
            lastLoginDate: '2025-06-13T15:30:00Z',
            isActiveToday: false,
          },
        }),
      } as Response)
    })

    it('handles multiple streak types prop correctly', async () => {
      const streakTypes: StreakType[] = ['login', 'asana', 'meditation']
      render(<ActivityStreaks streakTypes={streakTypes} variant="detailed" />)

      // Should only show login streak for now since others aren't implemented
      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })

      // Should not crash when additional types are provided
      expect(screen.queryByText('Asana Practice')).not.toBeInTheDocument()
      expect(screen.queryByText('Meditation')).not.toBeInTheDocument()
    })

    it('defaults to login streak type when no types specified', async () => {
      render(<ActivityStreaks />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/user/recordActivity',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'user123',
              activityType: 'view_streaks',
            }),
          })
        )
      })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('shows error message when API call fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await act(async () => {
        render(<ActivityStreaks />)
      })

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load streak data')
        ).toBeInTheDocument()
      })
    })

    it('shows error message when API returns server error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        url: '/api/user/loginStreak?userId=user123',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({ error: 'Server error' }),
      } as Response)

      await act(async () => {
        render(<ActivityStreaks />)
      })

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load streak data')
        ).toBeInTheDocument()
      })
    })

    it('shows fallback data for client errors (4xx)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: '/api/user/loginStreak?userId=user123',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({ error: 'User not found' }),
      } as Response)

      render(<ActivityStreaks />)

      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })

      // Should show fallback data with 0 streak for client errors
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('days')).toBeInTheDocument()
    })

    it('shows no data message when streak data is empty', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: false,
          streakData: {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isActiveToday: false,
          },
        }),
      } as Response)

      render(<ActivityStreaks />)

      // Wait for the component to finish loading and render streak data
      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })

      // Component should still render with zero streak data, not show "no data" message
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('date formatting', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('formats "Today" for same day activity', async () => {
      const today = new Date().toISOString()
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 1,
            longestStreak: 1,
            lastLoginDate: today,
            isActiveToday: true,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Last: Today')).toBeInTheDocument()
      })
    })

    it('formats "Yesterday" for previous day activity', async () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 1,
            longestStreak: 1,
            lastLoginDate: yesterday.toISOString(),
            isActiveToday: false,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Last: Yesterday')).toBeInTheDocument()
      })
    })

    it('does not show last activity info when streak is zero', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: false,
          streakData: {
            currentStreak: 0,
            longestStreak: 0,
            lastLoginDate: null,
            isActiveToday: false,
          },
        }),
      } as Response)

      render(<ActivityStreaks />)

      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })

      // Should not show "Last:" info when streak is 0
      expect(screen.queryByText(/Last:/)).not.toBeInTheDocument()
    })

    it('formats "Never" for null last activity date with non-zero streak', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 1,
            longestStreak: 1,
            lastLoginDate: null,
            isActiveToday: false,
          },
        }),
      } as Response)

      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Last: Never')).toBeInTheDocument()
      })
    })
  })

  describe('component accessibility', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 7,
            longestStreak: 10,
            lastLoginDate: '2025-06-14T10:00:00Z',
            isActiveToday: true,
          },
        }),
      } as Response)
    })

    it('has proper semantic structure with headings and content', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        // Should have a main heading for the detailed variant
        expect(screen.getByText('Activity Streaks')).toBeInTheDocument()
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })
    })

    it('provides meaningful text for screen readers', async () => {
      render(<ActivityStreaks />)

      await waitFor(() => {
        // Numbers and labels should be clearly associated
        expect(screen.getByText('7')).toBeInTheDocument()
        expect(screen.getByText('days')).toBeInTheDocument()
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })
    })

    it('includes tooltip information for icons when active today', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        const activeIcon = screen.getByTestId('whatshot-icon')
        expect(activeIcon).toBeInTheDocument()
        // Icon should be within a tooltip component
        expect(
          activeIcon.closest('[title]') || activeIcon.closest('[aria-label]')
        ).toBeTruthy()
      })
    })
  })

  describe('loading states and race conditions', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })
    })

    it('shows loading state while fetching data', () => {
      // Create a promise that won't resolve immediately
      const pendingPromise = new Promise(() => {})
      mockFetch.mockReturnValue(pendingPromise as any)

      render(<ActivityStreaks />)

      // The LoadingSkeleton component shows skeleton elements, not text
      const skeletonElements = document.querySelectorAll('.MuiSkeleton-root')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })

    it('handles initialization flag correctly to prevent loops', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        url: '/api/user/recordActivity',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: async () => ({
          success: true,
          loginRecorded: true,
          streakData: {
            currentStreak: 1,
            longestStreak: 1,
            lastLoginDate: '2025-06-14T10:00:00Z',
            isActiveToday: true,
          },
        }),
      } as Response)

      render(<ActivityStreaks />)

      await waitFor(() => {
        expect(screen.getByText('Login Streak')).toBeInTheDocument()
      })

      // Should only make one API call, not loop
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})
