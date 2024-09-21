import Footer from '@serverComponents/footer'
import { Stack } from '@mui/material'
import Header from '@serverComponents/header'
import { ReactNode } from 'react'
import NavBottom from '@serverComponents/navBottom'

export default function NavigatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <Header />
      </nav>
      <section>{children}</section>
      <Stack sx={{ position: 'relative', bottom: 0, marginTop: '240px' }}>
        {/* <NavBottom /> */}
        <Footer />
      </Stack>
    </>
  )
}
