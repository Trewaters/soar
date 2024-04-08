import React from 'react'
import '@styles/globals.css'
import TopNav from '@app/components/top-nav'
import Providers from '@app/Providers'
import Head from 'next/head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>Happy Yoga</title>
        <meta name="description" content="Soar like a leaf on the wind!" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <body>
        <Providers>
          <nav>
            <TopNav />
          </nav>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
