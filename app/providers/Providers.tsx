'use client'

import React, { ReactNode, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { CssBaseline } from '@mui/material'
import UserStateProvider from '@context/UserContext'
import FlowSeriesProvider from '@context/AsanaSeriesContext'
import AsanaPostureProvider from '@context/AsanaPostureContext'
import { SessionProvider } from 'next-auth/react'
import ReactDOM from 'react-dom'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize axe-core/react for development accessibility checking
    if (process.env.NODE_ENV === 'development') {
      import('@axe-core/react')
        .then((axe) => {
          axe.default(React, ReactDOM, 1000)
        })
        .catch((error) => {
          console.warn('Failed to load @axe-core/react:', error)
        })
    }
  }, [])

  return (
    <SessionProvider basePath={'/api/auth'}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline to kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline>
          <UserStateProvider>
            <FlowSeriesProvider>
              <AsanaPostureProvider>{children}</AsanaPostureProvider>
            </FlowSeriesProvider>
          </UserStateProvider>
        </CssBaseline>
      </ThemeProvider>
    </SessionProvider>
  )
}
