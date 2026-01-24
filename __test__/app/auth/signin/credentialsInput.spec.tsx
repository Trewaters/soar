/**
 * Unit tests for CredentialsInput component
 * Tests provider type detection, error message rendering, and user interactions
 */

// Mock auth module FIRST to prevent ESM import issues
jest.mock('../../../../auth', () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  AuthErrorCode: {
    EMAIL_EXISTS_CREDENTIALS: 'EMAIL_EXISTS_CREDENTIALS',
    EMAIL_EXISTS_OAUTH: 'EMAIL_EXISTS_OAUTH',
    INVALID_PASSWORD: 'INVALID_PASSWORD',
    NO_PASSWORD_SET: 'NO_PASSWORD_SET',
  },
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import CredentialsInput from '@app/auth/signin/credentialsInput'

// Define AuthErrorCode locally to match the mock
enum AuthErrorCode {
  EMAIL_EXISTS_CREDENTIALS = 'EMAIL_EXISTS_CREDENTIALS',
  EMAIL_EXISTS_OAUTH = 'EMAIL_EXISTS_OAUTH',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  NO_PASSWORD_SET = 'NO_PASSWORD_SET',
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock useNavigationWithLoading hook
jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock fetch for email check
global.fetch = jest.fn()

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('CredentialsInput Component', () => {
  const user = userEvent.setup()
  const mockOnProviderTypeChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: null }),
    } as Response)
  })

  describe('Rendering', () => {
    it('should render email and password fields', () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('should render sign in button', () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument()
    })

    it('should render forgot password link', () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
    })
  })

  describe('Email Existence Check', () => {
    it('should check if email exists when user types', async () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(
            '/api/user/fetchAccount?email=test%40example.com'
          )
        )
      })
    })

    it('should set isNewUser to true when email does not exist', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: null }),
      } as Response)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'newuser@example.com')

      await waitFor(() => {
        const helperTexts = screen.getAllByText(/email is available/i)
        expect(helperTexts.length).toBeGreaterThan(0)
      })
    })

    it('should set providerType when email exists with credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            email: 'existing@example.com',
            provider: 'credentials',
            providerId: 'user_123',
          },
        }),
      } as Response)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'existing@example.com')

      await waitFor(() => {
        expect(mockOnProviderTypeChange).toHaveBeenCalledWith('credentials')
      })
    })

    it('should set providerType when email exists with OAuth provider', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            email: 'oauth@example.com',
            provider: 'google',
            providerId: 'google_123',
          },
        }),
      } as Response)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'oauth@example.com')

      await waitFor(() => {
        expect(mockOnProviderTypeChange).toHaveBeenCalledWith('google')
      })
    })

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')

      await waitFor(() => {
        expect(mockOnProviderTypeChange).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('Form Submission', () => {
    it('should call signIn for new user creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      } as Response)

      mockSignIn.mockResolvedValueOnce({ ok: true } as any)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'newuser@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', {
        name: /create new account/i,
      })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          redirect: false,
          email: 'newuser@example.com',
          password: 'password123',
          isNewAccount: 'true',
        })
      })
    })

    it('should call signIn for existing user login', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            email: 'existing@example.com',
            provider: 'credentials',
          },
        }),
      } as Response)

      mockSignIn.mockResolvedValueOnce({ ok: true } as any)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'existing@example.com')

      // Wait for email check to complete and button to change to "Sign In"
      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: /sign in/i })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          redirect: false,
          email: 'existing@example.com',
          password: 'password123',
        })
      })
    })
  })

  describe('Error Message Rendering', () => {
    it('should show warning for credentials account that exists', async () => {
      // Mock email existence check showing credentials account exists
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            email: 'existing@example.com',
            provider: 'credentials',
            providerId: 'cred_123',
          },
        }),
      } as Response)

      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.EMAIL_EXISTS_CREDENTIALS}`,
      } as any)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'existing@example.com')

      // Wait for email check to complete and button to change
      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: /sign in/i })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/account already exists/i)).toBeInTheDocument()
        const resetPasswordTexts = screen.getAllByText(/reset your password/i)
        expect(resetPasswordTexts.length).toBeGreaterThan(0)
      })
    })

    it('should show warning for OAuth account with provider name', async () => {
      // Mock email existence check returning OAuth account - use mockResolvedValue for debounced calls
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            email: 'oauth@example.com',
            provider: 'google',
            providerId: 'google_123',
          },
        }),
      } as Response)

      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.EMAIL_EXISTS_OAUTH} - registered with Google`,
      } as any)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'oauth@example.com')

      // Wait for email check to complete and button to change
      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: /sign in/i })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/registered with google/i)).toBeInTheDocument()
      })
    })

    it('should show error for invalid password', async () => {
      // Mock existing credentials account - need multiple responses for debounced calls
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            email: 'user@example.com',
            provider: 'credentials',
            providerId: 'user_123',
          },
        }),
      } as Response)

      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.INVALID_PASSWORD}`,
      } as any)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'user@example.com')

      // Wait for button to change to "Sign In"
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /sign in/i })
        ).toBeInTheDocument()
      })

      await user.type(passwordInput, 'wrongpassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText(/invalid email or password/i)
        ).toBeInTheDocument()
        const resetPasswordTexts = screen.getAllByText(/reset your password/i)
        expect(resetPasswordTexts.length).toBeGreaterThan(0)
      })
    })

    it('should include password reset link in error messages', async () => {
      // Mock existing credentials account - need multiple responses for debounced calls
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            email: 'user@example.com',
            provider: 'credentials',
            providerId: 'user_123',
          },
        }),
      } as Response)

      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.INVALID_PASSWORD}`,
      } as any)

      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'user@example.com')

      // Wait for button to change to "Sign In"
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /sign in/i })
        ).toBeInTheDocument()
      })

      await user.type(passwordInput, 'wrongpassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        const resetLink = screen.getByRole('link', {
          name: /reset your password/i,
        })
        expect(resetLink).toHaveAttribute(
          'href',
          expect.stringContaining('/auth/passwordRecovery')
        )
        // URL encodes @ as %40
        const href = resetLink.getAttribute('href')
        expect(decodeURIComponent(href!)).toContain('email=user@example.com')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        'type',
        'password'
      )
    })

    it('should disable submit button when fields are empty', () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toBeDisabled()
    })

    it('should enable submit button when fields are filled', async () => {
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')

      await waitFor(() => {
        // Button text can be either "Sign In" or "Create New Account" depending on email check
        const submitButton = screen.getByRole('button', {
          name: /sign in|create new account/i,
        })
        expect(submitButton).not.toBeDisabled()
      })
    })
  })
})
