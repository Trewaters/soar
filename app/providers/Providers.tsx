'use client'

import React, { ReactNode, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { CssBaseline } from '@mui/material'
import UserStateProvider from '@context/UserContext'
import FlowSeriesProvider from '@context/AsanaSeriesContext'
import AsanaPostureProvider from '@context/AsanaPostureContext'
import TimerProvider from '@context/timerContext'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import GlobalNavigationOverlay from '@clientComponents/GlobalNavigationOverlay'
import { SessionProvider } from 'next-auth/react'
import ReactDOM from 'react-dom'

export function Providers({
  children,
  session,
}: {
  children: ReactNode
  session: any
}) {
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
    <SessionProvider
      basePath={'/api/auth'}
      session={session}
      refetchInterval={0} // Disable automatic refetching (we'll trigger manually)
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false}
    >
      <NavigationLoadingProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline to kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline>
            <UserStateProvider>
              <TimerProvider>
                <FlowSeriesProvider>
                  <AsanaPostureProvider>
                    {children}
                    <GlobalNavigationOverlay />
                  </AsanaPostureProvider>
                </FlowSeriesProvider>
              </TimerProvider>
            </UserStateProvider>
          </CssBaseline>
        </ThemeProvider>
      </NavigationLoadingProvider>
    </SessionProvider>
  )
}
