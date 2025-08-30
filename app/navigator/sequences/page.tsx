import Link from 'next/link'
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import { PrismaClient } from '../../../prisma/generated/client'
import type { AsanaSequence } from '../../../prisma/generated/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()
/* DELETE THIS PAGE. NOT USED CORRECTLY 2025-08-30 06:40:15 */
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
          <ListItem
            key={seq.id}
            component={Link}
            href={`/navigator/sequences/${seq.id}`}
          >
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
