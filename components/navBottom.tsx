'use client'
import React from 'react'
import { AppBar, IconButton } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { useSession } from 'next-auth/react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ColorFunction = (isAuthenticated: boolean) => string

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string | (() => string)
  getColor: ColorFunction
}

export default function NavBottom(props: { subRoute: string }) {
  const router = useNavigationWithLoading()
  const { data: session, status } = useSession()

  // Determine if user is authenticated
  const isAuthenticated = status === 'authenticated' && !!session

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Navigate to home page',
      icon: <HomeIcon />,
      path: '/',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getColor: (_isAuthenticated: boolean) => 'primary.main', // Always primary.main
    },
    {
      id: 'profile',
      label: 'Navigate to user profile',
      icon: <PersonIcon />,
      path: '/navigator/profile',
      getColor: (isAuthenticated: boolean) =>
        isAuthenticated ? 'success.main' : 'grey.500', // Green when logged in, gray when logged out
    },
    {
      id: 'menu',
      label: 'Open navigation menu',
      icon: <MenuIcon />,
      path: () => props.subRoute,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getColor: (_isAuthenticated: boolean) => 'primary.contrastText', // Always primary.contrastText
    },
  ]

  const handleNavigation = (path: string | (() => string)) => {
    const targetPath = typeof path === 'function' ? path() : path
    router.push(targetPath)
  }

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
      {navItems.map((item) => (
        <IconButton
          key={item.id}
          disableRipple
          disabled={item.id === 'profile' && !isAuthenticated} // Disable profile when not authenticated
          aria-label={item.label}
          onClick={() => handleNavigation(item.path)}
          sx={{
            color: item.getColor(isAuthenticated),
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
            '&.Mui-disabled': {
              color: item.getColor(isAuthenticated), // Use dynamic color even when disabled
            },
          }}
        >
          {React.cloneElement(item.icon as React.ReactElement, {
            sx: { color: item.getColor(isAuthenticated) },
          })}
        </IconButton>
      ))}
    </AppBar>
  )
}
