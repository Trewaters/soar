import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EightLimbs, {
  eightLimbsData,
} from '@app/navigator/eightLimbs/eight-limbs' // Adjust the import path as necessary
import '@testing-library/jest-dom'

// Note: next/navigation and useNavigationWithLoading are mocked globally in jest.setup.ts
// Access the global mocks via (globalThis as any).mockNavigationPush for assertions

// Reference global mocks for assertions
const mockPush = (globalThis as any).mockNavigationPush

describe('EightLimbs Component', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(<EightLimbs />)
    expect(
      screen.getByRole('heading', { name: /Eight Limbs/i })
    ).toBeInTheDocument()
  })

  it('renders all eight limbs items', () => {
    render(<EightLimbs />)
    const listItems = screen.getAllByRole('listitem')

    eightLimbsData.forEach((item, idx) => {
      expect(listItems[idx]).toBeInTheDocument()
      expect(screen.getByText(item.primary)).toBeInTheDocument()
      if (item.secondary) {
        expect(screen.getByText(item.secondary)).toBeInTheDocument()
      }
    })
  })

  it('renders icons for items that have them defined', () => {
    render(<EightLimbs />)

    // Use role-based queries to find list items and check for icons
    const listItems = screen.getAllByRole('listitem')

    // Items with icons: Asana(0), Niyama(1), Yama(2), Pranayama(3), Dharana(4), Dhyana(5), Samadhi(7)
    // Pratyahara(6) has no icon
    const itemsWithIcons = [0, 1, 2, 3, 4, 5, 7]

    itemsWithIcons.forEach((index) => {
      // Look for SVG elements (actual MUI icons) or mocked div elements within each list item
      const listItem = listItems[index]
      const iconElement = listItem.querySelector('svg')
      expect(iconElement).toBeInTheDocument()
    })
  })

  it('handles click on a button item (Asana) and navigates', () => {
    render(<EightLimbs />)
    const asanaItem = screen.getByText('Asana').closest('[role="button"]')
    expect(asanaItem).toBeInTheDocument()

    if (asanaItem) {
      fireEvent.click(asanaItem)
      expect(mockPush).toHaveBeenCalledTimes(1)
      // The eightLimbsData onClick handler calls router.push with path only (legacy pattern)
      expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPoses')
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
    const listItems = screen.getAllByRole('listitem')
    const niyamaListItem = listItems[1] // Niyama is the second item (index 1)
    fireEvent.click(niyamaListItem)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('renders Pratyahara item without an icon', () => {
    render(<EightLimbs />)
    const listItems = screen.getAllByRole('listitem')
    const pratyaharaListItem = listItems[6] // Pratyahara is the 7th item (index 6)

    // Check that no icon is rendered within its ListItem
    const iconElement = pratyaharaListItem.querySelector('svg')
    expect(iconElement).toBeNull()
  })
})
