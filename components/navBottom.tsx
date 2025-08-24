'use client'
import React from 'react'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { useSession } from 'next-auth/react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ColorFunction = (isAuthenticated: boolean) => string

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string | (() => string) | 'menu'
  getColor: ColorFunction
}

export default function NavBottom(props: {
  subRoute: string
  onMenuToggle?: () => void
}) {
  const router = useNavigationWithLoading()
  const { data: session, status } = useSession()

  // Determine if user is authenticated
  const isAuthenticated = status === 'authenticated' && !!session

  const navItems: NavItem[] = [
    {
      id: 'menu',
      label: 'Open main navigation menu',
      icon: <MenuIcon />,
      path: 'menu',
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
      id: 'back',
      label: 'Navigate back to previous page',
      icon: <ArrowBackIcon aria-hidden="true" />,
      path: 'back',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getColor: (_isAuthenticated: boolean) => 'primary.contrastText', // Always primary.contrastText
    },
  ]

  const handleNavigation = (
    path: string | (() => string) | 'menu',
    itemId?: string
  ) => {
    // Handle menu toggle specially
    if (itemId === 'menu' || path === 'menu') {
      if (props.onMenuToggle) {
        props.onMenuToggle()
      }
      return
    }

    // Handle back navigation specially
    if (itemId === 'back' || path === 'back') {
      // Use the router.back() method with loading states
      router.back()
      return
    }

    // Handle regular navigation
    const targetPath = typeof path === 'function' ? path() : path
    router.push(targetPath)
  }

  return (
    <Box
      component="nav"
      aria-label="Bottom navigation"
      sx={{
        position: 'fixed',
        backgroundColor: 'info.contrastText',
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        top: 'auto !important',
        bottom: '0 !important',
        left: '0',
        right: 'auto',
        height: '66px',
        zIndex: (theme) => theme.zIndex.appBar,
        justifySelf: 'center',
      }}
    >
      {navItems.map((item) => (
        <IconButton
          key={item.id}
          disableRipple
          disableFocusRipple
          disableTouchRipple
          disabled={item.id === 'profile' && !isAuthenticated} // Disable profile when not authenticated
          aria-label={item.label}
          title={item.label}
          role="button"
          onClick={() => handleNavigation(item.path, item.id)}
          sx={{
            color: item.getColor(isAuthenticated),
            '&:focus': {
              outline: 'none', // Remove focus outline
            },
            '&:focus-visible': {
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
    </Box>
  )
}
