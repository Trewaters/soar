import { auth } from '@auth'
import { Stack } from '@node_modules/@mui/material'
import NavBottom from '@serverComponents/navBottom'
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
      <SessionProvider basePath={'/api/auth'} session={session}>
        {children}
      </SessionProvider>
      <Stack sx={{ width: 'auto', position: 'absolute', bottom: 0 }}>
        <NavBottom subRoute="/navigator/asanaPostures" />
      </Stack>
    </>
  )
}
