import { notFound } from 'next/navigation'
import { Box } from '@mui/material'
import SequenceViewWithEdit from '@clientComponents/SequenceViewWithEdit'
import { PrismaClient } from '../../../prisma/generated/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function SequenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const seq = await prisma.asanaSequence.findUnique({ where: { id } })
  if (!seq) return notFound()

  const sequence = {
    id: seq.id,
    nameSequence: seq.nameSequence,
    sequencesSeries: Array.isArray(seq.sequencesSeries)
      ? (seq.sequencesSeries as any[])
      : [],
    description: seq.description ?? undefined,
    image: seq.image ?? undefined,
    created_by: (seq as any).created_by ?? null,
  }

  return (
    <Box sx={{ p: 2 }}>
      <SequenceViewWithEdit sequence={sequence} />
    </Box>
  )
}
