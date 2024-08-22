'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/styles/theme'
import { CssBaseline } from '@mui/material'
import UserStateProvider from '@context/UserContext'
import FlowSeriesProvider from '@context/AsanaSeriesContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline to kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline>
        <UserStateProvider>
          <FlowSeriesProvider>{children}</FlowSeriesProvider>
        </UserStateProvider>
      </CssBaseline>
    </ThemeProvider>
  )
}
