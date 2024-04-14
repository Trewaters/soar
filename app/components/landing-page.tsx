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
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined'
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined'
import AirOutlinedIcon from '@mui/icons-material/AirOutlined'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'lightgray' }}>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem disablePadding>
              <Link href="/flowSeries" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <WhatshotIcon />
                  </ListItemIcon>
                  <ListItemText primary="Flow" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <Link href="/asanaPostures" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <WaterDropOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Asana Postures" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <Link href="/meditation" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <ChangeHistoryOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Meditation" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <Link href="/mantra" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <AirOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mantra" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <Link href="/breathwork" passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <ConstructionOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Breathwork" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </nav>
      </Box>
    </>
  )
}
