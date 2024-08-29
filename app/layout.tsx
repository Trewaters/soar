import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import TopNav from '@components/top-nav'
import Header from '@serverComponents/header'
import { Typography } from '@mui/material'
import { Providers } from '@providers/Providers'

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
          <nav>
            <TopNav />
          </nav>
          <Typography variant="h1" align="center">
            Soar
          </Typography>
          {/* <UserButton /> */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
