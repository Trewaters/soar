import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmationDialog from '@clientComponents/ConfirmationDialog'
import { ThemeProvider } from '@mui/material'
import theme from '@styles/theme'
import React from 'react'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('ConfirmationDialog', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    isWarning: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render dialog when open is true', () => {
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
      expect(
        screen.getByText('Are you sure you want to proceed?')
      ).toBeInTheDocument()
    })

    it('should not render dialog when open is false', () => {
      render(<ConfirmationDialog {...defaultProps} open={false} />, {
        wrapper: TestWrapper,
      })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render confirm and cancel buttons with custom text', () => {
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.getByRole('button', { name: /^Confirm$/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /^Cancel$/i })
      ).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup()
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const confirmButton = screen.getByRole('button', { name: /^Confirm$/i })
      await user.click(confirmButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const cancelButton = screen.getByRole('button', { name: /^Cancel$/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when clicking backdrop', async () => {
      const user = userEvent.setup()
      const { container } = render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // Click on the backdrop (MuiBackdrop-root)
      const backdrop = container.querySelector('.MuiBackdrop-root')
      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnCancel).toHaveBeenCalledTimes(1)
      }
    })

    it('should call onCancel when pressing Escape key', async () => {
      const user = userEvent.setup()
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })

    it('should have proper heading hierarchy', () => {
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      const title = screen.getByText('Confirm Action')
      expect(title.tagName).toBe('H2')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ConfirmationDialog {...defaultProps} />, {
        wrapper: TestWrapper,
      })

      // Tab to first button (Cancel)
      await user.tab()
      expect(screen.getByRole('button', { name: /^Cancel$/i })).toHaveFocus()

      // Tab to second button (Confirm)
      await user.tab()
      expect(screen.getByRole('button', { name: /^Confirm$/i })).toHaveFocus()
    })
  })

  describe('Custom Content', () => {
    it('should render with different titles', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          title="Delete Account"
          message="This action cannot be undone"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText('Delete Account')).toBeInTheDocument()
      expect(
        screen.getByText('This action cannot be undone')
      ).toBeInTheDocument()
    })

    it('should render with custom button labels', () => {
      render(
        <ConfirmationDialog
          {...defaultProps}
          confirmText="Yes, Delete"
          cancelText="No, Keep It"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByRole('button', { name: /^Yes, Delete$/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /^No, Keep It$/i })
      ).toBeInTheDocument()
    })
  })
})
