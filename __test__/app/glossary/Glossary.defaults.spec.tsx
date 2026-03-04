import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Glossary from '../../../app/glossary/Glossary'
import { GlossaryProvider } from '../../../app/glossary/GlossaryContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../../../styles/theme'

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

describe('Glossary (default terms)', () => {
  it('renders heading', () => {
    render(<Glossary />, { wrapper: Wrapper })
    expect(
      screen.getByRole('heading', { name: /yoga glossary/i })
    ).toBeInTheDocument()
  })

  it('renders at least one default term card', () => {
    render(<Glossary />, { wrapper: Wrapper })
    const defaultBadges = screen.getAllByLabelText(/default glossary term/i)
    expect(defaultBadges.length).toBeGreaterThan(0)
  })

  it('renders sanskrit + pronunciation where available', () => {
    render(<Glossary />, { wrapper: Wrapper })
    expect(screen.getByText(/āsana/i)).toBeInTheDocument()
  })
})
