'use client'
import { Box, Container } from '@mui/material'
import Grid from '@mui/material/Grid2'
import EditUserDetails from '@app/profile/editUserDetails'
import ProfileNavMenu from '@app/profile/ProfileNavMenu'
import UserDetails from './UserDetails'
import React, { useState } from 'react'

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

  const handleSaveSuccess = () => {
    setEditMode(false) // Switch back to view mode after successful save
  }

  const handleEditClick = () => {
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
  }

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
    >
      {editMode ? (
        <EditUserDetails
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <UserDetails onEditClick={handleEditClick} />
      )}
    </Box>
  )
}
