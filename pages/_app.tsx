import { ComponentType } from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import RootLayout from '@/app/layout'

export const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

function MyApp({
  Component,
  pageProps,
}: {
  Component: ComponentType
  pageProps: any
}) {
  return (
    <ThemeProvider theme={theme}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </ThemeProvider>
  )
}

export default MyApp
