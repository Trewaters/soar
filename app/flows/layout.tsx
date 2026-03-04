import { auth } from 'auth'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth()
  return (
    <SessionProvider basePath={'/api/auth'} session={session}>
      {children}
    </SessionProvider>
  )
}
