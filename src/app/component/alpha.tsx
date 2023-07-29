import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DraftsIcon from '@mui/icons-material/Drafts';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';

export default function Alpha() {

    return (
        <>
        <h1>Soar App</h1>
            <p>Like a leaf on the wind</p>
            Time: {new Date().toLocaleTimeString()}
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'lightgray' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="Flow Series" />
            </ListItemButton>
          </ListItem>
      <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <WaterDropOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Asana Postures" />
            </ListItemButton>
          </ListItem>
      <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ChangeHistoryOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Meditation" />
            </ListItemButton>
          </ListItem>
      <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AirOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Mantra" />
            </ListItemButton>
          </ListItem>
      <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ConstructionOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Breathwork" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
        </>
    )
}