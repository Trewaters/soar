import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UnauthorizedError from '@app/clientComponents/UnauthorizedError'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

// Mock the useNavigationWithLoading hook
const mockPush = jest.fn()
jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('UnauthorizedError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render when open is true', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Authorization Required')).toBeInTheDocument()
    })

    it('should not be visible when open is false', () => {
      render(<UnauthorizedError open={false} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.queryByText('Authorization Required')
      ).not.toBeInTheDocument()
    })

    it('should render LockIcon', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      const alert = screen.getByRole('alert')
      const icon = alert.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Error Messages - PUBLIC Content', () => {
    it('should display correct message for edit action on PUBLIC content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="edit"
          contentType="PUBLIC"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('PUBLIC content can only be edited by administrators.')
      ).toBeInTheDocument()
    })

    it('should display correct message for delete action on PUBLIC content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="delete"
          contentType="PUBLIC"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText(
          'PUBLIC content can only be deleted by administrators.'
        )
      ).toBeInTheDocument()
    })

    it('should display correct message for create action on PUBLIC content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="create"
          contentType="PUBLIC"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You do not have permission to create PUBLIC content.')
      ).toBeInTheDocument()
    })

    it('should display generic message for other actions on PUBLIC content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="view"
          contentType="PUBLIC"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You do not have permission to modify PUBLIC content.')
      ).toBeInTheDocument()
    })
  })

  describe('Error Messages - Personal Content', () => {
    it('should display correct message for personal content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="edit"
          contentType="personal"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You can only modify your own content.')
      ).toBeInTheDocument()
    })
  })

  describe('Error Messages - Generic', () => {
    it('should display generic edit message when no contentType provided', () => {
      render(
        <UnauthorizedError open={true} onClose={jest.fn()} actionType="edit" />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You do not have permission to edit this content.')
      ).toBeInTheDocument()
    })

    it('should display generic delete message when no contentType provided', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="delete"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You do not have permission to delete this content.')
      ).toBeInTheDocument()
    })

    it('should display generic create message when no contentType provided', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          actionType="create"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You do not have permission to create this content.')
      ).toBeInTheDocument()
    })

    it('should display generic view message when no contentType provided', () => {
      render(
        <UnauthorizedError open={true} onClose={jest.fn()} actionType="view" />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText('You do not have permission to view this content.')
      ).toBeInTheDocument()
    })
  })

  describe('Custom Messages', () => {
    it('should display custom message when provided', () => {
      const customMessage = 'This is a custom error message'
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          message={customMessage}
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText(customMessage)).toBeInTheDocument()
    })

    it('should prioritize custom message over default messages', () => {
      const customMessage = 'Custom message overrides defaults'
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          message={customMessage}
          actionType="edit"
          contentType="PUBLIC"
        />,
        { wrapper: TestWrapper }
      )

      expect(screen.getByText(customMessage)).toBeInTheDocument()
      expect(
        screen.queryByText(
          'PUBLIC content can only be edited by administrators.'
        )
      ).not.toBeInTheDocument()
    })
  })

  describe('Action Guidance', () => {
    it('should display guidance for PUBLIC content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          contentType="PUBLIC"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText(/contact an administrator or create your own/i)
      ).toBeInTheDocument()
    })

    it('should display guidance for personal content', () => {
      render(
        <UnauthorizedError
          open={true}
          onClose={jest.fn()}
          contentType="personal"
        />,
        { wrapper: TestWrapper }
      )

      expect(
        screen.getByText(/Create your own content to customize your yoga/i)
      ).toBeInTheDocument()
    })

    it('should display generic guidance when no contentType provided', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      expect(
        screen.getByText(/Sign in with an authorized account/i)
      ).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const mockClose = jest.fn()

      render(<UnauthorizedError open={true} onClose={mockClose} />, {
        wrapper: TestWrapper,
      })

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      expect(mockClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Dismiss button is clicked', async () => {
      const user = userEvent.setup()
      const mockClose = jest.fn()

      render(<UnauthorizedError open={true} onClose={mockClose} />, {
        wrapper: TestWrapper,
      })

      const dismissButton = screen.getByRole('button', { name: /dismiss/i })
      await user.click(dismissButton)

      expect(mockClose).toHaveBeenCalledTimes(1)
    })

    it('should navigate and close when "Create Your Own" button is clicked', async () => {
      const user = userEvent.setup()
      const mockClose = jest.fn()

      render(<UnauthorizedError open={true} onClose={mockClose} />, {
        wrapper: TestWrapper,
      })

      const createButton = screen.getByRole('button', {
        name: /create your own/i,
      })
      await user.click(createButton)

      expect(mockClose).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/navigator/asanaPoses/createAsana')
    })

    it('should auto-hide after default duration', async () => {
      const mockClose = jest.fn()

      render(
        <UnauthorizedError
          open={true}
          onClose={mockClose}
          autoHideDuration={100}
        />,
        { wrapper: TestWrapper }
      )

      await waitFor(
        () => {
          expect(mockClose).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })

    it('should use custom autoHideDuration when provided', async () => {
      const mockClose = jest.fn()
      const customDuration = 50

      render(
        <UnauthorizedError
          open={true}
          onClose={mockClose}
          autoHideDuration={customDuration}
        />,
        { wrapper: TestWrapper }
      )

      await waitFor(
        () => {
          expect(mockClose).toHaveBeenCalled()
        },
        { timeout: 100 }
      )
    })
  })

  describe('Accessibility', () => {
    it('should have role="alert" for screen readers', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      expect(screen.getByText('Authorization Required')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /dismiss/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /create your own/i })
      ).toBeInTheDocument()
    })

    it('should have accessible button labels', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName()
      })
    })
  })

  describe('Snackbar Positioning', () => {
    it('should be positioned at top center', () => {
      const { container } = render(
        <UnauthorizedError open={true} onClose={jest.fn()} />,
        { wrapper: TestWrapper }
      )

      const snackbar = container.querySelector('.MuiSnackbar-root')
      expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopCenter')
    })
  })

  describe('Error Severity', () => {
    it('should render as error severity', () => {
      render(<UnauthorizedError open={true} onClose={jest.fn()} />, {
        wrapper: TestWrapper,
      })

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('MuiAlert-filledError')
    })
  })
})
