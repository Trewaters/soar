import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import theme from '../../../../styles/theme'
import EditUserDetails from '../../../../app/navigator/profile/editUserDetails'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt || ''} />
  ),
}))

// Mock the UserContext
const mockUseUser = jest.fn()
const mockDispatch = jest.fn()

jest.mock('@app/context/UserContext', () => ({
  UseUser: () => mockUseUser(),
}))

// Mock the useActiveProfileImage hook
const mockUseActiveProfileImage = jest.fn()
jest.mock('@app/hooks/useActiveProfileImage', () => ({
  useActiveProfileImage: () => mockUseActiveProfileImage(),
}))

// Mock next-auth
const mockUseSession = jest.fn()
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Standard test wrapper for Soar components
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </SessionProvider>
)

describe('EditUserDetails - Action Buttons', () => {
  const defaultUserData = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    headline: 'Yoga Instructor',
    bio: 'I love yoga',
    pronouns: 'they/them',
    websiteURL: 'https://example.com',
    location: 'San Francisco, CA',
    createdAt: '2023-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock fetch globally
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ images: [] }),
    })

    // Set default mock for useSession with authenticated user
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
          name: 'Test User',
        },
      },
      status: 'authenticated',
    })

    // Set default mock for useUser
    mockUseUser.mockReturnValue({
      state: { userData: defaultUserData },
      dispatch: mockDispatch,
    })

    // Set default mock for useActiveProfileImage
    mockUseActiveProfileImage.mockReturnValue({
      activeImage: '/images/profile-placeholder.png',
      isPlaceholder: true,
      hasCustomImage: false,
      imageCount: 0,
      isDefaultImage: false,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Sticky Action Bar Visibility', () => {
    it('should display the sticky action bar when in edit mode', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const actionBar = screen.getByTestId('sticky-action-bar')
        expect(actionBar).toBeInTheDocument()
      })
    })

    it('should display the sticky action bar with fixed positioning', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const actionBar = screen.getByTestId('sticky-action-bar')
        expect(actionBar).toBeInTheDocument()
        expect(actionBar).toHaveStyle({ position: 'fixed' })
      })
    })
  })

  describe('Save Changes Button', () => {
    it('should display Save Changes button in the action bar', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const saveButton = screen.getByTestId('save-changes-button')
        expect(saveButton).toBeInTheDocument()
      })
    })

    it('should display "Save Changes" text on the save button', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save changes/i })
        expect(saveButton).toBeInTheDocument()
      })
    })

    it('should have save button with contained variant styling', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const saveButton = screen.getByTestId('save-changes-button')
        expect(saveButton).toHaveClass('MuiButton-contained')
      })
    })

    it('should have save button with type submit for form submission', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const saveButton = screen.getByTestId('save-changes-button')
        expect(saveButton).toHaveAttribute('type', 'submit')
      })
    })
  })

  describe('Cancel Button', () => {
    it('should display Cancel button in the action bar', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const cancelButton = screen.getByTestId('cancel-edit-button')
        expect(cancelButton).toBeInTheDocument()
      })
    })

    it('should display "Cancel" text on the cancel button', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i })
        expect(cancelButton).toBeInTheDocument()
      })
    })

    it('should have cancel button with outlined variant styling', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const cancelButton = screen.getByTestId('cancel-edit-button')
        expect(cancelButton).toHaveClass('MuiButton-outlined')
      })
    })

    it('should call onCancel callback when cancel button is clicked', async () => {
      const mockOnCancel = jest.fn()
      const user = userEvent.setup()

      render(<EditUserDetails onCancel={mockOnCancel} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(screen.getByTestId('cancel-edit-button')).toBeInTheDocument()
      })

      const cancelButton = screen.getByTestId('cancel-edit-button')
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Action Bar Layout', () => {
    it('should display both Save and Cancel buttons together in the action bar', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const actionBar = screen.getByTestId('sticky-action-bar')
        const saveButton = screen.getByTestId('save-changes-button')
        const cancelButton = screen.getByTestId('cancel-edit-button')

        expect(actionBar).toContainElement(saveButton)
        expect(actionBar).toContainElement(cancelButton)
      })
    })

    it('should position action bar above the bottom navigation', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const actionBar = screen.getByTestId('sticky-action-bar')
        // Action bar is positioned 66px from bottom to sit above the bottom nav
        expect(actionBar).toHaveStyle({ bottom: '66px' })
      })
    })
  })

  describe('Action Bar Accessibility', () => {
    it('should have accessible button labels for screen readers', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        // Save button should be accessible by role
        const saveButton = screen.getByRole('button', { name: /save changes/i })
        expect(saveButton).toBeInTheDocument()

        // Cancel button should be accessible by role
        const cancelButton = screen.getByRole('button', { name: /cancel/i })
        expect(cancelButton).toBeInTheDocument()
      })
    })
  })

  describe('Action Buttons Prevent Accidental Removal', () => {
    /**
     * These tests ensure the Save and Cancel buttons remain present in edit mode.
     * They serve as regression tests to prevent accidental removal of these
     * critical UI elements during future refactoring.
     */

    it('should always render save button when component is mounted', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      // Wait for component to fully render
      await waitFor(
        () => {
          const saveButton = screen.getByTestId('save-changes-button')
          expect(saveButton).toBeInTheDocument()
          expect(saveButton).toBeVisible()
        },
        { timeout: 3000 }
      )
    })

    it('should always render cancel button when component is mounted', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      // Wait for component to fully render
      await waitFor(
        () => {
          const cancelButton = screen.getByTestId('cancel-edit-button')
          expect(cancelButton).toBeInTheDocument()
          expect(cancelButton).toBeVisible()
        },
        { timeout: 3000 }
      )
    })

    it('should render action bar with exactly two action buttons', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        const actionBar = screen.getByTestId('sticky-action-bar')
        const buttons = actionBar.querySelectorAll('button')
        expect(buttons.length).toBe(2)
      })
    })

    it('should maintain button presence after user interactions', async () => {
      const user = userEvent.setup()
      render(<EditUserDetails />, { wrapper: TestWrapper })

      // Wait for form to render
      await waitFor(() => {
        expect(screen.getByTestId('save-changes-button')).toBeInTheDocument()
      })

      // Try to interact with the form (type in a field using name attribute)
      const firstNameInput = screen.getByRole('textbox', {
        name: /first name/i,
      })
      await user.type(firstNameInput, 'NewName')

      // Buttons should still be present after interaction
      expect(screen.getByTestId('save-changes-button')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-edit-button')).toBeInTheDocument()
    })
  })

  describe('Header Cancel Button', () => {
    it('should display cancel button in the green header when onCancel is provided', async () => {
      const mockOnCancel = jest.fn()
      render(<EditUserDetails onCancel={mockOnCancel} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        const headerCancelButton = screen.getByTestId(
          'cancel-edit-header-button'
        )
        expect(headerCancelButton).toBeInTheDocument()
      })
    })

    it('should not display header cancel button when onCancel is not provided', async () => {
      render(<EditUserDetails />, { wrapper: TestWrapper })

      await waitFor(() => {
        expect(screen.getByTestId('save-changes-button')).toBeInTheDocument()
      })

      const headerCancelButton = screen.queryByTestId(
        'cancel-edit-header-button'
      )
      expect(headerCancelButton).not.toBeInTheDocument()
    })

    it('should call onCancel when header cancel button is clicked', async () => {
      const mockOnCancel = jest.fn()
      const user = userEvent.setup()

      render(<EditUserDetails onCancel={mockOnCancel} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        expect(
          screen.getByTestId('cancel-edit-header-button')
        ).toBeInTheDocument()
      })

      const headerCancelButton = screen.getByTestId('cancel-edit-header-button')
      await user.click(headerCancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should have proper accessibility label for the header cancel button', async () => {
      const mockOnCancel = jest.fn()
      render(<EditUserDetails onCancel={mockOnCancel} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        const headerCancelButton = screen.getByRole('button', {
          name: /cancel editing and view profile/i,
        })
        expect(headerCancelButton).toBeInTheDocument()
      })
    })

    it('should position header cancel button in the green banner next to the title', async () => {
      const mockOnCancel = jest.fn()
      render(<EditUserDetails onCancel={mockOnCancel} />, {
        wrapper: TestWrapper,
      })

      await waitFor(() => {
        const headerCancelButton = screen.getByTestId(
          'cancel-edit-header-button'
        )
        expect(headerCancelButton).toBeVisible()
      })
    })
  })
})
