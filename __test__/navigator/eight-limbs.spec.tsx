import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EightLimbs, {
  eightLimbsData,
} from '@app/navigator/eightLimbs/eight-limbs' // Adjust the import path as necessary
import '@testing-library/jest-dom'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock MUI icons to simplify testing and avoid rendering complex SVGs
jest.mock('@mui/icons-material/WaterDropOutlined', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'waterdrop-icon' }),
}))
jest.mock('@mui/icons-material/Air', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'air-icon' }),
}))
jest.mock('@mui/icons-material/Adjust', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'adjust-icon' }),
}))
jest.mock('@mui/icons-material/LensBlur', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'lensblur-icon' }),
}))
jest.mock('@mui/icons-material/Mediation', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'mediation-icon' }),
}))
jest.mock('@mui/icons-material/Flag', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'flag-icon' }),
}))
jest.mock('@mui/icons-material/Spa', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'spa-icon' }),
}))

describe('EightLimbs Component', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    mockPush.mockClear()
  })

  it('renders the main heading', () => {
    render(<EightLimbs />)
    expect(
      screen.getByRole('heading', { name: /Eight Limbs/i })
    ).toBeInTheDocument()
  })

  it('renders all eight limbs items', () => {
    render(<EightLimbs />)
    eightLimbsData.forEach((item, idx) => {
      expect(screen.getByTestId(`eight-limbs-item-${idx}`)).toBeInTheDocument()
      expect(screen.getByText(item.primary)).toBeInTheDocument()
      if (item.secondary) {
        expect(screen.getByText(item.secondary)).toBeInTheDocument()
      }
    })
  })

  it('renders icons for items that have them defined', () => {
    render(<EightLimbs />)
    expect(screen.getByTestId('waterdrop-icon')).toBeInTheDocument() // Asana
    expect(screen.getByTestId('flag-icon')).toBeInTheDocument() // Niyama
    expect(screen.getByTestId('mediation-icon')).toBeInTheDocument() // Yama
    expect(screen.getByTestId('air-icon')).toBeInTheDocument() // Pranayama
    expect(screen.getByTestId('adjust-icon')).toBeInTheDocument() // Dharana
    expect(screen.getByTestId('spa-icon')).toBeInTheDocument() // Dhyana
    // Pratyahara has no icon in the provided data
    expect(screen.getByTestId('lensblur-icon')).toBeInTheDocument() // Samadhi
  })

  it('handles click on a button item (Asana) and navigates', () => {
    render(<EightLimbs />)
    const asanaItem = screen.getByText('Asana').closest('[role="button"]')
    expect(asanaItem).toBeInTheDocument()

    if (asanaItem) {
      fireEvent.click(asanaItem)
      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPostures')
    }
  })

  it('renders items without button functionality correctly', () => {
    render(<EightLimbs />)
    // Example: Niyama item, which is not a button
    const niyamaItemText = screen.getByText('Niyama')
    // Check that it's not a button or doesn't have a click handler that navigates
    // The structure is ListItem > ListItemText, not ListItem > ListItemButton > ListItemText
    expect(niyamaItemText.closest('[role="button"]')).toBeNull()

    // Attempting to click the parent ListItem should not trigger navigation
    const niyamaListItem = screen.getByTestId('eight-limbs-item-1') // Niyama is the second item (index 1)
    fireEvent.click(niyamaListItem)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('renders Pratyahara item without an icon', () => {
    render(<EightLimbs />)
    const pratyaharaItem = screen.getByText('Pratyahara')
    expect(pratyaharaItem).toBeInTheDocument()
    // Check that no icon is rendered within its ListItem
    const pratyaharaListItem = screen.getByTestId('eight-limbs-item-6') // Pratyahara is the 7th item
    expect(
      pratyaharaListItem.querySelector('[data-testid]')
    ).not.toBeInTheDocument() // Assuming icons have data-testid
  })
})
