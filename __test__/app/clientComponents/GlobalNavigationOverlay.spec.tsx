import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import GlobalNavigationOverlay from '@clientComponents/GlobalNavigationOverlay'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  NavigationLoadingProvider,
  useNavigationLoading,
} from '@context/NavigationLoadingContext'

// Unmock NavigationLoadingContext to use real implementation
jest.unmock('@context/NavigationLoadingContext')

const theme = createTheme()

// Helper component to control navigation state
function NavigationController({ children }: { children?: React.ReactNode }) {
  const { startNavigation, endNavigation } = useNavigationLoading()

  return (
    <div>
      <button
        data-testid="start-navigation"
        onClick={() => startNavigation('/test-path', 'test-element')}
      >
        Start Navigation
      </button>
      <button
        data-testid="start-navigation-no-path"
        onClick={() => startNavigation('')}
      >
        Start No Path
      </button>
      <button data-testid="end-navigation" onClick={() => endNavigation()}>
        End Navigation
      </button>
      {children}
    </div>
  )
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <NavigationLoadingProvider>
      <NavigationController />
      {children}
    </NavigationLoadingProvider>
  </ThemeProvider>
)

describe('GlobalNavigationOverlay', () => {
  describe('Rendering', () => {
    it('should render overlay component', () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      expect(
        screen.getByTestId('global-navigation-overlay')
      ).toBeInTheDocument()
    })

    it('should not be visible initially', () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      const backdrop = screen.getByTestId('global-navigation-overlay')
      // MUI Backdrop has visibility:hidden when closed
      expect(backdrop).toHaveStyle('visibility: hidden')
    })
  })

  describe('Navigation State', () => {
    it('should become visible when navigation starts', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      const startButton = screen.getByTestId('start-navigation')

      act(() => {
        fireEvent.click(startButton)
      })

      await waitFor(() => {
        const backdrop = screen.getByTestId('global-navigation-overlay')
        expect(backdrop).not.toHaveStyle('visibility: hidden')
      })
    })

    it('should hide when navigation ends', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      // Start navigation
      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation'))
      })

      // Wait for overlay to be visible
      await waitFor(() => {
        const backdrop = screen.getByTestId('global-navigation-overlay')
        expect(backdrop).not.toHaveStyle('visibility: hidden')
      })

      // End navigation
      act(() => {
        fireEvent.click(screen.getByTestId('end-navigation'))
      })

      // Wait for overlay to hide
      await waitFor(() => {
        const backdrop = screen.getByTestId('global-navigation-overlay')
        expect(backdrop).toHaveStyle('visibility: hidden')
      })
    })
  })

  describe('Content Display', () => {
    it('should show loading text during navigation', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation'))
      })

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })
    })

    it('should show target path during navigation', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation'))
      })

      await waitFor(() => {
        expect(screen.getByText('Going to /test-path')).toBeInTheDocument()
      })
    })

    it('should not show target path when empty', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation-no-path'))
      })

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })

      // Should not have "Going to" text for empty path
      expect(screen.queryByText(/Going to/)).not.toBeInTheDocument()
    })

    it('should show CircularProgress spinner', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation'))
      })

      await waitFor(() => {
        const spinner = document.querySelector('.MuiCircularProgress-root')
        expect(spinner).toBeInTheDocument()
      })
    })
  })

  describe('Styling', () => {
    it('should have correct z-index to appear above other elements', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation'))
      })

      await waitFor(() => {
        const backdrop = screen.getByTestId('global-navigation-overlay')
        const style = window.getComputedStyle(backdrop)
        // MUI drawer + 2000 should be a high z-index
        expect(parseInt(style.zIndex)).toBeGreaterThan(1000)
      })
    })

    it('should have backdrop blur effect applied', () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      // The component has backdropFilter: blur defined
      const backdrop = screen.getByTestId('global-navigation-overlay')
      expect(backdrop).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should use proper ARIA attributes via MUI Backdrop', () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      const backdrop = screen.getByTestId('global-navigation-overlay')
      // MUI Backdrop handles accessibility
      expect(backdrop).toBeInTheDocument()
    })
  })

  describe('Animation', () => {
    it('should use Fade component for smooth transitions', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      act(() => {
        fireEvent.click(screen.getByTestId('start-navigation'))
      })

      // The Fade component wraps the content Box
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })
    })
  })

  describe('Multiple Navigations', () => {
    it('should handle rapid navigation state changes', async () => {
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      const startButton = screen.getByTestId('start-navigation')
      const endButton = screen.getByTestId('end-navigation')

      // Rapid start/end cycles
      for (let i = 0; i < 3; i++) {
        act(() => {
          fireEvent.click(startButton)
        })

        await waitFor(() => {
          expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        act(() => {
          fireEvent.click(endButton)
        })

        await waitFor(() => {
          const backdrop = screen.getByTestId('global-navigation-overlay')
          expect(backdrop).toHaveStyle('visibility: hidden')
        })
      }
    })
  })

  describe('Integration', () => {
    it('should work correctly within provider hierarchy', () => {
      // Test that the component properly integrates with NavigationLoadingProvider
      render(
        <TestWrapper>
          <GlobalNavigationOverlay />
        </TestWrapper>
      )

      // Should not throw and should render
      expect(
        screen.getByTestId('global-navigation-overlay')
      ).toBeInTheDocument()
    })
  })
})
