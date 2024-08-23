import { LayoutProps } from '@.next/types/app/layout'
import { auth } from '@auth'
import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode } from 'react'

// create a layout page for nextjs
export default function Layout({ children }: { children: ReactNode }) {
  // const { data: session } = useSession()
  const session = auth()
  return (
    <SessionProvider basePath={'/auth'} session={session}>
      {children}
    </SessionProvider>
  )
}
