'use client'
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

export const eightLimbsData = [
  {
    primary: 'Asana',
    secondary: 'Physical Postures',
    icon: <WaterDropOutlinedIcon />,
    onClick: (router: ReturnType<typeof useRouter>) =>
      router.push('/navigator/asanaPostures'),
    iconSx: { color: 'primary.main', pl: 3 },
    textSx: {
      color: 'primary.main',
      '& .MuiListItemText-secondary': { color: 'primary.main' },
    },
    button: true,
  },
  {
    primary: 'Niyama',
    secondary: 'Observances',
    icon: <FlagIcon />,
  },
  {
    primary: 'Yama',
    secondary: 'Moral Restraints',
    icon: <MediationIcon />,
  },
  {
    primary: 'Pranayama',
    secondary: 'Breath Control',
    icon: <AirIcon />,
  },
  {
    primary: 'Dharana',
    secondary: 'Concentration',
    icon: <AdjustIcon />,
  },
  {
    primary: 'Dhyana',
    secondary: 'Meditation',
    icon: <SpaIcon />,
  },
  {
    primary: 'Pratyahara',
    secondary: 'Withdrawal of the Senses',
  },
  {
    primary: 'Samadhi',
    secondary: 'Absorption',
    icon: <LensBlurIcon />,
  },
]

export default function EightLimbs() {
  const router = useRouter()
  return (
    <>
      <Typography variant="h2" id="eight-limbs-of-yoga">
        Eight Limbs
      </Typography>
      <List
        aria-labelledby="eight-limbs-of-yoga"
        data-testid={`eight-limbs-list`}
      >
        {eightLimbsData.map((item, idx) => (
          <ListItem key={item.primary} data-testid={`eight-limbs-item-${idx}`}>
            {item.button ? (
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
                onClick={() => item.onClick && item.onClick(router)}
              >
                <ListItemText
                  sx={item.textSx}
                  primary={item.primary}
                  secondary={item.secondary}
                />
                {item.icon && (
                  <ListItemIcon sx={item.iconSx}>{item.icon}</ListItemIcon>
                )}
              </ListItemButton>
            ) : (
              <>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                />
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              </>
            )}
          </ListItem>
        ))}
      </List>
    </>
  )
}
