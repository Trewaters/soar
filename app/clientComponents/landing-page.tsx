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
import EditNoteIcon from '@mui/icons-material/EditNote'
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined'
import AirOutlinedIcon from '@mui/icons-material/AirOutlined'
import LyricsIcon from '@mui/icons-material/Lyrics'
import Link from 'next/link'
import { Typography } from '@mui/material'

export default function LandingPage() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'lightgray',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <nav aria-label="main pages">
        <List sx={{ width: '100%' }}>
          {links.map((link, index) => (
            <React.Fragment key={link.name}>
              {index > 0 && <Divider />}
              <ListItem disablePadding>
                <Link href={link.href} passHref>
                  <ListItemButton
                    sx={{ justifyContent: 'flex-start', width: '100%' }}
                  >
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText>
                      <Typography variant="button">{link.name}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </nav>
    </Box>
  )
}

const links = [
  {
    name: 'Asana Postures',
    href: '/asanaPostures',
    icon: <WaterDropOutlinedIcon />,
  },
  /* 
  { name: 'Flow', href: '/flowSeries', icon: <WhatshotIcon /> },
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
