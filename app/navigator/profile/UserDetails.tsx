'use client'
import React, { useEffect, useState } from 'react'
import {
  Stack,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material'
import { red } from '@mui/material/colors'
import Image from 'next/image'
import { UseUser } from '@app/context/UserContext'
import { UserAvatar } from '@app/clientComponents/UserAvatar'
import { useSession } from 'next-auth/react'
import ProfileDetails from '@app/clientComponents/profileUi/ProfileDetails'

import ShareIcon from '@mui/icons-material/Share'

export default function UserDetails() {
  const { data: session } = useSession()
  const {
    state: { userData },
    dispatch,
  } = UseUser()

  // State for error/success messages
  const [error, setError] = useState<string>('')

  // Guard to avoid repeatedly attempting to fetch the user when the first attempt fails
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)

  // State to force re-render when userData changes
  const [, forceUpdate] = useState({})

  // Fetch complete user data if profile fields are empty but session exists
  useEffect(() => {
    const fetchCompleteUserData = async () => {
      if (
        session?.user?.email &&
        userData &&
        // Only attempt fetch once to avoid tight retry loops when backend returns errors
        !hasAttemptedFetch &&
        (!userData.email || // userData.email is empty, needs initial fetch
          userData.email === '' || // explicitly empty string
          !userData.yogaStyle || // or profile fields are empty
          !userData.company ||
          !userData.location ||
          !userData.headline)
      ) {
        try {
          const response = await fetch(
            `/api/user/?email=${encodeURIComponent(session.user.email)}`,
            { cache: 'no-store' }
          )
          if (response.ok) {
            const result = await response.json()
            dispatch({ type: 'SET_USER', payload: result.data })
            setHasAttemptedFetch(true)
          } else {
            // Stop further attempts if server returns not found or error to avoid loop
            setHasAttemptedFetch(true)
            console.warn('Failed to fetch complete user data:', response.status)
          }
        } catch (error) {
          console.error('Error fetching complete user data:', error)
          setHasAttemptedFetch(true)
        }
      }
    }

    fetchCompleteUserData()
  }, [session, userData, dispatch, hasAttemptedFetch])

  // Force re-render when userData changes to update share preview
  useEffect(() => {
    forceUpdate({})
  }, [userData])

  // Handle share functionality
  function handleShare(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault()
    if (navigator.share) {
      navigator
        .share({
          title: `UvuYoga Practitioner ${userData?.name || 'UvuYoga App Profile'}`,
          text: getSharePreviewText(),
        })
        .then(() => {
          setError('Profile shared successfully!')
          // Message will clear on next user interaction
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError('Sharing failed or was cancelled.')
            // Message will clear on next user interaction
          }
        })
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setError('Profile link copied to clipboard!')
          // Message will clear on next user interaction
        })
        .catch(() => {
          setError('Could not copy link to clipboard.')
          // Message will clear on next user interaction
        })
    }
  }

  // Generate preview text for sharing - simplified version
  const getSharePreviewText = () => {
    // If userData is not available or empty, show a default message
    if (!userData || Object.keys(userData).length === 0) {
      return 'Check out my Uvuyoga! www.happyyoga.app'
    }

    const parts = []

    // Add shareQuick message (if it exists and has content)
    if (userData.shareQuick && userData.shareQuick.trim()) {
      parts.push(userData.shareQuick.trim())
    }

    // Add headline or default message
    if (userData.headline && userData.headline.trim()) {
      parts.push(userData.headline.trim())
    } else if (parts.length === 0) {
      parts.push('Check out my Uvuyoga! www.happyyoga.app')
    }

    // Add yoga details if they exist
    if (userData.yogaStyle && userData.yogaStyle.trim()) {
      parts.push(`Yoga Style: ${userData.yogaStyle.trim()}`)
    }

    if (userData.yogaExperience && userData.yogaExperience.trim()) {
      parts.push(`Yoga Experience: ${userData.yogaExperience.trim()}`)
    }

    if (userData.company && userData.company.trim()) {
      parts.push(`Company: ${userData.company.trim()}`)
    }

    if (userData.location && userData.location.trim()) {
      parts.push(`Location: ${userData.location.trim()}`)
    }

    if (userData.websiteURL && userData.websiteURL.trim()) {
      parts.push(`My Website: ${userData.websiteURL.trim()}`)
    }

    // If no parts were added, show default message
    if (parts.length === 0) {
      parts.push('Check out my Uvuyoga! www.happyyoga.app')
    }

    return parts.join('\n')
  }

  if (!userData) {
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
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading your yoga profile...
          </Typography>
        </Stack>
      </Paper>
    )
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
            <UserAvatar
              size="large"
              showPlaceholderIndicator={false}
              sx={{
                bgcolor: red[500],
                width: { xs: 120, md: 150 },
                height: { xs: 120, md: 150 },
              }}
              aria-label="name initial"
              enableUpload={false}
            />
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

        {/* Share Preview Card */}
        <Card
          sx={{
            backgroundColor: 'grey.100',
            border: '1px solid',
            borderColor: 'grey.300',
          }}
        >
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {getSharePreviewText()}
            </Typography>
          </CardContent>
          <CardActions disableSpacing sx={{ pt: 0 }}>
            <IconButton
              aria-label="share profile"
              onClick={handleShare}
              sx={{ ml: 'auto' }}
            >
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>

        {error && (
          <Typography
            variant="body2"
            color={error.includes('success') ? 'success.main' : 'error.main'}
            sx={{ textAlign: 'center', py: 1 }}
          >
            {error}
          </Typography>
        )}

        <ProfileDetails
          label="Username"
          details={userData.name}
          highlightBackground
        />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box sx={{ width: '100%' }}>
            <ProfileDetails label="First Name" details={userData.firstName} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <ProfileDetails label="Last Name" details={userData.lastName} />
          </Box>
        </Stack>

        <ProfileDetails label="Pronouns" details={userData.pronouns} />

        <ProfileDetails
          label="Headline"
          details={userData.headline || 'I am a Yoga instructor.'}
        />

        <ProfileDetails
          label="Description/About/Bio"
          details={userData.bio}
          variant="multiline"
        />

        <ProfileDetails label="Website URL" details={userData.websiteURL} />

        <ProfileDetails label="My Location" details={userData.location} />

        <ProfileDetails
          label="Email Address (primary/internal)"
          details={userData.email}
          highlightBackground
        />

        {/* Achievement Badges Section */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'primary.main',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Achievements
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: 2 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Image
                src="/icons/profile/login-streak-1.png"
                width={64}
                height={64}
                alt="Login Streak Badge 1"
              />
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Week Warrior
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Image
                src="/icons/profile/login-streak-2.png"
                width={64}
                height={64}
                alt="Login Streak Badge 2"
              />
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Month Master
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Image
                src="/icons/profile/login-streak-3.png"
                width={64}
                height={64}
                alt="Login Streak Badge 3"
              />
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Dedicated Yogi
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}
