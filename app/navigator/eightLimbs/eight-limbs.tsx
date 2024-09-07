import { List, ListItem, ListItemText, Typography } from '@mui/material'
import Link from 'next/link'

export default function EightLimbs() {
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
          <Link href="/navigator/asanaPostures" passHref legacyBehavior>
            <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary="Asana" secondary="Physical Postures" />
            </a>
          </Link>
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
