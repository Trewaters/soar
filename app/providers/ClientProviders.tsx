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
import hydrateApp from '@app/utils/offline/hydration'

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [hydrationData, setHydrationData] = useState<any>({})

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
        }
      } catch (err) {
        console.warn('[ClientProviders] hydration failed', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <NavigationLoadingProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaseline to kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline>
          <UserStateProvider hydration={{ userState: hydrationData.userState }}>
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
  )
}
