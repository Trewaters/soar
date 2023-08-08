import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import Link from 'next/link';

export default function LandingPage() {

  return (
    <>
      <div className={"text-center bg-slate-400"}>
        <h1>
        Soar like a leaf on the wind
        </h1>
        <p> Time: {new Date().toLocaleTimeString()}</p>
      </div>
      <Box sx={{  bgcolor: 'white' }}>
        <nav aria-label="category list">
        <List>
            <ListItem disablePadding>
              <Link href="/" passHref>
                <ListItemButton component="a">
                  <ListItemIcon>
                    <WhatshotIcon />
                  </ListItemIcon>
                  <ListItemText primary="Flow Series" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <Link href="/asanaPostures" passHref>
                <ListItemButton component="a">
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
                <ListItemButton component="a">
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
                <ListItemButton component="a">
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
                <ListItemButton component="a">
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