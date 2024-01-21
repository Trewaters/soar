import React, { ReactNode } from 'react'
import '@styles/globals.css'
import TopNav from '@app/top-nav'
import { Metadata } from 'next'
import Providers from '@app/Providers'

const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>
            <TopNav />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
