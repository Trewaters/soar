'use client'
import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import LandingPage from '@components/landing-page'
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
          <Tab label="Start your practice" {...a11yProps(0)} />
          <Tab label="Learn about yoga" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <LandingPage />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EightLimbs />
      </CustomTabPanel>
    </Box>
  )
}
