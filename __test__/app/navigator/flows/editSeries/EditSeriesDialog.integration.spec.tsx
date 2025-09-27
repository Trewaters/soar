import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import EditSeriesDialog from '@app/navigator/flows/editSeries/EditSeriesDialog'
import theme from '@styles/theme'

// Mock next-auth
const mockSession = {
  user: { email: 'test@example.com' },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

// Mock fetch
global.fetch = jest.fn()

const mockSeries = {
  id: '1',
  name: 'Test Series',
  description: 'A test series',
  difficulty: 'beginner',
  asanas: [
    { id: '1', name: 'Mountain Pose', difficulty: 'beginner' },
    { id: '2', name: 'Warrior Pose', difficulty: 'intermediate' },
  ],
  created_by: 'test@example.com',
}

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSave: jest.fn(),
  onDelete: jest.fn(),
  series: mockSeries,
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </SessionProvider>
  )
}

describe('EditSeriesDialog - Add Asanas Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: '3',
            english_names: ['Tree Pose'],
            sanskrit_names: 'Vrikshasana',
            sort_english_name: 'tree-pose',
            difficulty: 'intermediate',
            category: 'standing',
            created_by: 'test@example.com',
          },
        ]),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows Add Asanas button for series creator', () => {
    renderWithProviders(<EditSeriesDialog {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: 'Add Asanas' })
    ).toBeInTheDocument()
  })

  it('does not show Add Asanas button for non-creator', () => {
    const nonCreatorSeries = {
      ...mockSeries,
      created_by: 'other@example.com',
    }

    renderWithProviders(
      <EditSeriesDialog {...defaultProps} series={nonCreatorSeries} />
    )

    expect(
      screen.queryByRole('button', { name: 'Add Asanas' })
    ).not.toBeInTheDocument()
  })

  it('opens AddAsanasDialog when Add Asanas button is clicked', async () => {
    renderWithProviders(<EditSeriesDialog {...defaultProps} />)

    const addButton = screen.getByRole('button', { name: 'Add Asanas' })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Add Asanas to Series')).toBeInTheDocument()
    })
  })

  it('displays existing asanas in the series', () => {
    renderWithProviders(<EditSeriesDialog {...defaultProps} />)

    expect(screen.getByText('Mountain Pose')).toBeInTheDocument()
    expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
    // Difficulty should not be displayed in the list
    expect(screen.queryByText('Difficulty: beginner')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Difficulty: intermediate')
    ).not.toBeInTheDocument()
  })

  it('allows reordering asanas with up/down buttons', () => {
    const onSave = jest.fn()
    renderWithProviders(<EditSeriesDialog {...defaultProps} onSave={onSave} />)

    // Click move up on the second item (Warrior Pose)
    const moveUpButtons = screen.getAllByRole('button', { name: /Move .* up/ })
    fireEvent.click(moveUpButtons[1]) // Second item's move up button

    // Click save to verify the change
    const saveButton = screen.getByRole('button', { name: 'Save Changes' })
    fireEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        asanas: [
          { id: '2', name: 'Warrior Pose', difficulty: 'intermediate' },
          { id: '1', name: 'Mountain Pose', difficulty: 'beginner' },
        ],
      })
    )
  })

  it('allows removing asanas from the series', () => {
    renderWithProviders(<EditSeriesDialog {...defaultProps} />)

    // Click remove on the first asana
    const removeButtons = screen.getAllByRole('button', { name: /Remove/ })
    fireEvent.click(removeButtons[0])

    // Verify the asana is removed from the list
    expect(screen.queryByText('Mountain Pose')).not.toBeInTheDocument()
    expect(screen.getByText('Warrior Pose')).toBeInTheDocument()
  })

  it('shows validation error when trying to save series with no asanas', () => {
    const seriesWithNoAsanas = {
      ...mockSeries,
      asanas: [],
    }

    renderWithProviders(
      <EditSeriesDialog {...defaultProps} series={seriesWithNoAsanas} />
    )

    const saveButton = screen.getByRole('button', { name: 'Save Changes' })
    fireEvent.click(saveButton)

    expect(
      screen.getByText('At least one asana is required.')
    ).toBeInTheDocument()
  })
})
