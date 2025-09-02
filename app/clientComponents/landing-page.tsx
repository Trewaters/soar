import React from 'react'
import Box from '@mui/material/Box'
import { Stack, Typography } from '@mui/material'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import NavigationButton from '@clientComponents/NavigationButton'
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined'
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import WorkspacesIcon from '@mui/icons-material/Workspaces'

const links = [
  {
    name: 'Asanas',
    href: '/navigator/asanaPostures',
    // icon: <WaterDropOutlinedIcon />,
    icon: <Brightness1OutlinedIcon />,
  },
  {
    name: 'Series',
    href: '/navigator/flows/practiceSeries',
    // icon: <TimelapseOutlinedIcon />,
    icon: <WorkspacesIcon />,
  },
  {
    name: 'Sequences',
    href: '/navigator/flows/practiceSequences',
    // icon: <Brightness1OutlinedIcon />,
    // icon: <BubbleChartIcon />,
    icon: <GroupWorkIcon />,
  },
]

export default function LandingPage() {
  return (
    <Box component="section" aria-labelledby="practice-section-title">
      <nav aria-label="Practice navigation">
        <Stack direction="column" spacing={2} sx={{ alignItems: 'center' }}>
          {links.map((link) => (
            <NavigationButton
              key={link.name}
              href={link.href}
              variant="outlined"
              aria-label={`Navigate to ${link.name} section`}
              sx={{
                width: 150, // Fixed width to ensure all buttons are same size
                maxWidth: 320,
                minWidth: 120,
                minHeight: 48,
                borderRadius: '14px',
                boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.25)',
                textTransform: 'uppercase',
                py: 4, // 32px (valid index)
                px: 4, // 32px (valid index)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
                flexWrap: 'nowrap',
                '&:hover': {
                  backgroundColor: 'transparent',
                  transform: 'translateY(-1px)',
                  boxShadow: '0px 6px 8px -1px rgba(0, 0, 0, 0.25)',
                },
                '&:focus': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              }}
              startIcon={link.icon || undefined}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{
                  fontWeight: 'medium',
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  flex: '1 1 auto',
                  textAlign: 'left',
                  wordWrap: 'break-word',
                  hyphens: 'auto',
                  minWidth: 0,
                  maxWidth: 200, // Limit text width for better fit
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.name}
              </Typography>
            </NavigationButton>
          ))}
        </Stack>
      </nav>
    </Box>
  )
}
