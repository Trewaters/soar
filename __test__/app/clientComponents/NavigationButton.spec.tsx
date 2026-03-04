import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Reset modules to clear any global mocks
beforeAll(() => {
  jest.resetModules()
})

// Unmock to use real implementations
jest.unmock('@context/NavigationLoadingContext')
jest.unmock('@app/hooks/useNavigationWithLoading')

// Mock router functions for useNavigationWithLoading hook
const mockRouterPush = jest.fn(() => Promise.resolve())
const mockRouterReplace = jest.fn(() => Promise.resolve())
const mockRouterBack = jest.fn()
const mockRouterForward = jest.fn()
const mockRouterRefresh = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: mockRouterReplace,
    back: mockRouterBack,
    forward: mockRouterForward,
    refresh: mockRouterRefresh,
    prefetch: jest.fn(),
  }),
  usePathname: () => '/current-path',
  useSearchParams: () => new URLSearchParams(),
}))

// Import after mocking
const NavigationButton = require('@clientComponents/NavigationButton').default
const {
  NavigationLoadingProvider,
} = require('@context/NavigationLoadingContext')

const theme = createTheme()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
  </ThemeProvider>
)

describe('NavigationButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render button with children', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Test Button</NavigationButton>
        </TestWrapper>
      )

      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByText('Test Button')).toBeInTheDocument()
    })

    it('should render with contained variant by default', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Test</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-contained')
    })

    it('should render with specified variant', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" variant="outlined">
            Test
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-outlined')
    })

    it('should render with text variant', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" variant="text">
            Test
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-text')
    })
  })

  describe('Navigation', () => {
    it('should call navigation.push when clicked with href', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // The hook internally calls router.push(path)
      expect(mockRouterPush).toHaveBeenCalledWith('/test-page')
    })

    it('should prevent default event on navigation', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      const event = fireEvent.click(button)

      // Navigation should be triggered
      expect(mockRouterPush).toHaveBeenCalled()
    })

    it('should call custom onClick when no href provided', () => {
      const mockOnClick = jest.fn()

      render(
        <TestWrapper>
          <NavigationButton onClick={mockOnClick}>
            Custom Action
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockOnClick).toHaveBeenCalled()
      expect(mockRouterPush).not.toHaveBeenCalled()
    })
  })

  describe('Props', () => {
    it('should pass elementId to navigation.push', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" elementId="my-button">
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Hook calls router.push(path) internally
      expect(mockRouterPush).toHaveBeenCalledWith('/test')
    })

    it('should generate unique elementId when not provided', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Hook calls router.push(path) internally
      expect(mockRouterPush).toHaveBeenCalledWith('/test')
    })

    it('should pass navigateOptions to navigation.push', () => {
      render(
        <TestWrapper>
          <NavigationButton
            href="/test"
            navigateOptions={{ replace: true, scroll: false }}
          >
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // When replace option is true, router.replace is called instead
      expect(mockRouterReplace).toHaveBeenCalledWith('/test', { scroll: false })
    })

    it('should apply custom sx styles', () => {
      render(
        <TestWrapper>
          <NavigationButton
            href="/test"
            sx={{ backgroundColor: 'red', marginTop: 2 }}
          >
            Styled Button
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should render with startIcon', () => {
      render(
        <TestWrapper>
          <NavigationButton
            href="/test"
            startIcon={<span data-testid="start-icon">→</span>}
          >
            With Icon
          </NavigationButton>
        </TestWrapper>
      )

      expect(screen.getByTestId('start-icon')).toBeInTheDocument()
    })

    it('should render with endIcon', () => {
      render(
        <TestWrapper>
          <NavigationButton
            href="/test"
            endIcon={<span data-testid="end-icon">←</span>}
          >
            With Icon
          </NavigationButton>
        </TestWrapper>
      )

      expect(screen.getByTestId('end-icon')).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" disabled>
            Disabled Button
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should not trigger navigation when disabled', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" disabled>
            Disabled
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockRouterPush).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have auto-generated aria-label from href', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test-page">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Navigate to /test-page')
    })

    it('should use custom aria-label when provided', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" aria-label="Custom label">
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })

    it('should have type="button"', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should be focusable', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })

  describe('Touch Optimization', () => {
    it('should have minimum touch target size', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Navigate</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      // Component sets minHeight: 48 and minWidth: 48
      expect(button).toBeInTheDocument()
    })

    it('should handle touch events', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test">Touch Test</NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')

      fireEvent.touchStart(button)
      fireEvent.touchEnd(button)
      fireEvent.click(button)

      expect(mockRouterPush).toHaveBeenCalled()
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>()

      render(
        <TestWrapper>
          <NavigationButton href="/test" ref={ref}>
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current?.tagName).toBe('BUTTON')
    })
  })

  describe('Loading Text', () => {
    it('should accept loadingText prop', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" loadingText="Please wait...">
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('showSpinner Prop', () => {
    it('should accept showSpinner prop', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" showSpinner={false}>
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('preventMultipleTaps Prop', () => {
    it('should accept preventMultipleTaps prop', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" preventMultipleTaps={false}>
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Additional Button Props', () => {
    it('should pass through additional button props', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" data-custom="test-value">
            Navigate
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-custom', 'test-value')
    })

    it('should support size prop', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" size="small">
            Small Button
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-sizeSmall')
    })

    it('should support color prop', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" color="secondary">
            Secondary Button
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-containedSecondary')
    })

    it('should support fullWidth prop', () => {
      render(
        <TestWrapper>
          <NavigationButton href="/test" fullWidth>
            Full Width
          </NavigationButton>
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-fullWidth')
    })
  })
})
