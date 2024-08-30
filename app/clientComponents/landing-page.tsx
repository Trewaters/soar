import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import Link from 'next/link'
import { Button, Stack, Typography } from '@mui/material'

const links = [
  {
    name: 'Asana Postures',
    href: '/asanaPostures',
    icon: <WaterDropOutlinedIcon />,
  },
  { name: 'Flow', href: '/flowSeries', icon: <WhatshotIcon /> },
  /* 
  {
    name: 'Meditation',
    href: '/meditation',
    icon: <ChangeHistoryOutlinedIcon />,
  },
  { name: 'Mantra', href: '/mantra', icon: <AirOutlinedIcon /> },
  {
    name: 'Breathwork',
    href: '/breathwork',
    icon: <LyricsIcon />,
  },
  {
    name: 'Yoga Journal',
    href: '/yogaJournal',
    icon: <EditNoteIcon />,
  },
   */
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
                  <Typography variant="button">{link.name}</Typography>
                </Button>
              </Link>
            </React.Fragment>
          ))}
        </Stack>
      </nav>
    </Box>
  )
}
