import React from 'react'
import Box from '@mui/material/Box'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import Link from 'next/link'
import { Button, Stack, Typography } from '@mui/material'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'

const links = [
  {
    name: 'Asanas',
    href: '/navigator/asanaPostures',
    icon: <WaterDropOutlinedIcon />,
  },
  { name: 'Flows', href: '/navigator/flows', icon: <WhatshotIcon /> },
]

export default function LandingPage() {
  return (
    <Box>
      <nav aria-label="main menu">
        <Stack direction="column" spacing={2}>
          {links.map((link) => (
            <React.Fragment key={link.name}>
              <Link href={link.href} passHref>
                <Button
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  startIcon={link.icon}
                >
                  <Typography variant="body1">{link.name}</Typography>
                </Button>
              </Link>
            </React.Fragment>
          ))}
        </Stack>
      </nav>
    </Box>
  )
}
