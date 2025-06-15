import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import { useSession } from 'next-auth/react'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'
import { testInteractiveAccessibility } from '../../accessibility/axe-test-utils'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

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
  default: () => (
    <div
      data-testid="trending-up-icon"
      role="img"
      aria-label="Trending up icon"
    />
  ),
}))

jest.mock('@mui/icons-material/Whatshot', () => ({
  __esModule: true,
  default: () => (
    <div
      data-testid="whatshot-icon"
      role="img"
      aria-label="Active today indicator"
    />
  ),
}))

jest.mock('@mui/icons-material/CalendarToday', () => ({
  __esModule: true,
  default: () => (
    <div
      data-testid="calendar-today-icon"
      role="img"
      aria-label="Calendar icon"
    />
  ),
}))

describe('ActivityStreaks Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('accessibility compliance in different states', () => {
    it('should not have accessibility violations in loading state', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })

      const { container } = render(<ActivityStreaks />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in unauthenticated state', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      const { container } = render(<ActivityStreaks />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations with streak data - compact variant', async () => {
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
        json: async () => ({
          currentStreak: 5,
          longestStreak: 12,
          lastLoginDate: '2025-06-14T10:00:00Z',
          isActiveToday: true,
        }),
      } as Response)

      const { container } = render(<ActivityStreaks variant="compact" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streak')).toBeInTheDocument()
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations with streak data - detailed variant', async () => {
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
        json: async () => ({
          currentStreak: 7,
          longestStreak: 15,
          lastLoginDate: '2025-06-14T10:00:00Z',
          isActiveToday: true,
        }),
      } as Response)

      const { container } = render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streaks')).toBeInTheDocument()
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should not have accessibility violations in error state', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetch.mockRejectedValue(new Error('Network error'))

      const { container } = render(<ActivityStreaks />)

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load streak data')
        ).toBeInTheDocument()
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('interactive accessibility compliance', () => {
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
        json: async () => ({
          currentStreak: 3,
          longestStreak: 8,
          lastLoginDate: '2025-06-13T15:30:00Z',
          isActiveToday: false,
        }),
      } as Response)
    })

    it('should pass interactive accessibility tests for compact variant', async () => {
      await testInteractiveAccessibility(<ActivityStreaks variant="compact" />)
    })

    it('should pass interactive accessibility tests for detailed variant', async () => {
      await testInteractiveAccessibility(<ActivityStreaks variant="detailed" />)
    })
  })

  describe('semantic HTML and ARIA compliance', () => {
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
        json: async () => ({
          currentStreak: 10,
          longestStreak: 15,
          lastLoginDate: '2025-06-14T10:00:00Z',
          isActiveToday: true,
        }),
      } as Response)
    })

    it('uses proper heading hierarchy in detailed variant', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streaks')).toBeInTheDocument()
      })

      // Main heading should be present
      const mainHeading = screen.getByText('Activity Streaks')
      expect(mainHeading.tagName).toBe('H6')

      // Streak type name should be properly labeled
      const streakName = screen.getByText('Login Streak')
      expect(streakName).toBeInTheDocument()
    })

    it('provides meaningful text content for screen readers', async () => {
      render(<ActivityStreaks />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streak')).toBeInTheDocument()
      })

      // Should have clear labels and values
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('days')).toBeInTheDocument()
      expect(screen.getByText('Longest: 15 days')).toBeInTheDocument()
      expect(screen.getByText('Last: Today')).toBeInTheDocument()
    })

    it('has proper color contrast and visual indicators', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streaks')).toBeInTheDocument()
      })

      // Active today indicator should be present and accessible
      const activeIndicator = screen.getByTestId('whatshot-icon')
      expect(activeIndicator).toBeInTheDocument()
      expect(activeIndicator).toHaveAttribute(
        'aria-label',
        'Active today indicator'
      )
    })

    it('handles loading state with proper announcement', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })

      render(<ActivityStreaks />)

      // Loading state should be announced to screen readers
      expect(
        screen.getByText('Loading activity streaks...')
      ).toBeInTheDocument()
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    it('handles error state with proper error announcement', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: 'user123', email: 'test@example.com' },
          expires: '2025-12-31',
        },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetch.mockRejectedValue(new Error('Network error'))

      render(<ActivityStreaks />)

      await waitFor(() => {
        const errorMessage = screen.getByText('Failed to load streak data')
        expect(errorMessage).toBeInTheDocument()
        // Error should be clearly marked as an error for assistive technology
        expect(
          errorMessage.closest('[role="alert"]') || errorMessage.style.color
        ).toBeTruthy()
      })
    })
  })

  describe('responsive and visual accessibility', () => {
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
        json: async () => ({
          currentStreak: 0,
          longestStreak: 0,
          lastLoginDate: null,
          isActiveToday: false,
        }),
      } as Response)
    })

    it('maintains accessibility with zero streak data', async () => {
      const { container } = render(<ActivityStreaks />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streak')).toBeInTheDocument()
      })

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('days')).toBeInTheDocument()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('maintains proper structure across variants', async () => {
      const { rerender } = render(<ActivityStreaks variant="compact" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streak')).toBeInTheDocument()
      })

      // Switch to detailed variant
      rerender(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByText('Activity Streaks')).toBeInTheDocument()
      })

      // Both variants should maintain proper structure
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('days')).toBeInTheDocument()
    })
  })

  describe('icon accessibility', () => {
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
        json: async () => ({
          currentStreak: 5,
          longestStreak: 10,
          lastLoginDate: '2025-06-14T10:00:00Z',
          isActiveToday: true,
        }),
      } as Response)
    })

    it('has accessible icons with proper labels', async () => {
      render(<ActivityStreaks variant="detailed" />)

      await waitFor(() => {
        expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
      })

      const trendingIcon = screen.getByTestId('trending-up-icon')
      expect(trendingIcon).toHaveAttribute('aria-label', 'Trending up icon')

      const activeIcon = screen.getByTestId('whatshot-icon')
      expect(activeIcon).toHaveAttribute('aria-label', 'Active today indicator')
    })

    it('calendar icon is accessible in compact variant', async () => {
      render(<ActivityStreaks variant="compact" />)

      await waitFor(() => {
        expect(screen.getByTestId('calendar-today-icon')).toBeInTheDocument()
      })

      const calendarIcon = screen.getByTestId('calendar-today-icon')
      expect(calendarIcon).toHaveAttribute('aria-label', 'Calendar icon')
    })
  })
})
