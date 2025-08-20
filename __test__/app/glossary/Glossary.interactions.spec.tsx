import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Glossary from '../../../app/glossary/Glossary'
import { GlossaryProvider } from '../../../app/glossary/GlossaryContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '@styles/theme'

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
    const search = screen.getByLabelText(/search/i)
    fireEvent.change(search, { target: { value: 'prāṇa' } })
    await waitFor(() => {
      // term with prāṇa should appear
      expect(screen.getByText(/prāṇāyāma/i)).toBeInTheDocument()
    })
  })

  it('opens create dialog and creates a term (shows snackbar)', async () => {
    render(<Glossary />, { wrapper: Wrapper })
    fireEvent.click(screen.getByRole('button', { name: /add term/i }))
    const termField = await screen.findByLabelText(/term/i)
    fireEvent.change(termField, { target: { value: 'Balance' } })
    fireEvent.change(screen.getByLabelText(/meaning/i), {
      target: { value: 'Equilibrium in posture' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/glossary',
        expect.any(Object)
      )
    )
    await waitFor(() => expect(screen.getByText('Balance')).toBeInTheDocument())
    await waitFor(() =>
      expect(screen.getByText(/created term/i)).toBeInTheDocument()
    )
  })

  it('edits a user-created term', async () => {
    render(<Glossary />, { wrapper: Wrapper })
    // create first
    fireEvent.click(screen.getByRole('button', { name: /add term/i }))
    fireEvent.change(await screen.findByLabelText(/term/i), {
      target: { value: 'Focus' },
    })
    fireEvent.change(screen.getByLabelText(/meaning/i), {
      target: { value: 'Concentration' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))
    await waitFor(() => screen.getByText('Focus'))

    // mock update response
    // open edit
    const editBtn = await screen.findByLabelText(/edit focus/i)
    fireEvent.click(editBtn)
    const meaningField = await screen.findByLabelText(/meaning/i)
    fireEvent.change(meaningField, {
      target: { value: 'Sustained concentration' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/glossary/Focus',
        expect.any(Object)
      )
    )
  })

  it('deletes a user-created term after confirmation', async () => {
    render(<Glossary />, { wrapper: Wrapper })
    // create term
    fireEvent.click(screen.getByRole('button', { name: /add term/i }))
    fireEvent.change(await screen.findByLabelText(/term/i), {
      target: { value: 'RemoveMe' },
    })
    fireEvent.change(screen.getByLabelText(/meaning/i), {
      target: { value: 'Temp' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))
    await waitFor(() => screen.getByText('RemoveMe'))
    // delete
    fireEvent.click(screen.getByLabelText(/delete removeme/i))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/glossary/RemoveMe',
        expect.any(Object)
      )
    )
  })
})
