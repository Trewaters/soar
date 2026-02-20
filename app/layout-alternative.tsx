// Alternative implementation using @next/third-parties GoogleAnalytics
import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from '@providers/Providers'
import { auth } from 'auth'

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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Uvuyoga',
  },
}

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zoom on form focus
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
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers session={session}>{children}</Providers>
        {/* Google Analytics using Next.js third-parties (handles conflicts automatically) */}
        <GoogleAnalytics gaId="G-BE8QV7LLJV" />
      </body>
    </html>
  )
}
