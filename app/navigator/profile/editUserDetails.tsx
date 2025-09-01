'use client'
import React, { useEffect, useState, useCallback } from 'react'
import Modal from '@mui/material/Modal'
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
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { red } from '@mui/material/colors'
import { useSession } from 'next-auth/react'
import { UseUser } from '@context/UserContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LinkIcon from '@mui/icons-material/Link'
import ShareIcon from '@mui/icons-material/Share'
import MapIcon from '@mui/icons-material/Map'
import { styled } from '@mui/material/styles'
import { LocationPicker } from '@app/clientComponents/locationPicker'
import TextInputField from '@app/clientComponents/inputComponents/TextInputField'
import {
  getMobileInputTheme,
  getMobileFormContainerTheme,
} from '@app/utils/mobileThemeHelpers'

interface EditUserDetailsProps {
  onSaveSuccess?: () => void
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
}: EditUserDetailsProps = {}) {
  const { data: session } = useSession()
  // const session = {
  // user: {
  // email: 'john.doe@example.com',
  // name: 'John Doe',
  // image: 'https://www.pexels.com/photo/8247740/',
  // },
  // }

  const router = useRouter()
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
      const res = await fetch('/api/images/upload?imageType=profile', {
        method: 'GET',
      })
      const data = await res.json()
      if (data.images) {
        setProfileImages(data.images.map((img: any) => img.url))
        // Optionally, set active image from DB if available
        if (
          userData?.activeProfileImage &&
          data.images.some(
            (img: any) => img.url === userData.activeProfileImage
          )
        ) {
          setActiveProfileImage(userData.activeProfileImage)
        } else if (data.images.length > 0) {
          setActiveProfileImage(data.images[0].url)
        } else {
          setActiveProfileImage(null)
        }
      }
    } catch (e) {
      setError('Failed to load profile images')
    } finally {
      setImageLoading(false)
    }
  }, [userData?.activeProfileImage])

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
      formData.append('userId', userData.id)
      formData.append('imageType', 'profile')
      // Optionally: formData.append('altText', 'Profile image')
      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      await fetchProfileImages()
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
      // Find image ID by URL (requires GET to fetch all images)
      const res = await fetch('/api/images/upload?imageType=profile', {
        method: 'GET',
      })
      const data = await res.json()
      const img = data.images.find((img: any) => img.url === url)
      if (!img) throw new Error('Image not found')
      const delRes = await fetch(`/api/images/upload?id=${img.id}`, {
        method: 'DELETE',
      })
      if (!delRes.ok) throw new Error('Delete failed')
      await fetchProfileImages()
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    } finally {
      setImageLoading(false)
    }
  }

  const handleProfileImageSelect = async (url: string) => {
    setActiveProfileImage(url)
    // Optionally, update userData context and persist active image to DB
    dispatch({
      type: 'SET_PROFILE_IMAGES',
      payload: { images: profileImages, active: url },
    })
    // Optionally, call an API to persist active image selection
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
      boxShadow: '0 4px 4px 0 #CBCBCB',
      fontSize: '16px', // Prevents mobile zoom
      minHeight: '48px', // Touch-friendly
    },
    '& .MuiInputBase-input': {
      fontSize: '16px !important', // Critical for preventing iOS zoom
      padding: '12px 16px',
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
            elevation={1}
            sx={{
              mx: { xs: 0, sm: 2, md: 4 },
              my: { xs: 0, sm: 2 },
              width: { xs: '100%', sm: '95%', md: '80%', lg: '65%' },
              maxWidth: 700,
              alignSelf: 'center',
              ...getMobileFormContainerTheme(), // Mobile keyboard optimizations
            }}
          >
            <Stack
              spacing={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                width: '100%',
                boxSizing: 'border-box',
              }}
              component="form"
              onSubmit={handleSubmit}
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
                <Stack
                  alignItems="center"
                  flex={1}
                  sx={{ position: 'relative' }}
                >
                  <Avatar
                    sx={{
                      bgcolor: red[500],
                      width: { xs: 120, md: 150 },
                      height: { xs: 120, md: 150 },
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
                        width={50}
                        height={50}
                        alt="Generic profile image icon"
                      />
                    )}
                  </Avatar>
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
                </Stack>

                {/* User Details Section */}
                <Stack flex={3} spacing={2}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {userData?.name ?? 'Yogi Name'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    Member since {membershipDate ?? '6/9/2024'}
                    {/* '6/9/2024' this is the date I started working on Uvuyoga */}
                  </Typography>
                </Stack>
              </Stack>

              <Card>
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
                  </CardContent>
                </Collapse>
              </Card>

              {/* Form Fields */}
              <FormControl sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Username
                </Typography>
                <TextField
                  name="username"
                  value={userData?.name ?? ''}
                  placeholder="Username"
                  variant="filled"
                  disabled
                  fullWidth
                  sx={{ ...textFieldStyles, width: '100%' }}
                />
              </FormControl>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl sx={{ width: '100%' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    First Name
                  </Typography>
                  <TextInputField
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName ?? ''}
                    onChange={(e) => {
                      const { name, value } = e.target
                      setFormData((prev) => ({
                        ...prev,
                        [name]: value,
                      }))
                    }}
                    variant="outlined"
                    required
                    fullWidth
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Last Name
                  </Typography>
                  <TextInputField
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    sx={{ ...textFieldStyles, width: '100%' }}
                  />
                </FormControl>
              </Stack>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Pronouns
                </Typography>
                <TextInputField
                  name="pronouns"
                  placeholder="Enter Pronouns"
                  value={formData.pronouns}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  sx={{ ...textFieldStyles, width: '100%' }}
                />
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Headline
                </Typography>
                <TextInputField
                  name="headline"
                  placeholder="Enter...2 sentences"
                  value={formData.headline || 'I am a Yoga instructor.'}
                  onChange={handleChange}
                  multiline
                  maxRows={6}
                  minRows={2}
                  fullWidth
                  sx={{ ...textFieldStyles, width: '100%' }}
                />
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Description/About/Bio
                </Typography>
                <TextInputField
                  name="bio"
                  placeholder="Enter...Biography"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  maxRows={6}
                  minRows={4}
                  fullWidth
                  sx={{ ...textFieldStyles, width: '100%' }}
                />
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Website URL
                </Typography>
                <TextInputField
                  name="websiteURL"
                  placeholder="Enter website URL"
                  value={formData.websiteURL}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  sx={{ ...textFieldStyles, width: '100%' }}
                />
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  My Location
                </Typography>
                <LocationPicker
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="Search for your city, state, or country"
                  variant="outlined"
                  fullWidth
                  showCurrentLocation={true}
                  showMapButton={false}
                  helperText="Select your location to connect with local yoga practitioners"
                  sx={{ ...textFieldStyles, width: '100%' }}
                />
              </FormControl>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Email Address (primary/internal)
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 1, backgroundColor: 'lightgray' }}
              >
                {userData?.email ?? 'N/A'}
              </Typography>
              <FormHelperText>
                Your email address cannot be changed.
              </FormHelperText>
              {/* Move Manage Profile Images button above Save button */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-around"
                sx={{ width: '100%' }}
              >
                <Button
                  variant="outlined"
                  aria-label="Open profile image manager"
                  onClick={() => setImageManagerOpen(true)}
                >
                  Manage Profile Images
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  sx={{ minWidth: 120, py: 1.5, fontSize: 16 }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Save'}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Detailed Activity Streaks Section */}
          <Stack sx={{ mt: 3, mx: 3 }}>
            <ActivityStreaks variant="detailed" />
          </Stack>
        </>
      )}
    </>
  )
}
