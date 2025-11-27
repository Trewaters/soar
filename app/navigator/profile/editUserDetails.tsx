'use client'
import React, { useEffect, useState, useCallback } from 'react'
import Modal from '@mui/material/Modal'
import type { Theme } from '@mui/material/styles'
import { ProfileImageManager } from '@app/clientComponents/ProfileImage/ProfileImageManager'
import {
  Avatar,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Box,
  FormHelperText,
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  Link,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { red } from '@mui/material/colors'
import { useSession } from 'next-auth/react'
import { UseUser } from '@context/UserContext'
import Image from 'next/image'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LinkIcon from '@mui/icons-material/Link'
import ShareIcon from '@mui/icons-material/Share'
import MapIcon from '@mui/icons-material/Map'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { LocationPicker } from '@app/clientComponents/locationPicker'
import TextInputField from '@app/clientComponents/inputComponents/TextInputField'
import {
  getMobileInputTheme,
  getMobileFormContainerTheme,
} from '@app/utils/mobileThemeHelpers'
import theme from '@styles/theme'

interface EditUserDetailsProps {
  onSaveSuccess?: () => void
  onCancel?: () => void
}

const yogaStyles = [
  'Ashtanga',
  'Vinyasa Flow',
  'Hatha',
  'Yin',
  'Restorative',
  'Nidra',
  'Hot yoga',
  'Kundalini',
  'Iyengar',
  'Power Yoga',
  'Bikram Yoga',
  'Anusara',
  'Sivananda',
  'Jivamukti',
  'Aerial Yoga',
  'Prenatal Yoga',
  'Kripalu',
  'AcroYoga',
]
const ExpandMore = styled(
  (props: { expand: boolean } & React.ComponentProps<typeof IconButton>) => {
    const { expand, ...other } = props
    return <IconButton {...other} />
  }
)(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default function EditUserDetails({
  onSaveSuccess,
  onCancel,
}: EditUserDetailsProps = {}) {
  const { data: session } = useSession()
  // const session = {
  // user: {
  // email: 'john.doe@example.com',
  // name: 'John Doe',
  // image: 'https://www.pexels.com/photo/8247740/',
  // },
  // }

  const router = useNavigationWithLoading()
  const {
    state: { userData },
    dispatch,
  } = UseUser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileImageMode, setProfileImageMode] = useState<
    'active' | 'inactive' | 'edit'
  >('active')
  // Modal state for profile image manager
  const [imageManagerOpen, setImageManagerOpen] = useState(false)

  // Local state for images (mirrors context, but allows optimistic UI)
  const [profileImages, setProfileImages] = useState<string[]>(
    userData?.profileImages || []
  )
  const [activeProfileImage, setActiveProfileImage] = useState<string | null>(
    userData?.activeProfileImage || null
  )
  const [imageLoading, setImageLoading] = useState(false)

  // Placeholder image
  const profilePlaceholder = '/icons/profile/profile-person.svg'

  // Fetch images from API (on mount and after upload/delete)
  const fetchProfileImages = useCallback(async () => {
    setImageLoading(true)
    try {
      const res = await fetch('/api/profileImage/get', {
        method: 'GET',
      })
      const data = await res.json()
      if (data.success) {
        setProfileImages(data.images || [])
        setActiveProfileImage(data.activeImage || null)
      } else {
        setError(data.error || 'Failed to load profile images')
      }
    } catch (e) {
      setError('Failed to load profile images')
    } finally {
      setImageLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfileImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync context when images change
  useEffect(() => {
    dispatch({
      type: 'SET_PROFILE_IMAGES',
      payload: { images: profileImages, active: activeProfileImage },
    })
  }, [profileImages, activeProfileImage, dispatch])
  // Handlers for ProfileImageManager
  const handleProfileImageUpload = async (file: File) => {
    setImageLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/profileImage', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await res.json()
      setProfileImages(data.images || [])
      setActiveProfileImage(data.activeProfileImage || null)

      // Update context with new images
      dispatch({
        type: 'SET_PROFILE_IMAGES',
        payload: {
          images: data.images || [],
          active: data.activeProfileImage || null,
        },
      })
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setImageLoading(false)
    }
  }

  const handleProfileImageDelete = async (url: string) => {
    setImageLoading(true)
    setError(null)
    try {
      const delRes = await fetch('/api/profileImage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!delRes.ok) {
        const errorData = await delRes.json()
        throw new Error(errorData.error || 'Delete failed')
      }

      const data = await delRes.json()
      if (data.success) {
        setProfileImages(data.images || [])
        setActiveProfileImage(data.activeProfileImage || null)

        // Update context
        dispatch({
          type: 'SET_PROFILE_IMAGES',
          payload: {
            images: data.images || [],
            active: data.activeProfileImage || null,
          },
        })
      }
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    } finally {
      setImageLoading(false)
    }
  }

  const handleProfileImageSelect = async (url: string) => {
    setImageLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/profileImage/setActive', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to set active image')
      }

      const data = await res.json()
      if (data.success) {
        setActiveProfileImage(url)

        // Update context
        dispatch({
          type: 'SET_PROFILE_IMAGES',
          payload: { images: profileImages, active: url },
        })
      }
    } catch (e: any) {
      setError(e.message || 'Failed to set active image')
    } finally {
      setImageLoading(false)
    }
  }

  // Local form state to prevent re-renders on every keystroke
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pronouns: '',
    headline: '',
    bio: '',
    websiteURL: '',
    location: '',
    shareQuick: '',
    yogaStyle: '',
    yogaExperience: '',
    company: '',
  })

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName ?? '',
        lastName: userData.lastName ?? '',
        pronouns: userData.pronouns ?? '',
        headline: userData.headline ?? '',
        bio: userData.bio ?? '',
        websiteURL: userData.websiteURL ?? '',
        location: userData.location ?? '',
        shareQuick: userData.shareQuick ?? '',
        yogaStyle: userData.yogaStyle ?? '',
        yogaExperience: userData.yogaExperience ?? '',
        company: userData.company ?? '',
      })
    }
  }, [userData])

  // Memoized stable change handler to prevent re-creation
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      value?: string
    ) => {
      const { name } = e.target
      const fieldValue = value !== undefined ? value : e.target.value

      console.log('onChange called for:', name, 'with value:', fieldValue)

      // Update local form state only - this doesn't trigger context re-renders
      setFormData((prev) => ({
        ...prev,
        [name]: fieldValue,
      }))
    },
    []
  )

  const handleLocationChange = useCallback((location: string) => {
    setFormData((prev) => ({
      ...prev,
      location: location,
    }))
  }, [])

  const ProfileStatusIndicator = ({
    mode,
    iconSrc,
    alt,
  }: {
    mode: 'active' | 'inactive' | 'edit'
    iconSrc: string
    alt: string
  }) => {
    return (
      <Box>
        <Image
          src={iconSrc}
          alt={alt}
          width={27}
          height={27}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            width: 27,
            height: 27,
            display: 'block',
          }}
        />
      </Box>
    )
  }

  const textFieldStyles = {
    '& .MuiInputBase-root': {
      borderRadius: '12px',
      boxShadow: (theme: Theme) => `0 4px 4px 0 ${theme.palette.grey[400]}`,
      fontSize: '16px', // Prevents mobile zoom
      minHeight: '48px', // Touch-friendly
    },
    '& .MuiInputBase-input': {
      fontSize: '16px !important', // Critical for preventing iOS zoom
      padding: '8px 12px',
      WebkitAppearance: 'none',
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
    // Apply mobile-specific enhancements
    ...getMobileInputTheme(),
  }

  useEffect(() => {
    // If session is available and userData.email is empty, set it to trigger context fetch
    if (session?.user?.email && (!userData?.email || userData?.email === '')) {
      dispatch({
        type: 'SET_USER',
        payload: { ...userData, email: session.user.email },
      })
    } else if (session?.user?.email && userData?.email !== session.user.email) {
      dispatch({
        type: 'SET_USER',
        payload: { ...userData, email: session.user.email },
      })
    }
    // setProfileImageMode('active')
  }, [session, dispatch, userData])

  // State for card expand/collapse
  const [expanded, setExpanded] = useState(false)
  const handleExpandClick = () => {
    setExpanded((prev) => !prev)
  }

  if (!session) {
    return (
      <Button
        variant="outlined"
        onClick={() => router.push('/auth/signin')}
        aria-label="Sign in to view your profile page"
        sx={{
          padding: '12px 16px',
          borderRadius: '14px',
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
        }}
      >
        Sign in to view your profile
      </Button>
    )
  }

  // Show loading spinner if userData is not yet loaded
  if (!userData) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: 300, width: '100%' }}
      >
        <CircularProgress size={48} color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your profile...
        </Typography>
      </Stack>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Update userData context with all form data at once
      const updatedUserData = {
        ...userData,
        ...formData,
      }

      const response = await fetch(
        `/api/user/updateUserData/?email=${userData.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update user data')
      }

      const updatedUser = await response.json()
      dispatch({ type: 'SET_USER', payload: updatedUser })

      // Switch back to view mode to show saved changes
      onSaveSuccess?.()
    } catch (error) {
      setError(`Error updating user data: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const membershipDate = new Date(userData?.createdAt).toLocaleDateString()

  function handleShare(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault()
    if (navigator.share) {
      navigator
        .share({
          title: `UvuYoga Practitioner ${userData?.name || 'UvuYoga App Profile'}`,
          text:
            (userData?.shareQuick
              ? `\n\n${userData.shareQuick}`
              : `\n\n${formData.shareQuick}`) +
            (userData?.headline
              ? `\n${userData.headline}`
              : '\nCheck out my yoga profile!') +
            (userData?.yogaStyle ? `\nYoga Style: ${userData.yogaStyle}` : '') +
            (userData?.yogaExperience
              ? `\nYoga Experience: ${userData.yogaExperience}`
              : '') +
            (userData?.company ? `\nCompany: ${userData.company}` : '') +
            (userData?.location ? `\nLocation: ${userData.location}` : '') +
            (userData?.websiteURL
              ? `\n\nMy Website: ${userData.websiteURL}`
              : ''),
        })
        .then(() => {
          setError('Profile shared successfully!')
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setError('Sharing failed or was cancelled.')
          }
        })
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setError('Profile link copied to clipboard!')
        })
        .catch(() => {
          setError('Could not copy link to clipboard.')
        })
    }
  }

  return (
    <>
      {error && (
        <Grid size={12} textAlign={'center'}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}
      {session && (
        <>
          <Paper
            elevation={3}
            sx={{
              mx: { xs: 0, sm: 2, md: 4 },
              my: { xs: 0, sm: 2 },
              width: { xs: '100%', sm: '95%', md: '80%', lg: '65%' },
              maxWidth: 700,
              alignSelf: 'center',
              borderRadius: 3,
              overflow: 'hidden',
              ...getMobileFormContainerTheme(),
            }}
          >
            {/* Header Section with Green Background */}
            <Box
              sx={{
                bgcolor: theme.palette.success.main,
                color: 'white',
                p: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Image
                    src={'/icons/profile/leaf-orange.png'}
                    width={32}
                    height={38}
                    alt="Yoga Practitioner icon"
                  />
                  <Typography variant="h4" fontWeight="bold">
                    Edit Profile
                  </Typography>
                </Stack>
                {onCancel && (
                  <IconButton
                    aria-label="Cancel editing and view profile"
                    onClick={onCancel}
                    sx={{
                      color: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                    data-testid="cancel-edit-header-button"
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Stack>
            </Box>

            {/* Content wrapper with padding */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                px: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Stack
                spacing={3}
                sx={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                component="form"
                id="edit-user-details-form"
                onSubmit={handleSubmit}
                data-testid="edit-user-details-form"
              >
                {/* Profile Image Section */}
                <Stack spacing={2} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      cursor: 'pointer',
                      alignSelf: 'center',
                      '&:hover .camera-overlay': {
                        opacity: 1,
                      },
                    }}
                    onClick={() => setImageManagerOpen(true)}
                    role="button"
                    aria-label="Click to manage profile images"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setImageManagerOpen(true)
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: red[500],
                        width: { xs: 140, md: 160 },
                        height: { xs: 140, md: 160 },
                        border: '4px solid',
                        borderColor: theme.palette.success.main,
                      }}
                      aria-label="name initial"
                      src={
                        activeProfileImage ||
                        userData?.image ||
                        profilePlaceholder
                      }
                    >
                      {!(activeProfileImage || userData?.image) && (
                        <Image
                          src={profilePlaceholder}
                          width={60}
                          height={60}
                          alt="Generic profile image icon"
                        />
                      )}
                    </Avatar>
                    {/* Camera icon overlay */}
                    <Box
                      className="camera-overlay"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                        opacity: 0.9,
                        transition: 'opacity 0.2s ease-in-out',
                        border: '3px solid white',
                      }}
                    >
                      <CameraAltIcon
                        sx={{
                          color: 'white',
                          fontSize: { xs: 22, md: 26 },
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{ mt: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    {userData?.name ?? 'Yogi Name'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Member since {membershipDate ?? '6/9/2024'}
                  </Typography>
                </Stack>

                {/* Profile Image Manager Modal */}
                <Modal
                  open={imageManagerOpen}
                  onClose={() => setImageManagerOpen(false)}
                  aria-labelledby="profile-image-manager-title"
                  aria-describedby="profile-image-manager-description"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                      minWidth: { xs: 300, md: 400 },
                      outline: 'none',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Typography
                      id="profile-image-manager-title"
                      variant="h6"
                      sx={{ mb: 2 }}
                    >
                      Manage Profile Images
                    </Typography>
                    <ProfileImageManager
                      images={profileImages}
                      active={activeProfileImage}
                      placeholder={profilePlaceholder}
                      onChange={(imgs, active) => {
                        setProfileImages(imgs)
                        setActiveProfileImage(active)
                      }}
                      onUpload={handleProfileImageUpload}
                      onDelete={handleProfileImageDelete}
                      onSelect={handleProfileImageSelect}
                      loading={imageLoading}
                      maxImages={3}
                    />
                    <Button
                      onClick={() => setImageManagerOpen(false)}
                      sx={{ mt: 2 }}
                      variant="outlined"
                      fullWidth
                      aria-label="Close profile image manager"
                    >
                      Close
                    </Button>
                  </Box>
                </Modal>
                {/*   {profileImageMode === 'active' && (
                  <ProfileStatusIndicator
                    mode="active"
                    iconSrc="/icons/profile/profile-image-active.svg"
                    alt="Active profile image icon"
                  />
                )}
                {profileImageMode === 'inactive' && (
                  <ProfileStatusIndicator
                    mode="inactive"
                    iconSrc="/icons/profile/profile-image-inactive.svg"
                    alt="Inactive profile image icon"
                  />
                )}
                {profileImageMode === 'edit' && (
                  <ProfileStatusIndicator
                    mode="edit"
                    iconSrc="/icons/profile/profile-image-edit.svg"
                    alt="Edit profile image icon"
                  />
                )} */}

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {userData?.headline ?? 'What does yoga mean to you?'}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="share" onClick={handleShare}>
                      <ShareIcon />
                    </IconButton>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Stack spacing={3}>
                        <TextInputField
                          name="shareQuick"
                          id="share-quick-input"
                          placeholder='Share "Quickly"'
                          label="Share Quickly"
                          value={formData.shareQuick}
                          variant="outlined"
                          onChange={handleChange}
                          fullWidth
                        />
                        <Autocomplete
                          freeSolo
                          fullWidth
                          options={yogaStyles}
                          value={formData.yogaStyle || ''}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              yogaStyle:
                                typeof newValue === 'string' ? newValue : '',
                            }))
                          }}
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase())
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="yogaStyle"
                              id="yoga-style-input"
                              placeholder='Enter "Yoga Style"'
                              label="Yoga Style"
                              variant="outlined"
                              value={formData.yogaStyle || ''}
                              onChange={handleChange}
                              fullWidth
                              sx={{ ...textFieldStyles, width: '100%' }}
                            />
                          )}
                          sx={{ width: '100%' }}
                        />
                        <TextInputField
                          name="yogaExperience"
                          id="yoga-experience-input"
                          placeholder='Enter "Yoga Experience"'
                          label="Yoga Experience"
                          value={formData.yogaExperience}
                          variant="outlined"
                          onChange={handleChange}
                          fullWidth
                        />
                        <TextInputField
                          name="company"
                          id="company-input"
                          placeholder='Enter "Company"'
                          label="Company"
                          value={formData.company}
                          variant="outlined"
                          onChange={handleChange}
                          fullWidth
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems={'center'}
                        >
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
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems={'center'}
                        >
                          <MapIcon />
                          <Typography>
                            {userData.location || 'No location provided'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Collapse>
                </Card>

                {/* Form Fields */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Username
                  </Typography>
                  <TextField
                    name="username"
                    value={userData?.name ?? ''}
                    placeholder="Username"
                    variant="filled"
                    disabled
                    fullWidth
                    helperText="Username cannot be changed"
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Name
                  </Typography>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextInputField
                      name="firstName"
                      placeholder="e.g., Amara"
                      value={formData.firstName}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      fullWidth
                      label="First Name"
                      sx={{ ...textFieldStyles, width: '100%' }}
                    />
                    <TextInputField
                      name="lastName"
                      placeholder="e.g., Sharma"
                      value={formData.lastName}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      fullWidth
                      label="Last Name"
                      sx={{ ...textFieldStyles, width: '100%' }}
                    />
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Pronouns
                  </Typography>
                  <TextInputField
                    name="pronouns"
                    placeholder="e.g., she/her, he/him, they/them"
                    value={formData.pronouns}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Headline
                  </Typography>
                  <TextInputField
                    name="headline"
                    placeholder="e.g., Yoga instructor passionate about mindfulness"
                    value={formData.headline}
                    onChange={handleChange}
                    multiline
                    maxRows={6}
                    minRows={2}
                    fullWidth
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Description/About/Bio
                  </Typography>
                  <TextInputField
                    name="bio"
                    placeholder="e.g., Share your yoga journey, teaching experience, and what inspires your practice..."
                    value={formData.bio}
                    onChange={handleChange}
                    multiline
                    maxRows={6}
                    minRows={4}
                    fullWidth
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Website URL
                  </Typography>
                  <TextInputField
                    name="websiteURL"
                    placeholder="e.g., https://myyogastudio.com"
                    value={formData.websiteURL}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    My Location
                  </Typography>
                  <LocationPicker
                    value={formData.location}
                    onChange={handleLocationChange}
                    placeholder="e.g., San Francisco, CA, USA"
                    variant="outlined"
                    fullWidth
                    showCurrentLocation={true}
                    showMapButton={false}
                    helperText="Select your location to connect with local yoga practitioners"
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                    mb: 20, // Space for sticky action bar above bottom nav
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                  >
                    Email Address (primary/internal)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      backgroundColor: 'grey.200',
                      p: 1.5,
                      borderRadius: '12px',
                    }}
                  >
                    {userData?.email ?? 'N/A'}
                  </Typography>
                  <FormHelperText>
                    Your email address cannot be changed.
                  </FormHelperText>
                </Paper>
              </Stack>
            </Box>
          </Paper>

          {/* Sticky Action Bar - Positioned above bottom navigation */}
          <Box
            sx={{
              // Keep the action bar in the document flow so it appears
              // directly beneath the profile content and above the bottom nav.
              position: 'relative',
              mt: 2,
              mb: { xs: 18, sm: 12 }, // provide space above the bottom nav on small screens
              left: 'auto',
              right: 'auto',
              backgroundColor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
              py: 2.5,
              px: 3,
              zIndex: 'auto',
              boxShadow: 'none',
            }}
            data-testid="sticky-action-bar"
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              <Button
                variant="outlined"
                onClick={onCancel}
                data-testid="cancel-edit-button"
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-user-details-form"
                disabled={loading}
                variant="contained"
                startIcon={loading ? null : <SaveIcon />}
                data-testid="save-changes-button"
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </>
  )
}
