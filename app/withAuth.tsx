// HOC/withAuth.tsx
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [session, loading] = useSession()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !session) {
        router.push('/api/auth/signin')
      }
    }, [loading, session, router])

    if (loading || !session) {
      return <p>Loading...</p>
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
