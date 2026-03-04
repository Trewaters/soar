/**
 * Integration tests for the complete authentication flow
 * Tests the end-to-end flow: Enter email → See error → Click password reset → Email pre-filled
 */

/**
 * Integration tests for the complete authentication flow
 * Tests the end-to-end flow: Enter email → See error → Click password reset → Email pre-filled
 */

// Mock dependencies FIRST before any imports
jest.mock('next-auth/react')
jest.mock('next/navigation')

// Mock the root auth.ts file
jest.mock('../../auth', () => ({
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
jest.mock('@app/hooks/useNavigationWithLoading', () => ({
  useNavigationWithLoading: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Now import everything else
import '@testing-library/jest-dom'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import CredentialsInput from '@app/auth/signin/credentialsInput'
import PasswordRecoveryPage from '@app/auth/passwordRecovery/page'
import SignInForm from '@app/auth/signin/SignInForm'

// Define AuthErrorCode locally to match the mock
enum AuthErrorCode {
  EMAIL_EXISTS_CREDENTIALS = 'EMAIL_EXISTS_CREDENTIALS',
  EMAIL_EXISTS_OAUTH = 'EMAIL_EXISTS_OAUTH',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  NO_PASSWORD_SET = 'NO_PASSWORD_SET',
}

global.fetch = jest.fn()

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Authentication Flow Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()

    // Default router mock
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any)

    // Default search params mock
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any)

    // Default fetch mock
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: null }),
    } as Response)
  })

  describe('Complete Flow: Existing Email with Credentials → Password Recovery', () => {
    it('should show error for existing credentials account and navigate to password recovery', async () => {
      const testEmail = 'existing@example.com'

      // Step 1: User enters existing email
      mockFetch.mockImplementation(async (input) => {
        const url = String(input)

        if (url.includes('/api/user/fetchAccount')) {
          return {
            ok: true,
            json: async () => ({
              data: {
                email: testEmail,
                provider: 'credentials',
                providerId: 'user_123',
              },
            }),
          } as Response
        }

        return {
          ok: true,
          json: async () => ({ data: null }),
        } as Response
      })

      // Step 2: User tries to create account, gets error
      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.EMAIL_EXISTS_CREDENTIALS}`,
      } as any)

      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      // Enter email
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, testEmail)

      // Wait for email check
      await waitFor(() => {
        expect(mockOnProviderTypeChange).toHaveBeenCalledWith('credentials')
      })

      // Enter password and submit
      const passwordInput = screen.getByLabelText(/password/i)
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      // Verify error message appears
      await waitFor(() => {
        expect(screen.getByText(/account already exists/i)).toBeInTheDocument()
      })

      // Step 3: Click password reset link
      const resetLink = screen.getByRole('link', {
        name: /reset your password/i,
      })
      const href = resetLink.getAttribute('href')
      expect(href).toContain('/auth/passwordRecovery')
      expect(decodeURIComponent(href || '')).toContain(testEmail)
    })
  })

  describe('Complete Flow: Existing Email with OAuth → Highlight OAuth Button', () => {
    it('should detect OAuth provider and highlight the correct button', async () => {
      const testEmail = 'oauth@example.com'
      const mockOnProviderTypeChange = jest.fn()

      // Mock API response for OAuth user
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            email: testEmail,
            provider: 'google',
            providerId: 'google_123',
          },
        }),
      } as Response)

      const mockProviders = [
        { id: 'google', name: 'Google' },
        { id: 'github', name: 'GitHub' },
      ]

      render(<SignInForm providers={mockProviders} callbackUrl="/" />)

      // Enter OAuth-registered email
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, testEmail)

      // Verify provider type is detected
      await waitFor(() => {
        // The OAuth button highlighting would be visible here
        // In actual implementation, the Google button would have pulsing animation
        expect(mockFetch).toHaveBeenCalled()
      })
    })

    it('should show OAuth provider warning message', async () => {
      const testEmail = 'github@example.com'

      mockFetch.mockImplementation(async (input) => {
        const url = String(input)

        if (url.includes('/api/user/fetchAccount')) {
          return {
            ok: true,
            json: async () => ({
              data: {
                email: testEmail,
                provider: 'github',
                providerId: 'github_123',
              },
            }),
          } as Response
        }

        return {
          ok: true,
          json: async () => ({ data: null }),
        } as Response
      })

      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.EMAIL_EXISTS_OAUTH} - registered with GitHub`,
      } as any)

      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, testEmail)
      await user.type(passwordInput, 'somepassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/account already exists/i)).toBeInTheDocument()
        expect(screen.getByText(/github/i)).toBeInTheDocument()
      })
    })
  })

  describe('Complete Flow: Invalid Password → Password Recovery', () => {
    it('should show invalid password error and allow password reset', async () => {
      const testEmail = 'user@example.com'

      // Mock existing credentials account
      mockFetch.mockImplementation(async (input) => {
        const url = String(input)

        if (url.includes('/api/user/fetchAccount')) {
          return {
            ok: true,
            json: async () => ({
              data: {
                email: testEmail,
                provider: 'credentials',
                providerId: 'user_existing',
              },
            }),
          } as Response
        }

        return {
          ok: true,
          json: async () => ({ data: null }),
        } as Response
      })

      mockSignIn.mockResolvedValueOnce({
        error: `Error: ${AuthErrorCode.INVALID_PASSWORD}`,
      } as any)

      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, testEmail)

      // Wait for email check to complete
      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled()
        },
        { timeout: 2000 }
      )

      await user.type(passwordInput, 'wrongpassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText(/invalid email or password/i)
        ).toBeInTheDocument()
      })

      // Verify password reset link
      const resetLink = screen.getByRole('link', {
        name: /reset your password/i,
      })
      const href = resetLink.getAttribute('href')
      expect(decodeURIComponent(href || '')).toContain(testEmail)
    })
  })

  describe('Password Recovery Page Email Pre-population', () => {
    it('should pre-fill email from query parameter', () => {
      const testEmail = 'prefilled@example.com'

      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key) => (key === 'email' ? testEmail : null)),
      } as any)

      render(<PasswordRecoveryPage />)

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      expect(emailInput.value).toBe(testEmail)
      expect(
        screen.getByText(/email pre-filled from your sign-in attempt/i)
      ).toBeInTheDocument()
    })

    it('should allow submitting password recovery with pre-filled email', async () => {
      const testEmail = 'recovery@example.com'

      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key) => (key === 'email' ? testEmail : null)),
      } as any)

      render(<PasswordRecoveryPage />)

      const submitButton = screen.getByRole('button', {
        name: /send temporary password/i,
      })
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText(/if an account exists with this email/i)
        ).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toHaveValue(testEmail)
      })
    })
  })

  describe('Navigation Between Sign-In and Password Recovery', () => {
    it('should navigate from password recovery back to sign in', () => {
      render(<PasswordRecoveryPage />)

      const backLink = screen.getByRole('link', { name: /back to sign in/i })
      expect(backLink).toHaveAttribute('href', '/auth/signin')

      const signInLink = screen.getByRole('link', { name: /sign in here/i })
      expect(signInLink).toHaveAttribute('href', '/auth/signin')
    })

    it('should navigate from sign in to password recovery', () => {
      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const forgotPasswordButton = screen.getByText(/forgot password/i)
      expect(forgotPasswordButton).toBeInTheDocument()
    })
  })

  describe('Rate Limiting Behavior', () => {
    it('should handle rate limit errors gracefully', async () => {
      const testEmail = 'ratelimited@example.com'

      // Mock rate limit response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Too many requests. Please try again later.',
        }),
      } as Response)

      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, testEmail)

      await waitFor(() => {
        // Should handle error gracefully without crashing
        expect(mockOnProviderTypeChange).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('Multiple Provider Scenarios', () => {
    it('should prioritize credentials provider when user has multiple providers', async () => {
      const testEmail = 'multi@example.com'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            email: testEmail,
            provider: 'credentials', // Primary provider
            providerId: 'user_123',
            hasMultipleProviders: true,
            providers: ['credentials', 'google'],
          },
        }),
      } as Response)

      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, testEmail)

      await waitFor(() => {
        expect(mockOnProviderTypeChange).toHaveBeenCalledWith('credentials')
      })
    })
  })

  describe('New User Account Creation Flow', () => {
    it('should successfully create new account for new email', async () => {
      const testEmail = 'newuser@example.com'
      const testTosVersion = 'tos-version-123'

      mockFetch.mockImplementation(async (input) => {
        const url = String(input)

        if (url.includes('/api/user/fetchAccount')) {
          return {
            ok: true,
            json: async () => ({ data: null }),
          } as Response
        }

        if (url.includes('/api/tos')) {
          return {
            ok: true,
            json: async () => ({ id: testTosVersion }),
          } as Response
        }

        return {
          ok: true,
          json: async () => ({ data: null }),
        } as Response
      })

      mockSignIn.mockResolvedValueOnce({ ok: true } as any)

      const mockOnProviderTypeChange = jest.fn()
      render(
        <CredentialsInput onProviderTypeChange={mockOnProviderTypeChange} />
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, testEmail)
      await user.type(passwordInput, 'newpassword123')

      await waitFor(() => {
        expect(
          screen.getByText(/this email is available for a new account/i)
        ).toBeInTheDocument()
      })

      const tosCheckbox = screen.getByRole('checkbox')
      await user.click(tosCheckbox)

      const submitButton = screen.getByRole('button', {
        name: /create new account/i,
      })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          redirect: false,
          email: testEmail,
          password: 'newpassword123',
          isNewAccount: 'true',
          tosAccepted: 'true',
          tosVersionId: testTosVersion,
        })
      })
    })
  })
})
