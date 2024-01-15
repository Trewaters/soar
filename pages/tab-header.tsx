'use client'
import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'

export default function tabHeader() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Box
      sx={{
        maxWidth: { xs: 320, sm: 480, md: '100%' },
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Asana Postures" />
        <Tab label="Flow Series" />
        <Tab label="Meditation" />
        <Tab label="Mantra" />
        <Tab label="Breathwork" />
      </Tabs>
    </Box>
  )
}
