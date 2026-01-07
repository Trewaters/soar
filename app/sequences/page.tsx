import Link from 'next/link'
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import { prisma } from '../lib/prismaClient'
import type { AsanaSequence } from '@prisma/client'

export const dynamic = 'force-dynamic'

// use shared prisma client

export default async function SequencesIndexPage() {
  const sequences = await prisma.asanaSequence.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        Sequences
      </Typography>
      <List>
        {sequences.map((seq: AsanaSequence) => (
          <ListItem key={seq.id} component={Link} href={`/sequences/${seq.id}`}>
            <ListItemText
              primary={seq.nameSequence}
              secondary={seq.description ?? undefined}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
