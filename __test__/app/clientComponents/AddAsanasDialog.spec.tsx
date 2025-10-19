import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import AddAsanasDialog from '@clientComponents/AddAsanasDialog'
import theme from '@styles/theme'

// Mock next-auth
jest.mock('next-auth/react')
const mockUseSession = require('next-auth/react').useSession as jest.Mock

const mockSession = {
  user: { email: 'test@example.com' },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
}

// Mock fetch
global.fetch = jest.fn()

const mockAsanas = [
  {
    id: '1',
    english_names: ['Mountain Pose'],
    sanskrit_names: 'Tadasana',
    sort_english_name: 'mountain-pose',
    difficulty: 'beginner',
    category: 'standing',
    created_by: 'test@example.com',
  },
  {
    id: '2',
    english_names: ['Warrior Pose'],
    sanskrit_names: 'Virabhadrasana',
    sort_english_name: 'warrior-pose',
    difficulty: 'intermediate',
    category: 'standing',
    created_by: 'test@example.com',
  },
]

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onAdd: jest.fn(),
  excludeAsanaIds: [],
}

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </SessionProvider>
  )
}

describe('AddAsanasDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useSession to return an authenticated session
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAsanas),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders correctly when open', () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    expect(screen.getByText('Add Asanas to Series')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search asanas/)).toBeInTheDocument()
  })

  it('fetches and displays asanas', async () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^\/api\/poses\?_t=\d+$/),
        expect.objectContaining({
          cache: 'no-store',
          headers: expect.objectContaining({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          }),
        })
      )
    })

    await waitFor(() => {
      expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
      expect(
        screen.getByText('warrior-pose (Virabhadrasana)')
      ).toBeInTheDocument()
    })
  })

  it('allows searching asanas', async () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search asanas/)
    fireEvent.change(searchInput, { target: { value: 'mountain' } })

    expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
    expect(
      screen.queryByText('warrior-pose (Virabhadrasana)')
    ).not.toBeInTheDocument()
  })

  it('clears search when clear button is clicked', async () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Search asanas/)
    fireEvent.change(searchInput, { target: { value: 'mountain' } })

    expect(searchInput).toHaveValue('mountain')

    const clearButton = await screen.findByTestId('clear-search-button')
    fireEvent.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('allows selecting and deselecting asanas', async () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
    })

    // Select an asana
    const mountainPoseCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(mountainPoseCheckbox)

    expect(screen.getByText('Selected Asanas (1):')).toBeInTheDocument()
    expect(screen.getAllByText('mountain-pose (Tadasana)')).toHaveLength(2) // One in list, one in chip

    // Deselect by clicking chip delete
    const chip = screen.getByTestId('CancelIcon')
    fireEvent.click(chip)

    expect(screen.queryByText('Selected Asanas (1):')).not.toBeInTheDocument()
  })

  it('calls onAdd with selected asanas', async () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
    })

    // Select an asana
    const mountainPoseCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(mountainPoseCheckbox)

    // Click add button
    const addButton = screen.getByRole('button', { name: /Add 1 Asana$/ })
    fireEvent.click(addButton)

    expect(defaultProps.onAdd).toHaveBeenCalledWith([mockAsanas[0]])
  })

  it('excludes asanas that are already in the series', async () => {
    const propsWithExclusions = {
      ...defaultProps,
      excludeAsanaIds: ['1'],
    }

    renderWithProviders(<AddAsanasDialog {...propsWithExclusions} />)

    await waitFor(() => {
      expect(
        screen.queryByText('mountain-pose (Tadasana)')
      ).not.toBeInTheDocument()
      expect(
        screen.getByText('warrior-pose (Virabhadrasana)')
      ).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Fetch failed')).toBeInTheDocument()
    })
  })

  it('calls onClose when cancel is clicked', () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('disables add button when no asanas are selected', async () => {
    renderWithProviders(<AddAsanasDialog {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('mountain-pose (Tadasana)')).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /Add 0 Asanas/ })
    expect(addButton).toBeDisabled()
  })
})
