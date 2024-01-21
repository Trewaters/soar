import { ComponentType } from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@styles/theme'
import RootLayout from '@/app/layout'
import { Metadata } from 'next'

// const metadata: Metadata = {
//   title: 'Happy Yoga',
//   description: 'Soar like a leaf on the wind!',
// }

function MyApp({
  Component,
  pageProps,
}: {
  Component: ComponentType
  pageProps: any
}) {
  return (
    <ThemeProvider theme={theme}>
      {/* <Head>
        <title>{String(metadata.title)}</title>
        <meta
          name="description"
          content={metadata.description || 'Soar like a leaf on the wind!'}
        />
      </Head> */}
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </ThemeProvider>
  )
}

export default MyApp
