import React from 'react'
import Box from '@mui/material/Box'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import { Stack, Typography } from '@mui/material'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import NavigationButton from '@clientComponents/NavigationButton'

const links = [
  {
    name: 'Asanas',
    href: '/navigator/asanaPostures',
    icon: <WaterDropOutlinedIcon />,
  },
  {
    name: 'Flows',
    href: '/navigator/flows/practiceSeries',
    icon: <WhatshotIcon />,
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
                width: 'auto',
                maxWidth: '320px',
                minWidth: '120px',
                minHeight: '48px',
                borderRadius: '14px',
                boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.25)',
                textTransform: 'uppercase',
                padding: '12px 20px',
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
                  maxWidth: '200px', // Limit text width for better fit
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
