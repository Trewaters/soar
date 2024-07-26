'use client'
import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FlareIcon from '@mui/icons-material/Flare'
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

import Link from 'next/link'

const navLinks = [
  {
    name: 'Home',
    href: '/',
    icon: <HomeIcon />,
  },
  {
    name: '8 Limbs',
    href: '/eightLimbs',
    icon: <FlareIcon />,
  },
  {
    name: 'Asanas',
    href: '/asanaPostures',
    icon: <ChevronRightIcon />,
  },
  // {
  //   name: 'Profile',
  //   href: '/profile',
  //   icon: <ChevronRightIcon />,
  // },
  // final item will have a divider above it
  {
    name: 'Sign In',
    href: '/signIn',
    icon: <AccountCircleIcon />,
  },
]

export default function TopNav() {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open)
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <nav aria-label="quick menu">
        <List>
          {navLinks.map((navItem, index) => (
            <React.Fragment key={navItem.name}>
              {index === navLinks.length - 1 && <Divider />}
              <ListItem disablePadding>
                <Link href={navItem.href} passHref>
                  <ListItemButton
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
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </nav>
    </Box>
  )

  return (
    <>
      <IconButton disableRipple onClick={toggleDrawer(true)}>
        <ArrowForwardIcon />
      </IconButton>
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  )
}
