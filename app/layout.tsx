import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Providers } from '@providers/Providers'

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
      </head>
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
        </Providers>
      </body>
    </html>
  )
}
