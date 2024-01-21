import React, { ReactNode } from 'react'
import '@styles/globals.css'
import TopNav from './top-nav'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <TopNav />
          {children}
        </main>
      </body>
    </html>
  )
}
