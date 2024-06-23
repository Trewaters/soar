'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/styles/theme'
import { CssBaseline } from '@mui/material'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline to kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
