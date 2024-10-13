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
import {
  AppBar,
  Button,
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
import { useRouter } from 'next/navigation'

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
    name: 'Profile',
    href: '/navigator/profile',
    icon: <ManageAccountsIcon />,
  },
  // final item will have a divider above it
  {
    name: 'Sign In',
    href: '/userManagement/signIn',
    icon: <AdminPanelSettingsIcon />,
  },
]

export default function Header() {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open)
  }
  const router = useRouter()
  // const session = auth()

  // useEffect(() => {
  //   // get session
  //   async function checkSession() {
  //     const session = await auth()
  //   }
  //   checkSession()
  // }, [])

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
                      {navItem.name === 'Sign In' ? (
                        /* ! TO DO:
                         * access session to get session status and flip text based on that.
                         * Add the Sign in button here outside the list.
                         * I want to have text ("Login/Logout") change based on the session status.
                         */
                        // { session === null ? (
                        // <Typography variant="button">Login</Typography>
                        // ):(
                        //   <Typography variant="button">Logout</Typography>
                        // )}
                        <Typography variant="button">Login/Logout</Typography>
                      ) : (
                        <Typography variant="button">{navItem.name}</Typography>
                      )}
                      {/* <Typography variant="button">{navItem.name}</Typography> */}
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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setOpenDrawer(false)
  }

  return (
    <AppBar
      position="static"
      sx={{
        // marginBottom: 4,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
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
          <IconButton disableRipple onClick={toggleDrawer(true)}>
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
              <Button
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.push('/')
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    pt: 3,
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    '& :hover:': { textDecoration: 'none' },
                  }}
                >
                  Soar
                </Typography>
              </Button>
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
