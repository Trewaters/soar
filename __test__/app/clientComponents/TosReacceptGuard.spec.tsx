import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TosReacceptGuard from '@app/clientComponents/TosReacceptGuard'

// Mock next-auth useSession
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

const { useSession } = require('next-auth/react')

describe('TosReacceptGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useSession.mockReturnValue({
      data: { user: { id: 'u1', email: 't@e' } },
      status: 'authenticated',
    })
  })

  it('opens modal when server reports not accepted and closes after accept', async () => {
    // Mock fetch: first call for status -> accepted: false
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accepted: false }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

    render(<TosReacceptGuard />)

    // Expect modal title to appear
    expect(
      await screen.findByText('Terms of Service Update')
    ).toBeInTheDocument()

    // Click Accept button
    const acceptBtn = screen.getByRole('button', { name: /Accept/i })
    await userEvent.click(acceptBtn)

    // After accept, modal should close (modal content removed)
    await waitFor(() =>
      expect(screen.queryByText('Terms of Service Update')).toBeNull()
    )
  })
})
