import '@styles/globals.css'
import type { Metadata } from 'next'
import TopNav from '@components/top-nav'
import Header from '@serverComponents/header'
import { PropsWithChildren } from 'react'
import UserButton from '@serverComponents/user-button'
import { Box, Stack, Typography } from '@mui/material'

export const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  )
}
