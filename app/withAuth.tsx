// HOC/withAuth.tsx
import { useAuth } from '../context/AuthContext'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [session, loading] = useSession()
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !session) {
        router.push('/api/auth/signin')
      }
      if (!user) {
        router.push('/login')
      }
    }, [loading, session, router, user])

    if (loading || !session) {
      return <p>Loading...</p>
    }
    if (!user) {
      return <p>Loading...</p>
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
