import '@styles/globals.css'
import type { Metadata } from 'next'
import TopNav from '@components/top-nav'
import Header from '@serverComponents/header'
import { PropsWithChildren } from 'react'
import UserButton from '@serverComponents/user-button'
// import NextAuthProvider from './context/NextAuthProvider'

export const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        {/* <NextAuthProvider> */}
        <Header />
        <nav>
          <TopNav />
        </nav>
        <UserButton />
        <main>{children}</main>
        {/* </NextAuthProvider> */}
      </body>
    </html>
  )
}
