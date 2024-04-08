import { List, ListItem, ListItemText, Typography } from '@mui/material'

export default function EightLimbs() {
  return (
    <>
      <Typography variant="h1">Eight Limbs</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Yama" secondary="Moral Restraints" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Niyama" secondary="Observances" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Asana" secondary="Physical Postures" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Pranayama" secondary="Breath Control" />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Pratyahara"
            secondary="Withdrawal of the Senses"
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Dharana" secondary="Concentration" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Dhyana" secondary="Meditation" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Samadhi" secondary="Absorption" />
        </ListItem>
      </List>
    </>
  )
}
