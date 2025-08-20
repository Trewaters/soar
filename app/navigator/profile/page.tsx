'use client'
import { Box, Container, IconButton, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import EditUserDetails from '@app/navigator/profile/editUserDetails'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import UserDetails from './UserDetails'
import React, { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import NoteAltIcon from '@mui/icons-material/NoteAlt'

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Navigation Menu */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileNavMenu />
        </Grid>

        {/* Main Profile Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ClientWrapper />
        </Grid>
      </Grid>
    </Container>
  )
}

function ClientWrapper() {
  const [editMode, setEditMode] = useState(false)
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
    >
      <Tooltip title={editMode ? 'View Profile' : 'Edit Profile'}>
        <IconButton
          aria-label={editMode ? 'View Profile' : 'Edit Profile'}
          onClick={() => setEditMode((prev) => !prev)}
          sx={{ alignSelf: 'flex-end', mb: 2 }}
        >
          {editMode ? <NoteAltIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>
      {editMode ? <EditUserDetails /> : <UserDetails />}
    </Box>
  )
}
