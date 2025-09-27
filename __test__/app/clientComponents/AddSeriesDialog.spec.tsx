import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import AddSeriesDialog from '@clientComponents/AddSeriesDialog'
import theme from '@styles/theme'

// Mock next-auth
const mockSession = {
  user: { email: 'test@example.com' },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

// Mock fetch
global.fetch = jest.fn()

const mockSeries = [
  {
    id: '1',
    seriesName: 'Morning Flow',
    seriesPostures: ['mountain-pose', 'warrior-pose'],
    description: 'A gentle morning flow series',
    image: 'https://example.com/image1.jpg',
    durationSeries: '15 minutes',
    created_by: 'test@example.com',
  },
  {
    id: '2',
    seriesName: 'Power Flow',
    seriesPostures: ['warrior-pose', 'downward-dog', 'plank'],
    description: 'An energizing power flow series',
    image: 'https://example.com/image2.jpg',
    durationSeries: '30 minutes',
    created_by: 'test@example.com',
  },
]

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onAdd: jest.fn(),
  excludeSeriesIds: [],
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </SessionProvider>
  )
}

describe('AddSeriesDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSeries),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders correctly when open', () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    expect(screen.getByText('Add Series to Sequence')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search series/)).toBeInTheDocument()
  })

  it('fetches and displays series', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/series')
    })

    await waitFor(() => {
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()
      expect(screen.getByText('Power Flow')).toBeInTheDocument()
    })
  })

  it('displays series information correctly', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    })

    expect(screen.getByText('A gentle morning flow series')).toBeInTheDocument()
    expect(screen.getByText('2 postures')).toBeInTheDocument()
    expect(screen.getByText('15 minutes')).toBeInTheDocument()
  })

  it('allows searching series', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search series/)
    fireEvent.change(searchInput, { target: { value: 'morning' } })

    expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    expect(screen.queryByText('Power Flow')).not.toBeInTheDocument()
  })

  it('allows selecting and deselecting series', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    })

    // Select a series
    const morningFlowCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(morningFlowCheckbox)

    expect(screen.getByText('Selected Series (1):')).toBeInTheDocument()
    expect(screen.getByText('Morning Flow (2 postures)')).toBeInTheDocument()

    // Deselect by clicking chip delete
    const chip = screen.getByTestId('CancelIcon')
    fireEvent.click(chip)

    expect(screen.queryByText('Selected Series (1):')).not.toBeInTheDocument()
  })

  it('calls onAdd with selected series', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    })

    // Select a series
    const morningFlowCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(morningFlowCheckbox)

    // Click add button
    const addButton = screen.getByRole('button', { name: /Add 1 Series/ })
    fireEvent.click(addButton)

    expect(defaultProps.onAdd).toHaveBeenCalledWith([mockSeries[0]])
  })

  it('excludes series that are already in the sequence', async () => {
    const propsWithExclusions = {
      ...defaultProps,
      excludeSeriesIds: ['1'],
    }

    renderWithProviders(<AddSeriesDialog {...propsWithExclusions} />)

    await waitFor(() => {
      expect(screen.queryByText('Morning Flow')).not.toBeInTheDocument()
      expect(screen.getByText('Power Flow')).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument()
    })
  })

  it('calls onClose when cancel is clicked', () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('disables add button when no series are selected', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /Add 0 Series/ })
    expect(addButton).toBeDisabled()
  })

  it('shows placeholder when no series are available', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })

    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('No series available to add')).toBeInTheDocument()
    })
  })
})
