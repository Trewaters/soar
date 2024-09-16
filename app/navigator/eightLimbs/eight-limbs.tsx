'use client'
// import { WaterDropOutlined } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import AirIcon from '@mui/icons-material/Air'
import AdjustIcon from '@mui/icons-material/Adjust'
import LensBlurIcon from '@mui/icons-material/LensBlur'
import MediationIcon from '@mui/icons-material/Mediation'
import FlagIcon from '@mui/icons-material/Flag'
import SpaIcon from '@mui/icons-material/Spa'
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied'

export default function EightLimbs() {
  const router = useRouter()
  return (
    <>
      <Typography variant="h2">Eight Limbs</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Niyama" secondary="Observances" />
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemText primary="Yama" secondary="Moral Restraints" />
          <ListItemIcon>
            <MediationIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemText primary="Pranayama" secondary="Breath Control" />
          <ListItemIcon>
            <AirIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemText primary="Dharana" secondary="Concentration" />
          <ListItemIcon>
            <AdjustIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemButton
            sx={{
              cursor: 'pointer',
              pl: 0,
              py: 0,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'none',
              },
            }}
            onClick={() => {
              router.push('/navigator/asanaPostures')
            }}
          >
            <ListItemText primary="Asana" secondary="Physical Postures" />
            <ListItemIcon sx={{ pl: 3 }}>
              <WaterDropOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemText primary="Dhyana" secondary="Meditation" />
          <ListItemIcon>
            <SpaIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Pratyahara"
            secondary="Withdrawal of the Senses"
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Samadhi" secondary="Absorption" />
          <ListItemIcon>
            <LensBlurIcon />
          </ListItemIcon>
        </ListItem>
      </List>
    </>
  )
}
