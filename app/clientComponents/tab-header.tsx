'use client'
import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import LandingPage from '@components/landing-page'
import EightLimbs from '@app/navigator/eightLimbs/eight-limbs'
import UserDetails from '@app/navigator/profile/UserDetails'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function TabHeader() {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 360,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tab menu"
          scrollButtons="auto"
          centered
        >
          <Tab label="Landing" {...a11yProps(0)} />
          {/* <Tab label="Planner" {...a11yProps(1)} /> */}
          <Tab label="8 Limb Path" {...a11yProps(1)} />
          <Tab label="Profile" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <LandingPage />
      </CustomTabPanel>
      {/* 
      <CustomTabPanel value={value} index={1}>
        <PlannerMenu />
      </CustomTabPanel>
 */}
      <CustomTabPanel value={value} index={1}>
        <EightLimbs />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UserDetails />
      </CustomTabPanel>
    </Box>
  )
}
