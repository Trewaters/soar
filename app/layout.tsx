import React, { ReactNode } from 'react'
import '@styles/globals.css'
import TopNav from '@app/top-nav'
// import { Metadata } from 'next'

// const metadata: Metadata = {
//   title: 'Happy Yoga',
//   description: 'Soar like a leaf on the wind!',
// }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // <html lang="en">
    //   <body>
    //     <main>
    //       <TopNav />
    //       {children}
    //     </main>
    //   </body>
    // </html>
    <main>
      <TopNav />
      {children}
    </main>
  )
}
