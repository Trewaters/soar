import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import '@styles/globals.css'
import { AuthProvider } from '@app/context/AuthContext'

function SoarApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  )
}

export default SoarApp
