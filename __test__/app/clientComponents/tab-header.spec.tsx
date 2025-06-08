import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TabHeader from '../../../app/clientComponents/tab-header'

// Mock next/navigation for the EightLimbs component
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock MUI icons used in EightLimbs component
jest.mock('@mui/icons-material/WaterDropOutlined', () => ({
  __esModule: true,
  default: () => <div data-testid="waterdrop-icon" />,
}))

jest.mock('@mui/icons-material/Air', () => ({
  __esModule: true,
  default: () => <div data-testid="air-icon" />,
}))

jest.mock('@mui/icons-material/Adjust', () => ({
  __esModule: true,
  default: () => <div data-testid="adjust-icon" />,
}))

jest.mock('@mui/icons-material/LensBlur', () => ({
  __esModule: true,
  default: () => <div data-testid="lensblur-icon" />,
}))

jest.mock('@mui/icons-material/Mediation', () => ({
  __esModule: true,
  default: () => <div data-testid="mediation-icon" />,
}))

jest.mock('@mui/icons-material/Flag', () => ({
  __esModule: true,
  default: () => <div data-testid="flag-icon" />,
}))

jest.mock('@mui/icons-material/Spa', () => ({
  __esModule: true,
  default: () => <div data-testid="spa-icon" />,
}))

jest.mock('@mui/icons-material/Whatshot', () => ({
  __esModule: true,
  default: () => <div data-testid="whatshot-icon" />,
}))

describe('TabHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('initial render and accessibility', () => {
    it('renders with proper accessibility structure', () => {
      render(<TabHeader />)

      const tabList = screen.getByRole('tablist', {
        name: /tab menu group for navigating yoga content/i,
      })
      expect(tabList).toBeInTheDocument()
    })

    it('renders both tabs with correct labels and accessibility attributes', () => {
      render(<TabHeader />)

      const startPracticeTab = screen.getByRole('tab', {
        name: /start your practice tab/i,
      })
      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      expect(startPracticeTab).toBeInTheDocument()
      expect(learnYogaTab).toBeInTheDocument()

      // Check ARIA attributes
      expect(startPracticeTab).toHaveAttribute('id', 'simple-tab-0')
      expect(startPracticeTab).toHaveAttribute(
        'aria-controls',
        'simple-tabpanel-0'
      )
      expect(learnYogaTab).toHaveAttribute('id', 'simple-tab-1')
      expect(learnYogaTab).toHaveAttribute('aria-controls', 'simple-tabpanel-1')
    })

    it('renders with first tab selected by default', () => {
      render(<TabHeader />)

      const startPracticeTab = screen.getByRole('tab', {
        name: /start your practice tab/i,
      })
      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      expect(startPracticeTab).toHaveAttribute('aria-selected', 'true')
      expect(learnYogaTab).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('tab panels and content', () => {
    it('shows first tab panel content by default', () => {
      render(<TabHeader />)

      const firstTabPanel = screen.getByRole('tabpanel', {
        name: /start your practice tab/i,
      })
      const secondTabPanel = screen.queryByRole('tabpanel', {
        name: /learn about yoga tab/i,
      })

      expect(firstTabPanel).toBeVisible()
      expect(firstTabPanel).toHaveAttribute('id', 'simple-tabpanel-0')
      expect(firstTabPanel).toHaveAttribute('aria-labelledby', 'simple-tab-0')
      expect(secondTabPanel).not.toBeInTheDocument()
    })

    it('renders LandingPage component in first tab panel', () => {
      render(<TabHeader />)

      // LandingPage contains a navigation with "main menu" label
      const mainMenu = screen.getByRole('navigation', { name: /main menu/i })
      expect(mainMenu).toBeInTheDocument()

      // Check for Flows link from LandingPage
      const flowsLink = screen.getByRole('link', { name: /flows/i })
      expect(flowsLink).toBeInTheDocument()
      expect(flowsLink).toHaveAttribute('href', '/navigator/flows')
    })

    it('switches to second tab panel when second tab is clicked', () => {
      render(<TabHeader />)

      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      fireEvent.click(learnYogaTab)

      const secondTabPanel = screen.getByRole('tabpanel', {
        name: /learn about yoga tab/i,
      })
      const firstTabPanel = screen.queryByRole('tabpanel', {
        name: /start your practice tab/i,
      })

      expect(secondTabPanel).toBeVisible()
      expect(secondTabPanel).toHaveAttribute('id', 'simple-tabpanel-1')
      expect(secondTabPanel).toHaveAttribute('aria-labelledby', 'simple-tab-1')
      expect(firstTabPanel).not.toBeInTheDocument()
    })

    it('renders EightLimbs component in second tab panel', () => {
      render(<TabHeader />)

      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      fireEvent.click(learnYogaTab)

      // EightLimbs component contains "Eight Limbs" heading
      const eightLimbsHeading = screen.getByRole('heading', {
        name: /eight limbs/i,
      })
      expect(eightLimbsHeading).toBeInTheDocument()

      // Check for some eight limbs items
      expect(screen.getByText('Asana')).toBeInTheDocument()
      expect(screen.getByText('Niyama')).toBeInTheDocument()
      expect(screen.getByText('Yama')).toBeInTheDocument()
    })
  })

  describe('tab navigation and interaction', () => {
    it('updates aria-selected attributes when switching tabs', () => {
      render(<TabHeader />)

      const startPracticeTab = screen.getByRole('tab', {
        name: /start your practice tab/i,
      })
      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      // Click second tab
      fireEvent.click(learnYogaTab)

      expect(startPracticeTab).toHaveAttribute('aria-selected', 'false')
      expect(learnYogaTab).toHaveAttribute('aria-selected', 'true')

      // Click first tab again
      fireEvent.click(startPracticeTab)

      expect(startPracticeTab).toHaveAttribute('aria-selected', 'true')
      expect(learnYogaTab).toHaveAttribute('aria-selected', 'false')
    })

    it('supports keyboard navigation', () => {
      render(<TabHeader />)

      const startPracticeTab = screen.getByRole('tab', {
        name: /start your practice tab/i,
      })
      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      // Focus first tab and press arrow key
      startPracticeTab.focus()
      fireEvent.keyDown(startPracticeTab, { key: 'ArrowRight' })

      expect(learnYogaTab).toHaveFocus()
    })

    it('maintains proper tabindex values', () => {
      render(<TabHeader />)

      const startPracticeTab = screen.getByRole('tab', {
        name: /start your practice tab/i,
      })
      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })

      // Selected tab should have tabindex 0, others should have -1
      expect(startPracticeTab).toHaveAttribute('tabindex', '0')
      expect(learnYogaTab).toHaveAttribute('tabindex', '-1')

      // Switch tabs
      fireEvent.click(learnYogaTab)

      expect(startPracticeTab).toHaveAttribute('tabindex', '-1')
      expect(learnYogaTab).toHaveAttribute('tabindex', '0')
    })
  })

  describe('component structure and styling', () => {
    it('has the expected data-testid for the main container', () => {
      render(<TabHeader />)

      const tabHeader = screen.getByTestId('tab-header')
      expect(tabHeader).toBeInTheDocument()
    })

    it('renders tabs with proper MUI structure', () => {
      render(<TabHeader />)

      // Use the more specific tablist with the aria-label
      const tabList = screen.getByRole('tablist', {
        name: /tab menu group for navigating yoga content/i,
      })
      expect(tabList).toHaveClass('MuiTabs-flexContainer')

      const tabs = screen.getAllByRole('tab')
      tabs.forEach((tab) => {
        expect(tab).toHaveClass('MuiTab-root')
      })
    })

    it('renders tab panels with proper MUI structure', () => {
      render(<TabHeader />)

      const firstTabPanel = screen.getByRole('tabpanel')
      expect(firstTabPanel).toHaveAttribute('role', 'tabpanel')
      // Visible panels don't have the hidden attribute at all
      expect(firstTabPanel).not.toHaveAttribute('hidden')
    })
  })

  describe('content integration', () => {
    it('integrates properly with LandingPage navigation', () => {
      render(<TabHeader />)

      // Should show LandingPage content in first tab
      const flowsButton = screen.getByRole('button', { name: /flows/i })
      expect(flowsButton).toBeInTheDocument()
    })

    it('integrates properly with EightLimbs navigation', () => {
      render(<TabHeader />)

      const learnYogaTab = screen.getByRole('tab', {
        name: /learn about yoga tab/i,
      })
      fireEvent.click(learnYogaTab)

      // Should show EightLimbs content and be able to interact with it
      const asanaItem = screen.getByText('Asana').closest('[role="button"]')
      expect(asanaItem).toBeInTheDocument()

      if (asanaItem) {
        fireEvent.click(asanaItem)
        expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPostures')
      }
    })
  })
})
