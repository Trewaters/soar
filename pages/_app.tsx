// pages/_app.tsx

import React from 'react'
import { AuthProvider } from '@app/context/AuthContext'
import '../styles/globals.css'

interface MyAppProps {
  Component: React.ComponentType<any>
  // pageProps: React.ReactNode
  pageProps: Record<string, any>
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
