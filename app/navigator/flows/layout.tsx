import { auth } from '@auth'
import NavBottom from '@serverComponents/navBottom'
import { getSession, SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

// create a layout page for nextjs
export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession()
  return (
    <>
      <SessionProvider basePath={'/api/auth'} session={session}>
        {children}
      </SessionProvider>
      <NavBottom subRoute="/navigator/flows" />
    </>
  )
}
