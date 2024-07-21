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
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        aria-label="menu of tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Landing" value="1" />
        <Tab label="Planner" value="2" />
        <Tab label="8 Limb Path" value="3" />
        <Tab label="Users" value="4" />
      </TabList>
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
  )
}
