'use client'
import React, { AppBar, IconButton } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function NavBottom(props: { subRoute: string }) {
  const router = useRouter()
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'info.contrastText',
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        width: { sm: '100vw', md: '40vw' },
        flexDirection: 'row',
        justifyContent: 'space-between',
        px: 2,
        bottom: 0,
        position: 'fixed',
        left: { sm: '0', md: '30vw' },
        height: '66px',
        justifySelf: 'center',
      }}
    >
      <IconButton
        disableRipple
        onClick={() => {
          router.push('/')
        }}
      >
        <Image
          alt="Home icon"
          src="/icons/bottom-home.svg"
          width={20}
          height={20}
        />
      </IconButton>
      <IconButton
        disableRipple
        onClick={() => {
          router.push('/navigator/profile')
        }}
      >
        <Image
          alt="User profile icon"
          src="/icons/bottom-user.svg"
          width={20}
          height={20}
        />
      </IconButton>
      <IconButton
        disableRipple
        onClick={() => {
          router.push(props.subRoute)
        }}
      >
        <Image
          alt="Bottom burger menu icon"
          src="/icons/bottom-burger-menu.svg"
          width={20}
          height={20}
        />
      </IconButton>
    </AppBar>
  )
}
