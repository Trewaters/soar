import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import Header from '@serverComponents/header'
import { Providers } from '@providers/Providers'
import Footer from '@serverComponents/footer'
import { Grid, Stack } from '@mui/material'
import { Box } from '@mui/system'

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace JSX {
    // eslint-disable-next-line no-unused-vars
    interface IntrinsicElements {
      'gmp-map': any
      'gmp-advanced-marker': any
    }
  }
}

export const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* add google analytics script below header */}
          {/* eslint-disable-next-line @next/next/next-script-for-ga */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-BE8QV7LLJV"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BE8QV7LLJV');
          `,
            }}
          />
          {/* <GoogleAnalytics gaId="G-BE8QV7LLJV" /> */}
          <main>{children}</main>
          <Stack sx={{ position: 'relative', bottom: 0, marginTop: '240px' }}>
            <Footer />
          </Stack>
        </Providers>
      </body>
    </html>
  )
}
