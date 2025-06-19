'use client'
import React, { AppBar, IconButton } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function NavBottom(props: { subRoute: string }) {
  const router = useRouter()
  return (
    <AppBar
      component="nav"
      aria-label="Bottom navigation"
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
        aria-label="Navigate to home page"
        onClick={() => {
          router.push('/')
        }}
        sx={{
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
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
        aria-label="Navigate to user profile"
        onClick={() => {
          router.push('/navigator/profile')
        }}
        sx={{
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
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
        aria-label="Open navigation menu"
        onClick={() => {
          router.push(props.subRoute)
        }}
        sx={{
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
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
