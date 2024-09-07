import { auth } from '@auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

// create a layout page for nextjs
export default function Layout({ children }: { children: ReactNode }) {
  // const { data: session } = useSession()
  // const session: Session | null = auth()
  const session: any = auth()
  return (
    <SessionProvider basePath={'/auth'} session={session}>
      {children}
    </SessionProvider>
  )
}

/* 
import { auth } from '@auth'
import { SessionProvider, useSession } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import { Session } from 'next-auth'

// create a layout page for nextjs
export default function Layout({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    async function getSession() {
      const sessionData = await auth()
      if (sessionData && !sessionData.expires) {
        // Add an expires field if it's missing
        sessionData.expires = new Date(
          Date.now() + 24 * 60 * 60 * 1000 // Example: 24 hours from now
        ).toISOString()
      }
      setSession(sessionData)
    }

    getSession()
  }, [])

  // if (!session) {
  //   // Optionally render a loading state while waiting for session data
  //   return <div>Loading...</div>
  // }

  return (
    <SessionProvider basePath={'/auth'} session={session}>
      {children}
    </SessionProvider>
  )
}
 */
