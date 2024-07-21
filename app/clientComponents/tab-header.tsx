'use client'
import React, { useState } from 'react'
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import PlannerMenu from '@app/planner/page'
import LandingPage from '@components/landing-page'
import EightLimbs from './eight-limbs'
import UserDetails from '@app/userManagement/UserDetails'

export default function TabHeader() {
  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        // Enables Flexbox
        display: 'flex',
        // Stack children vertically
        flexDirection: 'column',
        // Center content vertically
        justifyContent: 'center',
        // Center content horizontally
        alignItems: 'center',
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            maxWidth: { xs: 320, sm: 480, md: '100%' },
            bgcolor: 'background.paper',
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="menu of tabs"
            scrollButtons="auto"
            variant="scrollable"
          >
            <Tab label="Landing" value="1" />
            <Tab label="Planner" value="2" />
            <Tab label="8 Limb Path" value="3" />
            <Tab label="Users" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <LandingPage />
        </TabPanel>
        <TabPanel value="2">
          <PlannerMenu />
        </TabPanel>
        <TabPanel value="3">
          <EightLimbs />
        </TabPanel>
        <TabPanel value="4">
          <UserDetails />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

/* 
// 'use client'
import React, { useState, Suspense, lazy } from 'react'
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// Lazy load child components
const PlannerMenu = lazy(() => import('@app/planner/page'))
const LandingPage = lazy(() => import('@components/landing-page'))
const EightLimbs = lazy(() => import('./eight-limbs'))
const UserDetails = lazy(() => import('@app/userManagement/UserDetails'))

export default function TabHeader() {
  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            maxWidth: { xs: 320, sm: 480, md: '100%' },
            bgcolor: 'background.paper',
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="menu of tabs"
            scrollButtons="auto"
            variant="scrollable"
          >
            <Tab label="Landing" value="1" />
            <Tab label="Planner" value="2" />
            <Tab label="8 Limb Path" value="3" />
            <Tab label="Users" value="4" />
          </TabList>
        </Box>
        <Suspense fallback={<div>Loading...</div>}>
          <TabPanel value="1">
            <LandingPage />
          </TabPanel>
          <TabPanel value="2">
            <PlannerMenu />
          </TabPanel>
          <TabPanel value="3">
            <EightLimbs />
          </TabPanel>
          <TabPanel value="4">
            <UserDetails />
          </TabPanel>
        </Suspense>
      </TabContext>
    </Box>
  )
}
 */
/* 
import { useState } from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import { useSession, signIn, signOut } from 'next-auth/react'
import PlannerMenu from '@app/planner/page'
import LandingPage from '@components/landing-page'
import EightLimbs from './eight-limbs'
import UserDetails from '@app/userManagement/UserDetails'

function TabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

export default function TabsMenu() {
  const { data: session } = useSession()
  const [value, setValue] = useState(0)

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  if (!session) {
    return (
      <div>
        <h2>Please sign in to view the content</h2>
        <button onClick={() => signIn()}>(new) Sign In</button>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="tabs example">
        <Tab label="Buttons" {...a11yProps(0)} />
        <Tab label="Postures" {...a11yProps(1)} />
        <Tab label="User Data" {...a11yProps(2)} />
        <Tab label="User Data" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <LandingPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PlannerMenu />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EightLimbs />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserDetails />
      </TabPanel>
    </div>
  )
}

function ButtonsComponent() {
  return <div>Buttons</div>
}

function PosturesComponent() {
  return <div>Postures</div>
}

function UserDataComponent() {
  return <div>User Data</div>
}
 */
