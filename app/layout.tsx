import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Providers } from '@providers/Providers'
import { auth } from '../auth'
import ServiceWorkerRegister from '@clientComponents/ServiceWorkerRegister'

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
        <Providers session={session}>
          {/* Handle wallet extension conflicts before loading analytics */}
          <Script
            id="wallet-conflict-handler"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  // Prevent wallet extensions from interfering with analytics
                  const originalDefineProperty = Object.defineProperty;
                  Object.defineProperty = function(obj, prop, descriptor) {
                    try {
                      return originalDefineProperty.call(this, obj, prop, descriptor);
                    } catch (error) {
                      if (error instanceof TypeError && error.message.includes('redefine')) {
                        console.warn('Wallet extension conflict detected for property:', prop);
                        return obj;
                      }
                      throw error;
                    }
                  };
                  
                  // Initialize dataLayer safely
                  window.dataLayer = window.dataLayer || [];
                } catch (error) {
                  console.warn('Wallet extension conflict handling failed:', error);
                }
              `,
            }}
          />

          {/* Google Analytics with Next.js Script component */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-BE8QV7LLJV"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BE8QV7LLJV');
            `}
          </Script>
          {children}
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  )
}
