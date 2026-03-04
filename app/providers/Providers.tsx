import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import ClientProviders from './ClientProviders'

export function Providers({
  children,
  session,
}: {
  children: ReactNode
  session: any
}) {
  return (
    <SessionProvider
      basePath={'/api/auth'}
      session={session}
      refetchInterval={0} // Disable automatic refetching (we'll trigger manually)
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false}
    >
      <ClientProviders>{children}</ClientProviders>
    </SessionProvider>
  )
}
