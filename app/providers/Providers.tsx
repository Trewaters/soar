'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import { CssBaseline } from '@mui/material'
import UserStateProvider from '@context/UserContext'
import FlowSeriesProvider from '@context/AsanaSeriesContext'
import AsanaPoseProvider from '@context/AsanaPoseContext'
import TimerProvider from '@context/timerContext'
import { NavigationLoadingProvider } from '@context/NavigationLoadingContext'
import GlobalNavigationOverlay from '@clientComponents/GlobalNavigationOverlay'
import { SessionProvider } from 'next-auth/react'
import hydrateApp from '@app/utils/offline/hydration'

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
          // For React 18+, axe-core/react auto-detects the renderer
          axe.default(React, undefined, 1000)
        })
        .catch((error) => {
          console.warn('Failed to load @axe-core/react:', error)
        })
    }
  }, [])

  useEffect(() => {
    // best-effort client-side hydration of persisted app state
    let mounted = true
    ;(async () => {
      try {
        const data = await hydrateApp()
        if (!mounted) return
        if (Object.keys(data).length) {
          setHydrationData(data)
          // For now also log the hydration payload. Individual providers
          // will consume this to seed their initial state.
          console.debug('[Providers] hydrated app state:', data)
        }
      } catch (err) {
        console.warn('[Providers] hydration failed', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const [hydrationData, setHydrationData] = useState<any>({})

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
            <UserStateProvider
              hydration={{ userState: hydrationData.userState }}
            >
              <TimerProvider>
                <FlowSeriesProvider
                  hydration={{ flowSeries: hydrationData.flowSeries }}
                >
                  <AsanaPoseProvider
                    hydration={{ asanaPose: hydrationData.asanaPose }}
                  >
                    {children}
                    <GlobalNavigationOverlay />
                  </AsanaPoseProvider>
                </FlowSeriesProvider>
              </TimerProvider>
            </UserStateProvider>
          </CssBaseline>
        </ThemeProvider>
      </NavigationLoadingProvider>
    </SessionProvider>
  )
}
