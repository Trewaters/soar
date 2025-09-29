import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import Page from '@app/navigator/flows/createSequence/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock the alpha users utility
jest.mock('@app/lib/alphaUsers', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve(['alpha1@uvuyoga.com', 'alpha2@uvuyoga.com'])
  ),
}))

// Mock the series fetch function
global.fetch = jest.fn()

const mockSessionUser = {
  id: 'user123',
  email: 'testuser@example.com',
  name: 'Test User',
}

const mockSession = {
  user: mockSessionUser,
  expires: '2024-01-01',
}

const mockSeriesData = [
  {
    id: '1',
    seriesName: 'My Personal Series',
    seriesPostures: ['Pose 1', 'Pose 2'],
    description: 'My series',
    createdBy: 'testuser@example.com', // User's own series
  },
  {
    id: '2',
    seriesName: 'Alpha User Series',
    seriesPostures: ['Pose 3', 'Pose 4'],
    description: 'Alpha series',
    createdBy: 'alpha1@uvuyoga.com', // Alpha user series
  },
  {
    id: '3',
    seriesName: 'Another User Series',
    seriesPostures: ['Pose 5', 'Pose 6'],
    description: 'Other series',
    createdBy: 'other@example.com', // Regular user series (should not appear)
  },
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

describe('CreateSequence Series Grouping', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSeriesData),
    })
  })

  it('groups series into Mine and Alpha User sections', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/series', { cache: 'no-store' })
    })

    // Find and click the autocomplete
    const autocomplete = screen.getByPlaceholderText(
      'Add a Series to your Sequence...'
    )
    await user.click(autocomplete)

    // Check that grouped sections appear
    await waitFor(() => {
      expect(screen.getByText('Mine')).toBeInTheDocument()
      expect(screen.getByText('Alpha')).toBeInTheDocument()
    })

    // Check that user's series appears under "Mine"
    expect(screen.getByText('My Personal Series')).toBeInTheDocument()

    // Check that alpha user's series appears under "Alpha"
    expect(screen.getByText('Alpha User Series')).toBeInTheDocument()

    // Check that other user's series does NOT appear (filtered out)
    expect(screen.queryByText('Another User Series')).not.toBeInTheDocument()
  })

  it('filters grouped series based on search input', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })

    // Find the autocomplete and type a search term
    const autocomplete = screen.getByPlaceholderText(
      'Add a Series to your Sequence...'
    )
    await user.type(autocomplete, 'Personal')

    // Should only show "Mine" section with matching series
    await waitFor(() => {
      expect(screen.getByText('Mine')).toBeInTheDocument()
      expect(screen.getByText('My Personal Series')).toBeInTheDocument()
      expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
      expect(screen.queryByText('Alpha User Series')).not.toBeInTheDocument()
    })
  })

  it('handles empty results gracefully', async () => {
    const user = userEvent.setup()

    // Mock empty series data
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })

    render(
      <TestWrapper>
        <Page />
      </TestWrapper>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })

    // Click autocomplete
    const autocomplete = screen.getByPlaceholderText(
      'Add a Series to your Sequence...'
    )
    await user.click(autocomplete)

    // Should not show any group headers
    expect(screen.queryByText('Mine')).not.toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })
})
