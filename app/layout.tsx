import React from 'react'
import '@styles/globals.css'
import TopNav from '@app/components/top-nav'
import Providers from '@app/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <Providers>
    //   <TopNav />
    //   <main>{children}</main>
    // </Providers>
    <html lang="en">
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
