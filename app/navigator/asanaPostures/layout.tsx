import NavBottom from '@serverComponents/navBottom'
import { Stack } from '@mui/material'
import { ReactNode } from 'react'

export default function AsanaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <section>{children}</section>
      <Stack sx={{ position: 'relative', bottom: 0, marginTop: '16px' }}>
        <NavBottom />
      </Stack>
    </>
  )
}
