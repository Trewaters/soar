'use client'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function EightLimbs() {
  const router = useRouter()
  return (
    <>
      <Typography variant="h2">Eight Limbs</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Niyama" secondary="Observances" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Yama" secondary="Moral Restraints" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Pranayama" secondary="Breath Control" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Dharana" secondary="Concentration" />
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
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemText primary="Dhyana" secondary="Meditation" />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Pratyahara"
            secondary="Withdrawal of the Senses"
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Samadhi" secondary="Absorption" />
        </ListItem>
      </List>
    </>
  )
}
