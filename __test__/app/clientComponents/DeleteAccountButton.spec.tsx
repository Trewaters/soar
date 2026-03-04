import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from '@styles/theme'
import DeleteAccountButton from '@app/clientComponents/DeleteAccountButton'

const mockSignOut = jest.fn()

jest.mock('next-auth/react', () => ({
  signOut: (options: any) => mockSignOut(options),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

describe('DeleteAccountButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('should sign out and redirect after successful account deletion', async () => {
    const user = userEvent.setup()

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    })

    render(<DeleteAccountButton />, { wrapper: TestWrapper })

    await user.click(screen.getByRole('button', { name: /delete my account/i }))

    const confirmationInput = screen.getByPlaceholderText(
      /type delete to confirm/i
    )
    await user.type(confirmationInput, 'DELETE')

    await user.click(
      screen.getByRole('button', { name: /yes, delete my account/i })
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({
        redirect: true,
        callbackUrl: '/?account-deleted=true',
      })
    })
  })

  it('should keep delete confirmation disabled until text is DELETE', async () => {
    const user = userEvent.setup()

    render(<DeleteAccountButton />, { wrapper: TestWrapper })

    await user.click(screen.getByRole('button', { name: /delete my account/i }))
    await user.type(
      screen.getByPlaceholderText(/type delete to confirm/i),
      'DEL'
    )

    expect(
      screen.getByRole('button', { name: /yes, delete my account/i })
    ).toBeDisabled()
    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockSignOut).not.toHaveBeenCalled()
  })
})
