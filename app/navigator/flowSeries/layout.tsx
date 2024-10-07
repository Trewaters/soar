import { auth } from '@auth'
import NavBottom from '@serverComponents/navBottom'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

// create a layout page for nextjs
export default function Layout({ children }: { children: ReactNode }) {
  // const { data: session } = useSession()
  // const session: Session | null = auth()
  const session: any = auth()
  return (
    <>
      <SessionProvider basePath={'/auth'} session={session}>
        {children}
      </SessionProvider>
      <NavBottom subRoute="/navigator/flowSeries" />
    </>
  )
}
