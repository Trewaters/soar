import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'

// Reset modules and unmock NavigationLoadingContext to use real implementation
beforeAll(() => {
  jest.resetModules()
})

// Unmock NavigationLoadingContext to use real implementation for these tests
jest.unmock('@context/NavigationLoadingContext')

// Import after unmocking
const {
  NavigationLoadingProvider,
  useNavigationLoading,
} = require('@context/NavigationLoadingContext')

// Test component that exposes context values
function TestConsumer({
  onContextValue,
}: {
  onContextValue?: (context: ReturnType<typeof useNavigationLoading>) => void
}) {
  const context = useNavigationLoading()

  React.useEffect(() => {
    onContextValue?.(context)
  }, [context, onContextValue])

  return (
    <div>
      <div data-testid="is-navigating">
        {String(context.state.isNavigating)}
      </div>
      <div data-testid="target-path">{context.state.targetPath || 'null'}</div>
      <div data-testid="element-id">{context.state.elementId || 'null'}</div>
      <div data-testid="nav-id">{context.state.navId || 'null'}</div>
      <button
        data-testid="start-nav"
        onClick={() => context.startNavigation('/test-path', 'test-element')}
      >
        Start Navigation
      </button>
      <button
        data-testid="start-nav-with-id"
        onClick={() =>
          context.startNavigation('/test-path', 'test-element', 'custom-nav-id')
        }
      >
        Start Navigation with ID
      </button>
      <button data-testid="end-nav" onClick={() => context.endNavigation()}>
        End Navigation
      </button>
      <button
        data-testid="end-nav-with-id"
        onClick={() => context.endNavigation('custom-nav-id')}
      >
        End Navigation with ID
      </button>
    </div>
  )
}

describe('NavigationLoadingContext', () => {
  describe('Provider', () => {
    it('should render children within the provider', () => {
      render(
        <NavigationLoadingProvider>
          <div data-testid="child">Child Content</div>
        </NavigationLoadingProvider>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('should provide initial state with isNavigating false', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('false')
      expect(screen.getByTestId('target-path')).toHaveTextContent('null')
      expect(screen.getByTestId('element-id')).toHaveTextContent('null')
      expect(screen.getByTestId('nav-id')).toHaveTextContent('null')
    })
  })

  describe('startNavigation', () => {
    it('should set isNavigating to true when startNavigation is called', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start-nav').click()
      })

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('true')
    })

    it('should set targetPath when startNavigation is called', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start-nav').click()
      })

      expect(screen.getByTestId('target-path')).toHaveTextContent('/test-path')
    })

    it('should set elementId when startNavigation is called with element ID', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start-nav').click()
      })

      expect(screen.getByTestId('element-id')).toHaveTextContent('test-element')
    })

    it('should generate a navId when not provided', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start-nav').click()
      })

      const navId = screen.getByTestId('nav-id').textContent
      expect(navId).not.toBe('null')
      expect(navId).toMatch(/^\d+-[a-z0-9]+$/) // timestamp-randomstring format
    })

    it('should use provided navId when specified', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start-nav-with-id').click()
      })

      expect(screen.getByTestId('nav-id')).toHaveTextContent('custom-nav-id')
    })
  })

  describe('endNavigation', () => {
    it('should reset state when endNavigation is called', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      // Start navigation first
      act(() => {
        screen.getByTestId('start-nav').click()
      })

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('true')

      // End navigation
      act(() => {
        screen.getByTestId('end-nav').click()
      })

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('false')
      expect(screen.getByTestId('target-path')).toHaveTextContent('null')
      expect(screen.getByTestId('element-id')).toHaveTextContent('null')
      expect(screen.getByTestId('nav-id')).toHaveTextContent('null')
    })

    it('should only end navigation when navId matches', () => {
      render(
        <NavigationLoadingProvider>
          <TestConsumer />
        </NavigationLoadingProvider>
      )

      // Start navigation with specific ID
      act(() => {
        screen.getByTestId('start-nav-with-id').click()
      })

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('true')
      expect(screen.getByTestId('nav-id')).toHaveTextContent('custom-nav-id')

      // Try to end with matching ID
      act(() => {
        screen.getByTestId('end-nav-with-id').click()
      })

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('false')
    })

    it('should NOT end navigation when navId does not match', () => {
      let contextRef: ReturnType<typeof useNavigationLoading> | null = null

      render(
        <NavigationLoadingProvider>
          <TestConsumer
            onContextValue={(ctx) => {
              contextRef = ctx
            }}
          />
        </NavigationLoadingProvider>
      )

      // Start navigation with specific ID
      act(() => {
        screen.getByTestId('start-nav-with-id').click()
      })

      expect(screen.getByTestId('is-navigating')).toHaveTextContent('true')

      // Try to end with different ID
      act(() => {
        contextRef?.endNavigation('different-nav-id')
      })

      // Navigation should still be active
      expect(screen.getByTestId('is-navigating')).toHaveTextContent('true')
    })
  })

  describe('isNavigatingTo', () => {
    it('should return true when navigating to the specified path', () => {
      let isNavigatingToPath = false

      function TestComponent() {
        const context = useNavigationLoading()
        isNavigatingToPath = context.isNavigatingTo('/test-path')
        return (
          <button
            data-testid="start"
            onClick={() => context.startNavigation('/test-path')}
          >
            Start
          </button>
        )
      }

      render(
        <NavigationLoadingProvider>
          <TestComponent />
        </NavigationLoadingProvider>
      )

      expect(isNavigatingToPath).toBe(false)

      act(() => {
        screen.getByTestId('start').click()
      })

      // Re-render to get updated value
      expect(isNavigatingToPath).toBe(true)
    })

    it('should return false when navigating to a different path', () => {
      let isNavigatingToOtherPath = false

      function TestComponent() {
        const context = useNavigationLoading()
        isNavigatingToOtherPath = context.isNavigatingTo('/other-path')
        return (
          <button
            data-testid="start"
            onClick={() => context.startNavigation('/test-path')}
          >
            Start
          </button>
        )
      }

      render(
        <NavigationLoadingProvider>
          <TestComponent />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(isNavigatingToOtherPath).toBe(false)
    })
  })

  describe('isElementLoading', () => {
    it('should return true when the specified element is loading', () => {
      let isElementLoading = false

      function TestComponent() {
        const context = useNavigationLoading()
        isElementLoading = context.isElementLoading('test-element')
        return (
          <button
            data-testid="start"
            onClick={() =>
              context.startNavigation('/test-path', 'test-element')
            }
          >
            Start
          </button>
        )
      }

      render(
        <NavigationLoadingProvider>
          <TestComponent />
        </NavigationLoadingProvider>
      )

      expect(isElementLoading).toBe(false)

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(isElementLoading).toBe(true)
    })

    it('should return false for different element ID', () => {
      let isOtherElementLoading = false

      function TestComponent() {
        const context = useNavigationLoading()
        isOtherElementLoading = context.isElementLoading('other-element')
        return (
          <button
            data-testid="start"
            onClick={() =>
              context.startNavigation('/test-path', 'test-element')
            }
          >
            Start
          </button>
        )
      }

      render(
        <NavigationLoadingProvider>
          <TestComponent />
        </NavigationLoadingProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(isOtherElementLoading).toBe(false)
    })
  })

  describe('useNavigationLoading hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(() => {
        render(<TestConsumer />)
      }).toThrow(
        'useNavigationLoading must be used within a NavigationLoadingProvider'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('State Management', () => {
    it('should handle rapid start/end navigation cycles', () => {
      let contextRef: ReturnType<typeof useNavigationLoading> | null = null

      render(
        <NavigationLoadingProvider>
          <TestConsumer
            onContextValue={(ctx) => {
              contextRef = ctx
            }}
          />
        </NavigationLoadingProvider>
      )

      // Rapid start/end cycles
      for (let i = 0; i < 5; i++) {
        act(() => {
          contextRef?.startNavigation(`/path-${i}`, `element-${i}`)
        })

        expect(screen.getByTestId('is-navigating')).toHaveTextContent('true')
        expect(screen.getByTestId('target-path')).toHaveTextContent(
          `/path-${i}`
        )

        act(() => {
          contextRef?.endNavigation()
        })

        expect(screen.getByTestId('is-navigating')).toHaveTextContent('false')
      }
    })

    it('should maintain state isolation between different navigations', () => {
      let contextRef: ReturnType<typeof useNavigationLoading> | null = null

      render(
        <NavigationLoadingProvider>
          <TestConsumer
            onContextValue={(ctx) => {
              contextRef = ctx
            }}
          />
        </NavigationLoadingProvider>
      )

      // First navigation
      act(() => {
        contextRef?.startNavigation('/first-path', 'first-element', 'nav-1')
      })

      expect(screen.getByTestId('target-path')).toHaveTextContent('/first-path')
      expect(screen.getByTestId('element-id')).toHaveTextContent(
        'first-element'
      )

      // Second navigation should overwrite
      act(() => {
        contextRef?.startNavigation('/second-path', 'second-element', 'nav-2')
      })

      expect(screen.getByTestId('target-path')).toHaveTextContent(
        '/second-path'
      )
      expect(screen.getByTestId('element-id')).toHaveTextContent(
        'second-element'
      )
      expect(screen.getByTestId('nav-id')).toHaveTextContent('nav-2')
    })
  })
})
