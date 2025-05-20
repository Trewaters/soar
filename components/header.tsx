'use client'
import React, { MouseEvent } from 'react'
import { useSession } from 'next-auth/react'
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
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    name: 'Sign In',
    href: '/auth/signin',
    icon: <AdminPanelSettingsIcon />,
  },
]

export default function Header() {
  const { data: session } = useSession()
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open)
  }
  // const router = useRouter()
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
      <nav aria-label="site navigation menu">
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
                      {/* {navItem.name === 'Sign In' ? ( */}
                      {session ? (
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
            aria-controls="main-navigation"
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
                alt="Soar Logo"
                width="150"
                height="20"
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
