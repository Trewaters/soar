import React from 'react'
// import { AuthProvider } from '@app/context/AuthContext'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      {/* <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider> */}
    </SessionProvider>
  )
}
