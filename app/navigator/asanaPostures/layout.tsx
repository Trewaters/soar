import NavBottom from '@serverComponents/navBottom'
import React, { ReactNode } from 'react'

export default function AsanaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <nav>
        <NavBottom subRoute="/navigator/asanaPostures" />
      </nav>
    </>
  )
}
