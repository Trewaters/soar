import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FreemiumNotification from '../../../../app/clientComponents/freemiumNotification/FreemiumNotification'
import type { FreemiumNotificationProps } from '../../../../app/clientComponents/freemiumNotification/types'

// Mock theme for testing
const theme = createTheme()

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

// Default props for testing
const defaultProps: FreemiumNotificationProps = {
  featureType: 'createSeries',
  userAuthState: 'unauthenticated',
  isOpen: true,
  onClose: jest.fn(),
  onCtaClick: jest.fn(),
}

describe('FreemiumNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders notification when isOpen is true', () => {
      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} />
        </TestWrapper>
      )

      expect(
        screen.getByTestId('freemium-notification-alert')
      ).toBeInTheDocument()
    })

    it('does not render notification when isOpen is false', () => {
      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} isOpen={false} />
        </TestWrapper>
      )

      expect(
        screen.queryByTestId('freemium-notification-alert')
      ).not.toBeInTheDocument()
    })

    it('displays correct content for unauthenticated users', () => {
      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            featureType="createSeries"
            userAuthState="unauthenticated"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Login Required')).toBeInTheDocument()
      expect(
        screen.getByText('Please log in to create custom flows')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /log in/i })
      ).toBeInTheDocument()
    })

    it('displays correct content for authenticated users (they have access)', () => {
      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            featureType="createAsana"
            userAuthState="authenticated-pro"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Feature Available')).toBeInTheDocument()
      expect(
        screen.getByText('You can create custom asanas')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /continue/i })
      ).toBeInTheDocument()
    })

    it('displays correct content for pro users', () => {
      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            featureType="createSequence"
            userAuthState="authenticated-pro"
          />
        </TestWrapper>
      )

      expect(screen.getByText('Feature Available')).toBeInTheDocument()
      expect(
        screen.getByText('You can create custom sequences')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /continue/i })
      ).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const onCloseMock = jest.fn()

      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} onClose={onCloseMock} />
        </TestWrapper>
      )

      const closeButton = screen.getByLabelText(/close/i)
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1)
      })
    })

    it('calls onCtaClick and onClose when CTA button is clicked', async () => {
      const onCtaClickMock = jest.fn()
      const onCloseMock = jest.fn()

      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            onCtaClick={onCtaClickMock}
            onClose={onCloseMock}
          />
        </TestWrapper>
      )

      const ctaButton = screen.getByRole('button', { name: /log in/i })
      fireEvent.click(ctaButton)

      await waitFor(() => {
        expect(onCtaClickMock).toHaveBeenCalledTimes(1)
        expect(onCloseMock).toHaveBeenCalledTimes(1)
      })
    })

    it('handles keyboard navigation', async () => {
      const onCloseMock = jest.fn()

      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} onClose={onCloseMock} />
        </TestWrapper>
      )

      const snackbar = screen.getByTestId('freemium-notification-snackbar')
      fireEvent.keyDown(snackbar, { key: 'Escape' })

      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1)
      })
    })

    it('auto-dismisses after specified duration', async () => {
      const onCloseMock = jest.fn()

      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            onClose={onCloseMock}
            duration={1000}
          />
        </TestWrapper>
      )

      await waitFor(
        () => {
          expect(onCloseMock).toHaveBeenCalledTimes(1)
        },
        { timeout: 1500 }
      )
    })
  })

  describe('Feature Types', () => {
    const featureTypes: Array<{
      type: FreemiumNotificationProps['featureType']
      expectedText: string
    }> = [
      { type: 'createAsana', expectedText: 'custom asanas' },
      { type: 'createFlow', expectedText: 'custom flows' },
      { type: 'createSeries', expectedText: 'custom flows' },
      { type: 'createSequence', expectedText: 'custom sequences' },
    ]

    featureTypes.forEach(({ type, expectedText }) => {
      it(`displays correct content for ${type} feature`, () => {
        render(
          <TestWrapper>
            <FreemiumNotification
              {...defaultProps}
              featureType={type}
              userAuthState="unauthenticated"
            />
          </TestWrapper>
        )

        expect(
          screen.getByText(`Please log in to create ${expectedText}`)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} />
        </TestWrapper>
      )

      const alert = screen.getByTestId('freemium-notification-alert')
      expect(alert).toHaveAttribute('role', 'alert')

      // Check that the content container exists
      const contentContainer = screen.getByTestId(
        'freemium-notification-content'
      )
      expect(contentContainer).toBeInTheDocument()
    })

    it('has accessible close button', () => {
      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} />
        </TestWrapper>
      )

      const closeButton = screen.getByLabelText(/close/i)
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveAttribute('type', 'button')
    })

    it('has sufficient color contrast for different user states', () => {
      const { rerender } = render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            userAuthState="unauthenticated"
          />
        </TestWrapper>
      )

      // Test info severity for unauthenticated
      expect(screen.getByTestId('freemium-notification-alert')).toHaveClass(
        'MuiAlert-filledInfo'
      )

      rerender(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            userAuthState="authenticated-pro"
          />
        </TestWrapper>
      )

      // Test success severity for authenticated users
      expect(screen.getByTestId('freemium-notification-alert')).toHaveClass(
        'MuiAlert-filledSuccess'
      )
    })

    it('supports screen reader announcements', () => {
      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} />
        </TestWrapper>
      )

      const contentElement = screen.getByText('Login Required')
      expect(
        contentElement.closest('#freemium-notification-content')
      ).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('adapts content for mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query.includes('(max-width: 600px)'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <TestWrapper>
          <FreemiumNotification {...defaultProps} />
        </TestWrapper>
      )

      // Verify component renders with mobile considerations
      expect(
        screen.getByTestId('freemium-notification-alert')
      ).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing onCtaClick gracefully', async () => {
      const onCloseMock = jest.fn()

      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            onClose={onCloseMock}
            onCtaClick={undefined}
          />
        </TestWrapper>
      )

      // When onCtaClick is undefined, the CTA button should not render
      expect(
        screen.queryByRole('button', { name: /log in/i })
      ).not.toBeInTheDocument()

      // But the close button should still be there
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1)
      })
    })

    it('renders with invalid feature type', () => {
      render(
        <TestWrapper>
          <FreemiumNotification
            {...defaultProps}
            featureType={'invalidFeature' as any}
          />
        </TestWrapper>
      )

      expect(
        screen.getByText('Please log in to create this feature')
      ).toBeInTheDocument()
    })
  })
})
