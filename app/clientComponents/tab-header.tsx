'use client'
import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import LandingPage from '@clientComponents/landing-page'
import EightLimbs from '@app/navigator/eightLimbs/eight-limbs'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
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
      data-testid="tab-header"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Tab menu group for navigating yoga content"
        scrollButtons="auto"
        centered
        sx={{
          minHeight: 48,
          height: 48,
          '.MuiTabs-indicator': { height: 3 },
        }}
      >
        <Tab
          label="Start your practice"
          aria-label="Start your practice tab"
          {...a11yProps(0)}
          sx={{ minHeight: 48, height: 48 }}
        />
        <Tab
          label="Learn about yoga"
          aria-label="Learn about yoga tab"
          {...a11yProps(1)}
          sx={{ minHeight: 48, height: 48 }}
        />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <LandingPage />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EightLimbs />
      </CustomTabPanel>
    </Box>
  )
}
