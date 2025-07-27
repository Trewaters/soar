'use client'
import React, { MouseEvent, useMemo, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import FlareIcon from '@mui/icons-material/Flare'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import InfoIcon from '@mui/icons-material/Info'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import {
  AppBar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'

export default function Header() {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [isAuthLoading, setIsAuthLoading] = React.useState(false)
  const { data: session, status } = useSession()
  const router = useNavigationWithLoading()

  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open)
  }

  const handleAuthAction = useCallback(async () => {
    if (status === 'loading' || isAuthLoading) return // Don't allow action while loading

    setIsAuthLoading(true)
    try {
      if (session) {
        // User is logged in, perform logout
        await signOut({ redirectTo: '/' })
      } else {
        // User is not logged in, navigate to signin
        router.push('/auth/signin')
      }
    } catch (error) {
      console.error('Auth action failed:', error)
    } finally {
      setIsAuthLoading(false)
    }
  }, [session, status, isAuthLoading, router])

  // Helper function to get the auth button text
  const getAuthButtonText = () => {
    if (isAuthLoading) return 'Loading...'
    if (status === 'loading') return 'Loading...'
    return session ? 'Logout' : 'Login'
  }

  // Memoize the navLinks to prevent unnecessary re-renders
  const navLinks = useMemo(
    () => [
      {
        name: 'Home',
        href: '/',
        icon: <HomeIcon />,
        action: null,
      },
      {
        name: '8 Limbs',
        href: '/navigator/eightLimbs',
        icon: <FlareIcon />,
        action: null,
      },
      {
        name: 'Asanas',
        href: '/navigator/asanaPostures',
        icon: <WaterDropOutlinedIcon />,
        action: null,
      },
      {
        name: 'Flows',
        href: '/navigator/flows',
        icon: <WhatshotIcon />,
        action: null,
      },
      {
        name: 'About',
        href: '/navigator/about',
        icon: <InfoIcon />,
        action: null,
      },
      {
        name: 'Profile',
        href: '/navigator/profile',
        icon: <ManageAccountsIcon />,
        action: null,
      },
      {
        name: 'Glossary',
        href: '/navigator/glossary',
        icon: <MenuBookIcon />,
        action: null,
      },
      // final item will have a divider above it
      {
        name: 'auth-button', // Use a static identifier, text will be determined in render
        href: '#',
        icon: <AdminPanelSettingsIcon />,
        action: handleAuthAction,
      },
    ],
    [handleAuthAction]
  )

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <nav aria-label="main navigation menu">
        <List>
          {navLinks.map((navItem, index) => (
            <React.Fragment key={navItem.name}>
              {index === navLinks.length - 1 && <Divider />}
              <ListItem disablePadding>
                {navItem.action ? (
                  <ListItemButton
                    component="button"
                    sx={{ width: '250px' }}
                    onClick={async (e) => {
                      e.preventDefault()
                      setOpenDrawer(false)
                      await navItem.action()
                    }}
                  >
                    <ListItemIcon>{navItem.icon}</ListItemIcon>
                    <ListItemText>
                      <Typography variant="button">
                        {getAuthButtonText()}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                ) : (
                  <Link href={navItem.href} passHref legacyBehavior>
                    <ListItemButton
                      component="button"
                      sx={{ width: '250px' }}
                      onClick={() => {
                        setOpenDrawer(false)
                      }}
                    >
                      <ListItemIcon>{navItem.icon}</ListItemIcon>
                      <ListItemText>
                        <Typography variant="button">{navItem.name}</Typography>
                      </ListItemText>
                    </ListItemButton>
                  </Link>
                )}
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </nav>
    </Box>
  )

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setOpenDrawer(false)
  }

  return (
    <AppBar
      position="static"
      sx={{
        pr: 2,
        height: '69px',
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Stack direction="row" justifyContent={'space-between'}>
          <IconButton
            disableRipple
            onClick={toggleDrawer(true)}
            aria-label="Open main navigation"
            aria-controls={openDrawer ? 'main-navigation' : undefined}
            aria-expanded={openDrawer}
            component="button"
          >
            <MenuIcon sx={{ height: '2em', width: '2em' }} />
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Link href="/" passHref legacyBehavior>
              <Image
                src="/logo/Main Logo in Contrast Light150px.png"
                alt="Soar Yoga main logo"
                width={150}
                height={20}
                style={{ marginTop: '15%' }}
              />
            </Link>
          </Box>
        </Stack>
      </Box>
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <Paper onClick={handleClick} sx={{ height: '100%' }}>
          {DrawerList}
        </Paper>
      </Drawer>
    </AppBar>
  )
}
