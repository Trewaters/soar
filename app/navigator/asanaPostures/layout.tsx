import { Paper, Stack } from '@mui/material'
import { ReactNode } from 'react'

export default function AsanaLayout({ children }: { children: ReactNode }) {
  return (
    <Paper>
      <Stack
        width={'100%'}
        // sx={{
        //   position: 'absolute',
        //   bottom: 0,
        //   marginTop: '16px',
        //   marginBottom: 4,
        // }}
      >
        {children}
      </Stack>
    </Paper>
  )
}
