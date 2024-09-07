import TopNav from '@app/clientComponents/top-nav'
import { ReactNode } from 'react'

export default function NavigatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <TopNav />
      </nav>
      <section>{children}</section>
    </>
  )
}
