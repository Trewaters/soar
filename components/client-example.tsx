'use client'

import { useSession } from 'next-auth/react'
import SessionData from './session-data'

const UpdateForm = () => {
  const { data: session } = useSession()

  if (!session?.user) return null
  return <h2>!session?.user</h2>
}

export default function ClientExample() {
  const { data: session, status } = useSession()

  return (
    <div>
      <h1>Client Side Rendering</h1>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        <SessionData session={session} />
      )}
      <UpdateForm />
    </div>
  )
}
