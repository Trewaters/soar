import Header from '@serverComponents/header'
import { ReactNode } from 'react'

export default function NavigatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <Header />
      </header>
      <main id="main-content" role="main">
        {children}
      </main>
    </>
  )
}
