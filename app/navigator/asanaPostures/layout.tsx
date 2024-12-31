import { auth } from '@auth'
import { Box } from '@node_modules/@mui/material'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

export default async function AsanaLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()
  return (
    <>
      <Box sx={{ height: '100%' }}>
        <SessionProvider basePath={'/api/auth'} session={session}>
          {children}
        </SessionProvider>
      </Box>
    </>
  )
}
