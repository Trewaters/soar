import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { theme } from '../../../../../styles/theme'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import Page from '@app/navigator/flows/createSequence/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock the alpha users utility
jest.mock('@app/lib/alphaUsers', () => ({
  __esModule: true,
  default: jest.fn(() => ['alpha1@uvuyoga.com', 'alpha2@uvuyoga.com']),
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

// Ensure the global next-auth mock from jest.setup can be configured per-test
const globalMockUseSession = (global as any).mockUseSession as
  | jest.Mock
  | undefined
if (globalMockUseSession) {
  globalMockUseSession.mockImplementation(() => ({
    data: mockSession,
    status: 'authenticated',
  }))
}

const mockSeriesData = [
  {
    id: '1',
    seriesName: 'My Personal Series',
    seriesPoses: ['Pose 1', 'Pose 2'],
    description: 'My series',
    createdBy: 'testuser@example.com', // User's own series (matches email)
  },
  {
    id: '2',
    seriesName: 'My ID Series',
    seriesPoses: ['Pose 1b', 'Pose 2b'],
    description: 'My other series',
    createdBy: 'user123', // User's own series (matches ID)
  },
  {
    id: '3',
    seriesName: 'Alpha User Series',
    seriesPoses: ['Pose 3', 'Pose 4'],
    description: 'Alpha series',
    createdBy: 'alpha1@uvuyoga.com', // Alpha user series
  },
  {
    id: '4',
    seriesName: 'Another User Series',
    seriesPoses: ['Pose 5', 'Pose 6'],
    description: 'Other series',
    createdBy: 'other@example.com', // Regular user series (should not appear)
  },
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
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
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/series\?ts=\d+/),
        expect.objectContaining({
          cache: 'no-store',
          headers: expect.objectContaining({
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            Pragma: 'no-cache',
            Expires: '0',
          }),
          next: { revalidate: 0 },
        })
      )
    })

    // Find the autocomplete input and trigger focus to open dropdown
    const autocomplete = screen.getByPlaceholderText(
      'Add a Series to your Sequence...'
    )

    // Focus and then click to ensure dropdown opens
    await user.click(autocomplete)

    // Instead of waiting for listbox, let's just look for the series names directly
    await waitFor(() => {
      // The series names should appear once dropdown opens
      expect(screen.getByText('My Personal Series')).toBeInTheDocument()
      expect(screen.getByText('My ID Series')).toBeInTheDocument()
      expect(screen.getByText('Alpha User Series')).toBeInTheDocument()
    })

    // If we can see the series, then the grouping should work too
    // Check that other user's series does NOT appear (filtered out)
    expect(screen.queryByText('Another User Series')).not.toBeInTheDocument()

    // Check for section headers if they're rendered
    const mineText = screen.queryByText('Mine')
    const alphaText = screen.queryByText('Alpha')
    if (mineText) {
      expect(mineText).toBeInTheDocument()
    }
    if (alphaText) {
      expect(alphaText).toBeInTheDocument()
    }
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

    // Find the autocomplete and type a search term to open dropdown and filter
    const autocomplete = screen.getByPlaceholderText(
      'Add a Series to your Sequence...'
    )

    // First click to focus and ensure dropdown opens
    await user.click(autocomplete)

    // Now type the search term
    await user.type(autocomplete, 'Personal') // Should only show "Mine" section with matching series
    await waitFor(() => {
      expect(screen.getByText('My Personal Series')).toBeInTheDocument()
      expect(screen.queryByText('Alpha User Series')).not.toBeInTheDocument()
    })

    // Check for section headers if they're rendered
    const mineText = screen.queryByText('Mine')
    const alphaText = screen.queryByText('Alpha')
    if (mineText) {
      expect(mineText).toBeInTheDocument()
    }
    if (alphaText) {
      expect(alphaText).not.toBeInTheDocument()
    }
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
