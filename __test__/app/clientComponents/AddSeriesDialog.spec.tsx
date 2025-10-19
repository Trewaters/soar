import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import AddSeriesDialog from '@clientComponents/AddSeriesDialog'
import theme from '@styles/theme'

// Explicit next-auth hook mock to ensure session-dependent fetch executes
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }))

const mockSession = {
  user: { email: 'test@example.com' },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

// Access mocked hook
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useSession: mockUseSession } = require('next-auth/react') as {
  useSession: jest.Mock
}

// Mock fetch
global.fetch = jest.fn()

const mockSeries = [
  {
    id: '1',
    seriesName: 'Morning Flow',
    seriesPoses: ['mountain-pose', 'warrior-pose'],
    description: 'A gentle morning flow series',
    image: 'https://example.com/image1.jpg',
    durationSeries: '15 minutes',
    created_by: 'test@example.com',
  },
  {
    id: '2',
    seriesName: 'Power Flow',
    seriesPoses: ['warrior-pose', 'downward-dog', 'plank'],
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

const renderWithProviders = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

describe('AddSeriesDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })
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
      expect(screen.getAllByText('Morning Flow')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Power Flow')[0]).toBeInTheDocument()
    })
  })

  it('displays series information correctly', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getAllByText('Morning Flow')[0]).toBeInTheDocument()
    })

    expect(screen.getByText('A gentle morning flow series')).toBeInTheDocument()
    expect(screen.getByText('2 poses')).toBeInTheDocument()
    expect(screen.getByText('15 minutes')).toBeInTheDocument()
  })

  it('allows searching series', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getAllByText('Morning Flow')[0]).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search series/)
    fireEvent.change(searchInput, { target: { value: 'morning' } })

    expect(screen.getByText('Morning Flow')).toBeInTheDocument()
    expect(screen.queryByText('Power Flow')).not.toBeInTheDocument()
  })

  it('clears search when clear button is clicked', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getAllByText('Morning Flow')[0]).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search series/)
    fireEvent.change(searchInput, { target: { value: 'morning' } })

    expect(searchInput).toHaveValue('morning')

    const clearButton = await screen.findByTestId('clear-search-button')
    fireEvent.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('allows selecting and deselecting series', async () => {
    renderWithProviders(<AddSeriesDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getAllByText('Morning Flow')[0]).toBeInTheDocument()
    })

    // Select a series
    const morningFlowCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(morningFlowCheckbox)

    expect(screen.getByText('Selected Series (1):')).toBeInTheDocument()
    expect(screen.getByText('Morning Flow (2 poses)')).toBeInTheDocument()

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
      expect(screen.getAllByText('Power Flow')[0]).toBeInTheDocument()
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
      expect(screen.getAllByText('Morning Flow')[0]).toBeInTheDocument()
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
