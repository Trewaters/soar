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
import Link from '@mui/material/Link/Link';

export default function LandingPage() {

  return (
    <>
      <div className={"text-center bg-slate-400"}>
        <h1>
          Soar like a leaf on the wind
        </h1>
        <p> Time: {new Date().toLocaleTimeString()}</p>
      </div>
      <Box sx={{ bgcolor: 'white' }}>
        <nav aria-label="category list">
          <List>
            <ListItem disablePadding>

              <ListItemButton component={Link} href="/flowSeries" role="button">
                <ListItemIcon>
                  <WhatshotIcon />
                </ListItemIcon>
                <ListItemText primary="Flow Series" />
              </ListItemButton>

            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/asanaPostures" role="button">
                <ListItemIcon>
                  <WaterDropOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Asana Postures" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>

              <ListItemButton component="a">
                <ListItemIcon>
                  <ChangeHistoryOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Meditation" />
              </ListItemButton>

            </ListItem>
            <Divider />
            <ListItem disablePadding>

              <ListItemButton component="a">
                <ListItemIcon>
                  <AirOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Mantra" />
              </ListItemButton>

            </ListItem>
            <Divider />
            <ListItem disablePadding>

              <ListItemButton component="a">
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