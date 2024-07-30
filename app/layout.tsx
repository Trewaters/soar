import '@styles/globals.css'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import TopNav from '@components/top-nav'
import Header from '@serverComponents/header'
import UserButton from '@serverComponents/user-button'
import { Box, Stack, Typography } from '@mui/material'
import { Providers } from './Providers'

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
          <Box
            sx={{
              minHeight: '100vh',
              height: '100vh',
              width: '95%',
              margin: 'auto',
            }}
          >
            <Stack>
              <Typography variant="h1" align="center">
                Soar
              </Typography>
            </Stack>
            <UserButton />
            <main>{children}</main>
          </Box>
        </Providers>
      </body>
    </html>
  )
}
