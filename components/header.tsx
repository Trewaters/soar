'use client'
import React from 'react'
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
import { useSession } from 'next-auth/react'

export default function Header() {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { data: session } = useSession()

  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open)
  }

  // Update the navLinks to use dynamic auth link
  const navLinks = [
    {
      name: 'Home',
      href: '/',
      icon: <HomeIcon />,
    },
    {
      name: '8 Limbs',
      href: '/navigator/eightLimbs',
      icon: <FlareIcon />,
    },
    {
      name: 'Asanas',
      href: '/navigator/asanaPostures',
      icon: <WaterDropOutlinedIcon />,
    },
    {
      name: 'Flows',
      href: '/navigator/flows',
      icon: <WhatshotIcon />,
    },
    {
      name: 'About',
      href: '/navigator/about',
      icon: <InfoIcon />,
    },
    {
      name: 'Profile',
      href: '/navigator/profile',
      icon: <ManageAccountsIcon />,
    },
    {
      name: 'Glossary',
      href: '/navigator/glossary',
      icon: <MenuBookIcon />,
    },
    // final item will have a divider above it
    {
      name: session ? 'Logout' : 'Login',
      href: session ? '/auth/signout' : '/auth/signin',
      icon: <AdminPanelSettingsIcon />,
    },
  ]

  const DrawerList = (
    <nav aria-label="main navigation menu">
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
      >
        <List>
          {navLinks.map((navItem, index) => (
            <React.Fragment key={navItem.name}>
              {index === navLinks.length - 1 && <Divider />}
              <ListItem disablePadding>
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
                      {navItem.name === 'Logout' || navItem.name === 'Login' ? (
                        <Typography variant="button">
                          {session ? 'Logout' : 'Login'}
                        </Typography>
                      ) : (
                        <Typography variant="button">{navItem.name}</Typography>
                      )}
                    </ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </nav>
  )

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
            aria-controls="main-navigation"
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
