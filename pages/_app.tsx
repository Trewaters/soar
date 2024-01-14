import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType
  pageProps: any
}) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
