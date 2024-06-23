// import type { ReactNode } from 'react'
import '@styles/globals.css'
import type { Metadata } from 'next'
// import TopNav from '@components/top-nav'
// import Providers from '@app/Providers'
// import { AuthProvider } from './context/AuthContext'
// import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import Header from '@serverComponents/header'
import { PropsWithChildren } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

/* 
Tips

https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-3-migrating-nexthead
*/

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {/* <Providers>
          <nav>
            <TopNav />
          </nav>
          <SessionProvider>
            <AuthProvider>
            <main>{children}</main>
            </AuthProvider>
            </SessionProvider>
            </Providers> */}
        <main>{children}</main>
      </body>
    </html>
  )
}
