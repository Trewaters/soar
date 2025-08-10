'use client'

import React, { useMemo, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import EditSequence, { EditableSequence } from '@clientComponents/EditSequence'
import Image from 'next/image'

type Props = {
  sequence: EditableSequence
  defaultShowEdit?: boolean
}

export default function SequenceViewWithEdit({
  sequence,
  defaultShowEdit = false,
}: Props) {
  const { data: session } = useSession()
  const [showEdit, setShowEdit] = useState<boolean>(defaultShowEdit)
  const [model, setModel] = useState<EditableSequence>(sequence)

  const isOwner = useMemo(() => {
    const email = session?.user?.email ?? null
    if (!model.created_by || !email) return false
    // Compare case-insensitively and ignore stray whitespace
    return model.created_by.trim().toLowerCase() === email.trim().toLowerCase()
  }, [model.created_by, session?.user?.email])

  return (
    <Box component="section" aria-label="sequence-view" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h1">
            {model.nameSequence}
          </Typography>
          {isOwner && (
            <Button
              variant="outlined"
              onClick={() => setShowEdit((v) => !v)}
              aria-label={showEdit ? 'hide edit' : 'show edit'}
              aria-expanded={showEdit}
              aria-controls="sequence-edit-region"
            >
              {showEdit ? 'Close edit' : 'Edit'}
            </Button>
          )}
        </Box>

        {model.image && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative', width: 240, height: 150 }}>
              <Image
                src={model.image}
                alt={model.nameSequence || 'Sequence image'}
                fill
                sizes="240px"
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            </Box>
          </Box>
        )}

        {model.description && (
          <Typography variant="body1">{model.description}</Typography>
        )}

        <Divider />

        <Box role="group" aria-label="flow-series-list">
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Flow Series
          </Typography>
          {model.sequencesSeries?.length ? (
            <List>
              {model.sequencesSeries.map((s, idx) => (
                <ListItem key={`${s.seriesName}-${idx}`}>
                  <ListItemAvatar>
                    <Avatar src={s.image} alt={s.seriesName} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={s.seriesName}
                    secondary={
                      s.seriesPostures?.length
                        ? `${s.seriesPostures.length} postures`
                        : undefined
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No flow series added.
            </Typography>
          )}
        </Box>

        {isOwner && showEdit && (
          <Box id="sequence-edit-region" role="region" aria-label="edit-region">
            <Divider sx={{ my: 2 }} />
            <EditSequence sequence={model} onChange={(u) => setModel(u)} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
