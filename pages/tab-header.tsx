'use client'
import React, { useState } from 'react'
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import PlannerMenu from '@/pages/planner-menu'
import FlowSeries from './flow-series'
import LandingPage from './landing-page'

export default function TabHeader() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
            <Tab label="Flow Series" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <LandingPage />
        </TabPanel>
        <TabPanel value="2">
          <PlannerMenu />
        </TabPanel>
        <TabPanel value="3">
          <FlowSeries />
        </TabPanel>
      </TabContext>
    </Box>
  )
}
