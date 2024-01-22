'use client'
import React, { useState } from 'react'
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import LandingPage from '@components/landing-page'
import MenuPlanner from '@components/MenuPlanner'
import FlowSeries from './flow-series'

export default function TabHeader() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        width: '100%',
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
            <Tab label="Flow Series" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <LandingPage />
        </TabPanel>
        <TabPanel value="2">
          <h2>Menu Planner</h2>
          <MenuPlanner />
        </TabPanel>
        <TabPanel value="3">
          <h2>Menu Planner</h2>
          <FlowSeries />
        </TabPanel>
      </TabContext>
    </Box>
  )
}
