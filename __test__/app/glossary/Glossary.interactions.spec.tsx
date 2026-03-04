import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Glossary } from '../../../app/glossary/Glossary'
import { GlossaryProvider } from '../../../app/glossary/GlossaryContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../../../styles/theme'

// Mock fetch for CRUD operations
const fetchMock = jest.fn()
;(global as any).fetch = fetchMock

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: any) => <>{children}</>,
}))

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SessionProvider session={null}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlossaryProvider>{children}</GlossaryProvider>
    </ThemeProvider>
  </SessionProvider>
)

describe('Glossary interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // First fetch call for initial load returns empty user terms
    fetchMock.mockImplementation((url: string, options?: any) => {
      if (url === '/api/glossary' && (!options || options.method === 'GET')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }
      // Create term
      if (url === '/api/glossary' && options?.method === 'POST') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              ...body,
              meaning: body.definition || body.meaning,
              source: 'user',
            }),
        })
      }
      // Update term
      if (url.startsWith('/api/glossary/') && options?.method === 'PATCH') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...body }),
        })
      }
      // Delete term
      if (url.startsWith('/api/glossary/') && options?.method === 'DELETE') {
        return Promise.resolve({ ok: true, text: () => Promise.resolve('') })
      }
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve('not found'),
      })
    })
  })

  it('filters by search input', async () => {
    render(<Glossary />, { wrapper: Wrapper })
    // default terms loaded from static list present; pick a known term e.g., Asana
    expect(await screen.findByText(/āsana/i)).toBeInTheDocument()

    // Verify Pranayama is initially visible
    expect(screen.getByText(/pranayama/i)).toBeInTheDocument()

    const search = screen.getByLabelText(/search/i)

    // Type the search term - search for "breath" which should match Pranayama's category and description
    fireEvent.change(search, { target: { value: 'breath' } })

    // Wait for React to update with filtered results
    await waitFor(
      () => {
        expect(screen.getByText(/pranayama/i)).toBeInTheDocument()
        // Asana should NOT be visible anymore since it doesn't match "breath"
        expect(screen.queryByText(/^Asana$/)).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})
