import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Providers } from '@providers/Providers'
import { auth } from '../auth'

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
  title: 'Uvuyoga',
  description: 'Soar like a leaf on the wind!',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Uvuyoga',
  },
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers session={session}>
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
          {children}
        </Providers>
      </body>
    </html>
  )
}
