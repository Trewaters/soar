import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import '@testing-library/jest-dom'

import SequenceViewWithEdit from '@clientComponents/SequenceViewWithEdit'
import { getAllSeries } from '@lib/seriesService'
import theme from '@styles/theme'

// Mock external dependencies
jest.mock('next/navigation')
jest.mock('next-auth/react')
jest.mock('@app/hooks/useNavigationWithLoading')
jest.mock('@lib/seriesService', () => ({
  getAllSeries: jest.fn(),
}))

const mockGetAllSeries = getAllSeries as jest.MockedFunction<
  typeof getAllSeries
>

// Mock session data
const mockSession = {
  user: {
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '2025-01-01',
}

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

describe('SequenceViewWithEdit - Series Data Synchronization', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch fresh series data when sequence is displayed', async () => {
    // Arrange: Mock sequence with series that has stale data
    const mockSequence = {
      id: 'sequence-1',
      nameSequence: 'Morning Flow',
      sequencesSeries: [
        {
          id: 'series-1',
          seriesName: 'Sun Salutation',
          seriesPoses: [
            { sort_english_name: 'Old Pose 1', poseId: 'old-pose-1' },
            { sort_english_name: 'Old Pose 2', poseId: 'old-pose-2' },
          ], // Stale data
          description: 'Old description',
          duration: '10 minutes',
        },
      ],
      created_by: 'test@example.com',
    }

    // Mock the API response with updated series data
    const mockUpdatedSeries = [
      {
        id: 'real-series-id-123',
        seriesName: 'Sun Salutation',
        seriesPoses: [
          { sort_english_name: 'Updated Pose 1', poseId: 'updated-pose-1' },
          { sort_english_name: 'Updated Pose 2', poseId: 'updated-pose-2' },
          { sort_english_name: 'New Pose 3', poseId: 'updated-pose-3' },
        ], // Fresh data
        description: 'Updated description',
        duration: '15 minutes',
      },
    ]

    mockGetAllSeries.mockResolvedValue(mockUpdatedSeries)

    // Act: Render the component
    render(
      <TestWrapper>
        <SequenceViewWithEdit sequence={mockSequence} />
      </TestWrapper>
    )

    // Assert: Check that getAllSeries was called to fetch fresh data
    expect(mockGetAllSeries).toHaveBeenCalledTimes(1)

    // Wait for the component to update with fresh data
    await waitFor(() => {
      expect(screen.getByText('Updated Pose 1')).toBeInTheDocument()
    })

    // Verify the updated poses are displayed
    expect(screen.getByText('Updated Pose 1')).toBeInTheDocument()
    expect(screen.getByText('Updated Pose 2')).toBeInTheDocument()
    expect(screen.getByText('New Pose 3')).toBeInTheDocument()

    // Verify old poses are no longer displayed
    expect(screen.queryByText('Old Pose 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Old Pose 2')).not.toBeInTheDocument()
  })

  it('should handle series that no longer exist in the database', async () => {
    // Arrange: Mock sequence with a series that was deleted
    const mockSequence = {
      id: 'sequence-1',
      nameSequence: 'Evening Flow',
      sequencesSeries: [
        {
          id: 'series-1',
          seriesName: 'Deleted Series',
          seriesPoses: [
            { sort_english_name: 'Pose 1', poseId: 'pose-1' },
            { sort_english_name: 'Pose 2', poseId: 'pose-2' },
          ],
          description: 'This series was deleted',
        },
      ],
      created_by: 'test@example.com',
    }

    // Mock API response without the deleted series
    mockGetAllSeries.mockResolvedValue([
      {
        id: 'other-series-id',
        seriesName: 'Other Series',
        seriesPoses: [
          { sort_english_name: 'Other Pose', poseId: 'other-pose' },
        ],
      },
    ])

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

    // Act: Render the component
    render(
      <TestWrapper>
        <SequenceViewWithEdit sequence={mockSequence} />
      </TestWrapper>
    )

    // Assert: Should still display the original data and log a warning
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Series "Deleted Series" not found in current database'
      )
    })

    // Should still show the original poses since series wasn't found
    expect(screen.getByText('Pose 1')).toBeInTheDocument()
    expect(screen.getByText('Pose 2')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should show loading indicator while fetching fresh series data', async () => {
    // Arrange: Mock sequence and delayed API response
    const mockSequence = {
      id: 'sequence-1',
      nameSequence: 'Test Sequence',
      sequencesSeries: [
        {
          id: 'series-1',
          seriesName: 'Test Series',
          seriesPoses: [{ sort_english_name: 'Pose 1', poseId: 'pose-1' }],
        },
      ],
      created_by: 'test@example.com',
    }

    // Create a promise that resolves after a delay
    let resolveGetSeries: any
    const seriesPromise = new Promise((resolve) => {
      resolveGetSeries = resolve
    })
    mockGetAllSeries.mockReturnValue(seriesPromise as any)

    // Act: Render the component
    render(
      <TestWrapper>
        <SequenceViewWithEdit sequence={mockSequence} />
      </TestWrapper>
    )

    // Assert: Loading indicator should be visible
    expect(screen.getByText('Refreshing series data...')).toBeInTheDocument()

    // Complete the API call
    resolveGetSeries([
      {
        id: 'series-1',
        seriesName: 'Test Series',
        seriesPoses: [
          { sort_english_name: 'Updated Pose', poseId: 'updated-pose' },
        ],
      },
    ])

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.queryByText('Refreshing series data...')
      ).not.toBeInTheDocument()
    })

    expect(screen.getByText('Updated Pose')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    // Arrange: Mock sequence and API error
    const mockSequence = {
      id: 'sequence-1',
      nameSequence: 'Test Sequence',
      sequencesSeries: [
        {
          id: 'series-1',
          seriesName: 'Test Series',
          seriesPoses: [
            { sort_english_name: 'Original Pose', poseId: 'original-pose' },
          ],
        },
      ],
      created_by: 'test@example.com',
    }

    mockGetAllSeries.mockRejectedValue(new Error('Network error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    // Act: Render the component
    render(
      <TestWrapper>
        <SequenceViewWithEdit sequence={mockSequence} />
      </TestWrapper>
    )

    // Assert: Should log error and continue showing original data
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch fresh series data:',
        expect.any(Error)
      )
    })

    // Should still show original poses
    expect(screen.getByText('Original Pose')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('should update multiple series in a sequence correctly', async () => {
    // Arrange: Mock sequence with multiple series
    const mockSequence = {
      id: 'sequence-1',
      nameSequence: 'Complex Sequence',
      sequencesSeries: [
        {
          id: 'series-1',
          seriesName: 'Morning Series',
          seriesPoses: [
            {
              sort_english_name: 'Old Morning Pose',
              poseId: 'old-morning-pose',
            },
          ],
        },
        {
          id: 'series-2',
          seriesName: 'Evening Series',
          seriesPoses: [
            {
              sort_english_name: 'Old Evening Pose',
              poseId: 'old-evening-pose',
            },
          ],
        },
      ],
      created_by: 'test@example.com',
    }

    // Mock API response with updated data for both series
    const mockUpdatedSeries = [
      {
        id: 'real-morning-id',
        seriesName: 'Morning Series',
        seriesPoses: [
          { sort_english_name: 'New Morning Pose 1', poseId: 'new-morning-1' },
          { sort_english_name: 'New Morning Pose 2', poseId: 'new-morning-2' },
        ],
      },
      {
        id: 'real-evening-id',
        seriesName: 'Evening Series',
        seriesPoses: [
          { sort_english_name: 'New Evening Pose 1', poseId: 'new-evening-1' },
          { sort_english_name: 'New Evening Pose 2', poseId: 'new-evening-2' },
        ],
      },
    ]

    mockGetAllSeries.mockResolvedValue(mockUpdatedSeries)

    // Act: Render the component
    render(
      <TestWrapper>
        <SequenceViewWithEdit sequence={mockSequence} />
      </TestWrapper>
    )

    // Assert: All series should be updated with fresh data
    await waitFor(() => {
      expect(screen.getByText('New Morning Pose 1')).toBeInTheDocument()
    })

    // Check all updated poses are present
    expect(screen.getByText('New Morning Pose 1')).toBeInTheDocument()
    expect(screen.getByText('New Morning Pose 2')).toBeInTheDocument()
    expect(screen.getByText('New Evening Pose 1')).toBeInTheDocument()
    expect(screen.getByText('New Evening Pose 2')).toBeInTheDocument()

    // Check old poses are no longer present
    expect(screen.queryByText('Old Morning Pose')).not.toBeInTheDocument()
    expect(screen.queryByText('Old Evening Pose')).not.toBeInTheDocument()
  })

  it('should not fetch data if sequence has no series', () => {
    // Arrange: Mock sequence with no series
    const mockSequence = {
      id: 'sequence-1',
      nameSequence: 'Empty Sequence',
      sequencesSeries: [],
      created_by: 'test@example.com',
    }

    // Act: Render the component
    render(
      <TestWrapper>
        <SequenceViewWithEdit sequence={mockSequence} />
      </TestWrapper>
    )

    // Assert: Should not call the API for empty sequences
    expect(mockGetAllSeries).not.toHaveBeenCalled()
    expect(screen.getByText('No flow series added.')).toBeInTheDocument()
  })
})
