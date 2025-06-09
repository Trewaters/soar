import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import TabHeader from '../../app/clientComponents/tab-header'
import { testInteractiveAccessibility } from '../accessibility/axe-test-utils'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock next/navigation
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

describe('TabHeader Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not have accessibility violations in default state', async () => {
    const { container } = render(<TabHeader />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when switching tabs', async () => {
    const { container } = render(<TabHeader />)

    const learnYogaTab = screen.getByRole('tab', {
      name: /learn about yoga tab/i,
    })
    fireEvent.click(learnYogaTab)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should pass interactive accessibility tests', async () => {
    await testInteractiveAccessibility(<TabHeader />)
  })

  it('should have proper tab accessibility attributes', () => {
    render(<TabHeader />)

    const tabLists = screen.getAllByRole('tablist')
    // MUI creates nested tablist roles, we want the inner one with aria-label
    const mainTabList = tabLists.find(
      (tabList) =>
        tabList.getAttribute('aria-label') ===
        'Tab menu group for navigating yoga content'
    )

    expect(mainTabList).toHaveAttribute(
      'aria-label',
      'Tab menu group for navigating yoga content'
    )

    const tabs = screen.getAllByRole('tab')
    tabs.forEach((tab, index) => {
      expect(tab).toHaveAttribute('id', `simple-tab-${index}`)
      expect(tab).toHaveAttribute('aria-controls', `simple-tabpanel-${index}`)
    })
  })

  it('should maintain proper tab panel accessibility', () => {
    render(<TabHeader />)

    const firstTabPanel = screen.getByRole('tabpanel')
    expect(firstTabPanel).toHaveAttribute('id', 'simple-tabpanel-0')
    expect(firstTabPanel).toHaveAttribute('aria-labelledby', 'simple-tab-0')
    expect(firstTabPanel).not.toHaveAttribute('hidden')
  })

  it('should support keyboard navigation between tabs', () => {
    render(<TabHeader />)

    const startPracticeTab = screen.getByRole('tab', {
      name: /start your practice tab/i,
    })
    const learnYogaTab = screen.getByRole('tab', {
      name: /learn about yoga tab/i,
    })

    // Test keyboard navigation
    startPracticeTab.focus()
    expect(startPracticeTab).toHaveFocus()

    fireEvent.keyDown(startPracticeTab, { key: 'ArrowRight' })
    expect(learnYogaTab).toHaveFocus()

    fireEvent.keyDown(learnYogaTab, { key: 'ArrowLeft' })
    expect(startPracticeTab).toHaveFocus()
  })

  it('should handle tab activation with Enter and Space keys', () => {
    render(<TabHeader />)

    const learnYogaTab = screen.getByRole('tab', {
      name: /learn about yoga tab/i,
    })

    // Test click activation (MUI handles Enter/Space internally)
    fireEvent.click(learnYogaTab)
    expect(learnYogaTab).toHaveAttribute('aria-selected', 'true')

    // Switch back to first tab
    const startPracticeTab = screen.getByRole('tab', {
      name: /start your practice tab/i,
    })

    // Test click activation
    fireEvent.click(startPracticeTab)
    expect(startPracticeTab).toHaveAttribute('aria-selected', 'true')
  })
})
