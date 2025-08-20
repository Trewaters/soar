'use client'
import React from 'react'
import { Stack, Typography, Avatar, Box, Paper, Link } from '@mui/material'
import { red } from '@mui/material/colors'
import Image from 'next/image'
import { UseUser } from '@context/UserContext'

import LinkIcon from '@mui/icons-material/Link'
import MapIcon from '@mui/icons-material/Map'

export default function UserDetails() {
  const {
    state: { userData },
  } = UseUser()

  if (!userData) {
    return null
  }

  const membershipDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString()
    : 'N/A'

  return (
    <Paper
      elevation={1}
      sx={{
        mx: { xs: 0, sm: 2, md: 4 },
        my: { xs: 0, sm: 2 },
        width: { xs: '100%', sm: '95%', md: '80%', lg: '65%' },
        maxWidth: 700,
        alignSelf: 'center',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Image
            src={'/icons/profile/leaf-orange.png'}
            width={24}
            height={29}
            alt="Yoga Practitioner icon"
          />
          <Typography variant="h2" color="primary.main">
            Yoga Practitioner
          </Typography>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 3 }}
        >
          <Stack alignItems="center" flex={1} sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                bgcolor: red[500],
                width: { xs: 120, md: 150 },
                height: { xs: 120, md: 150 },
              }}
              aria-label="name initial"
              src={
                userData.activeProfileImage ||
                userData.image ||
                '/icons/profile/profile-person.svg'
              }
            >
              {!(userData.activeProfileImage || userData.image) && (
                <Image
                  src={'/icons/profile/profile-person.svg'}
                  width={50}
                  height={50}
                  alt="Generic profile image icon"
                />
              )}
            </Avatar>
          </Stack>
          <Stack flex={3} spacing={2}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              {userData.name ?? 'Yogi Name'}
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              Member since {membershipDate}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {userData.headline ?? 'What does yoga mean to you?'}
        </Typography>
        <Stack spacing={3}>
          <Typography variant="body1">
            {userData.shareQuick || 'No quick share provided.'}
          </Typography>
          <Typography variant="body1">
            Yoga Style: {userData.yogaStyle || 'N/A'}
          </Typography>
          <Typography variant="body1">
            Yoga Experience: {userData.yogaExperience || 'N/A'}
          </Typography>
          <Typography variant="body1">
            Company: {userData.company || 'N/A'}
          </Typography>
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <LinkIcon />
            <Typography variant="body1" noWrap>
              <Link
                href={
                  userData.websiteURL?.startsWith('http')
                    ? userData.websiteURL
                    : `https://${userData.websiteURL}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {userData.websiteURL || 'No website provided'}
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <MapIcon />
            <Typography>
              {userData.location || 'No location provided'}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Username
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 1, backgroundColor: 'lightgray' }}
        >
          {userData.name ?? 'N/A'}
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              First Name
            </Typography>
            <Typography variant="body1">
              {userData.firstName ?? 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Last Name
            </Typography>
            <Typography variant="body1">
              {userData.lastName ?? 'N/A'}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Pronouns
          </Typography>
          <Typography variant="body1">{userData.pronouns ?? 'N/A'}</Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Headline
          </Typography>
          <Typography variant="body1">
            {userData.headline || 'I am a Yoga instructor.'}
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Description/About/Bio
          </Typography>
          <Typography variant="body1">{userData.bio || 'N/A'}</Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Website URL
          </Typography>
          <Typography variant="body1">
            {userData.websiteURL || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            My Location
          </Typography>
          <Typography variant="body1">{userData.location || 'N/A'}</Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Email Address (primary/internal)
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 1, backgroundColor: 'lightgray' }}
        >
          {userData.email ?? 'N/A'}
        </Typography>
      </Stack>
    </Paper>
  )
}
