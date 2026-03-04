import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSession, signIn } from 'next-auth/react'
import AsanaActivityList from '@app/clientComponents/AsanaActivityList'
import { fetchCombinedUserActivities } from '@app/lib/activityStreakClient'
import userEvent from '@testing-library/user-event'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}))

// Mock centralized activity helper
jest.mock('@app/lib/activityStreakClient', () => ({
  fetchCombinedUserActivities: jest.fn(),
}))

// Mock LoadingSkeleton
jest.mock('@app/clientComponents/LoadingSkeleton', () => {
  return function MockLoadingSkeleton() {
    return <div data-testid="loading-skeleton">Loading...</div>
  }
})

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockFetchCombinedUserActivities =
  fetchCombinedUserActivities as jest.MockedFunction<
    typeof fetchCombinedUserActivities
  >

describe('AsanaActivityList Component', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication States', () => {
    it('should show loading skeleton when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      })

      render(<AsanaActivityList />)
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    })

    it('should show login prompt and button when unauthenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      render(<AsanaActivityList />)

      expect(
        screen.getByText(/Log in to view activities marked completed/i)
      ).toBeInTheDocument()
      const loginButton = screen.getByRole('button', { name: /login/i })
      expect(loginButton).toBeInTheDocument()
    })

    it('should call signIn when login button is clicked', async () => {
      const user = userEvent.setup()
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      })

      render(<AsanaActivityList />)

      const loginButton = screen.getByRole('button', { name: /login/i })
      await user.click(loginButton)

      expect(mockSignIn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Activity Data Loading', () => {
    it('should show "No activity found" when no items exist', async () => {
      mockUseSession.mockReturnValue({
        data: { user: mockUser, expires: '1' },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetchCombinedUserActivities.mockResolvedValue([])

      render(<AsanaActivityList />)

      await waitFor(() => {
        expect(screen.getByText(/No activity found/i)).toBeInTheDocument()
      })
    })

    it('should display combined activities when authenticated', async () => {
      mockUseSession.mockReturnValue({
        data: { user: mockUser, expires: '1' },
        status: 'authenticated',
        update: jest.fn(),
      })

      const mockAsanaActivities = [
        {
          id: '1',
          userId: 'user-123',
          asanaId: 'asana-1',
          asanaName: 'Downward Dog',
          datePerformed: new Date().toISOString(),
          completionStatus: 'complete',
          duration: 30,
          notes: 'Great pose',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          type: 'asana',
        },
      ]

      const mockSeriesActivities = [
        {
          id: '2',
          userId: 'user-123',
          seriesId: 'series-1',
          seriesName: 'Morning Series',
          datePerformed: new Date().toISOString(),
          completionStatus: 'complete',
          duration: 600,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          type: 'series',
        },
      ]

      mockFetchCombinedUserActivities.mockResolvedValue([
        ...(mockAsanaActivities as any),
        ...(mockSeriesActivities as any),
      ])

      render(<AsanaActivityList />)

      await waitFor(() => {
        expect(screen.getByText('Downward Dog')).toBeInTheDocument()
        expect(screen.getByText('Morning Series')).toBeInTheDocument()
      })
    })

    it('should handle errors gracefully', async () => {
      mockUseSession.mockReturnValue({
        data: { user: mockUser, expires: '1' },
        status: 'authenticated',
        update: jest.fn(),
      })

      mockFetchCombinedUserActivities.mockRejectedValue(
        new Error('Failed to fetch')
      )

      render(<AsanaActivityList />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument()
      })
    })
  })
})
