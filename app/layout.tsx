import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import Header from '@serverComponents/header'
import { Providers } from '@providers/Providers'
import { GoogleAnalytics } from '@next/third-parties/google'

declare global {
  namespace JSX {
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
          <Header />
          {/* add google analytics script below header */}
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
          <main>{children}</main>
        </Providers>
      </body>
      {/* <GoogleAnalytics gaId="G-BE8QV7LLJV" /> */}
    </html>
  )
}
