'use client'
import React, { useEffect, useState } from 'react'
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

export default function UserDetails() {
  const { data: session } = useSession()

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

  useEffect(() => {
    if (session?.user?.email && userData?.email !== session.user.email) {
      dispatch({
        type: 'SET_USER',
        payload: { ...userData, email: session.user.email },
      })
    }
    setProfileImageMode('active')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_USER', payload: { ...userData, [name]: value } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/user/updateUserData/?email=${userData.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update user data')
      }

      const updatedUser = await response.json()
      dispatch({ type: 'SET_USER', payload: updatedUser })
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
          title: `Yoga Practitioner ${userData?.name || 'Happy Yoga'}`,
          text:
            (userData?.headline || 'Check out my yoga profile!') +
            (userData?.shareQuick ? `\n${userData.shareQuick}` : ''),
          url: window.location.href,
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
        <Box sx={{ flexGrow: 1, justifyItems: 'center' }}>
          <Paper elevation={1} sx={{ mx: 3 }}>
            <Stack
              spacing={3}
              sx={{ p: 3 }}
              component="form"
              onSubmit={handleSubmit}
            >
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

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
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
                    src={userData?.image}
                  >
                    {!userData?.image ? (
                      <Image
                        src={'/icons/profile/profile-person.svg'}
                        width={50}
                        height={50}
                        alt="Generic profile image icon"
                      />
                    ) : undefined}
                  </Avatar>
                  {profileImageMode === 'active' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src={'/icons/profile/profile-image-active.svg'}
                        alt="Active profile image icon"
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
                  )}
                  {profileImageMode === 'inactive' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2,
                        border: '2px solid',
                        borderColor: 'grey.400',
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src={'/icons/profile/profile-image-inactive.svg'}
                        width={27}
                        height={27}
                        alt="Inactive profile image icon"
                        style={{
                          borderRadius: '50%',
                          objectFit: 'cover',
                          width: 27,
                          height: 27,
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}
                  {profileImageMode === 'edit' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2,
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src={'/icons/profile/profile-image-edit.svg'}
                        width={27}
                        height={27}
                        alt="Edit profile image icon"
                        style={{
                          borderRadius: '50%',
                          objectFit: 'cover',
                          width: 27,
                          height: 27,
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}
                </Stack>
                <Stack flex={3} pt={2} spacing={2}>
                  <Stack justifyContent={'center'}>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      {userData?.name ?? 'Yogi Name'}
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      Member since {membershipDate ?? '6/9/2024'}
                    </Typography>
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    <ActivityStreaks variant="compact" />
                  </Box>
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
                    <Stack direction="row" spacing={2} mb={2}>
                      <FormControl>
                        <TextField
                          name="shareQuick"
                          id="outlined-basic"
                          placeholder='Share "Quickly"'
                          label="Share Quickly"
                          value={userData.shareQuick ?? ''}
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                      <FormControl>
                        <Autocomplete
                          freeSolo
                          sx={{ width: '207px' }}
                          options={yogaStyles}
                          value={userData.yogaStyle ?? ''}
                          onChange={(event, newValue) => {
                            dispatch({
                              type: 'SET_USER',
                              payload: {
                                ...userData,
                                yogaStyle: newValue ?? '',
                              },
                            })
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
                              id="outlined-basic"
                              placeholder='Enter "Yoga Style"'
                              label="Yoga Style"
                              variant="outlined"
                              onChange={handleChange}
                            />
                          )}
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                      <FormControl>
                        <TextField
                          name="yogaExperience"
                          id="outlined-basic"
                          placeholder='Enter "Yoga Experience"'
                          label="Yoga Experience"
                          value={userData.yogaExperience ?? ''}
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                      <FormControl>
                        <TextField
                          name="company"
                          id="outlined-basic"
                          placeholder='Enter "Company"'
                          label="Company"
                          value={userData.company ?? ''}
                          variant="outlined"
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="column" spacing={2} mb={2}>
                      <Stack direction="row" spacing={2} alignItems={'center'}>
                        <LinkIcon />
                        <Typography variant="body1">
                          <Link
                            href={
                              userData.websiteURL?.startsWith('http')
                                ? userData.websiteURL
                                : `https://${userData.websiteURL}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {userData.websiteURL}
                          </Link>
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} mb={2}>
                      <MapIcon />
                      <Typography>{userData.location ?? ''}</Typography>
                      <MapIcon />
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>

              <FormControl>
                <Typography variant="body1">Username</Typography>
                <TextField
                  name="username"
                  id="username text input"
                  sx={{
                    '& .MuiInputBase-root ': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 4px 0 #CBCBCB',
                    },
                  }}
                  value={userData?.name ?? undefined}
                  placeholder="Username"
                  variant="filled"
                  disabled
                />
              </FormControl>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <FormControl sx={{ flex: 1 }}>
                  <Typography variant="body1">First Name</Typography>
                  <TextField
                    name="firstName"
                    id="first name text input"
                    placeholder='Enter "First Name"'
                    value={userData.firstName ?? ''}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiInputBase-root ': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 4px 0 #CBCBCB',
                        '&:hover .MuiInputBase-input': {
                          borderColor: '2024-11-13 15:47:20',
                          // backgroundColor: 'lime',
                        },
                      },
                    }}
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <Typography variant="body1">Last Name</Typography>
                  <TextField
                    required
                    name="lastName"
                    id="last name text input"
                    placeholder='Enter "Last Name"'
                    value={userData.lastName ?? ''}
                    onChange={handleChange}
                    variant="outlined"
                    type="text"
                    sx={{
                      '& .MuiInputBase-root ': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 4px 0 #CBCBCB',
                      },
                    }}
                  />
                </FormControl>
              </Stack>

              <FormControl>
                <Typography variant="body1">Pronouns</Typography>
                <TextField
                  name="pronouns"
                  id="pronouns"
                  placeholder='Enter "Pronouns"'
                  variant="outlined"
                  value={userData?.pronouns ?? ''}
                  onChange={handleChange}
                  sx={{
                    '& .MuiInputBase-root ': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 4px 0 #CBCBCB',
                    },
                  }}
                />
              </FormControl>

              <FormControl sx={{ width: '80%' }}>
                <Typography variant="body1">
                  Email Address (primary/internal)
                </Typography>
                <TextField
                  id="email-text-input"
                  name="email"
                  placeholder="xyz@ABC.com"
                  value={userData?.email ?? ''}
                  variant="outlined"
                  type="email"
                  disabled
                  sx={{
                    '& .MuiInputBase-root ': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 4px 0 #CBCBCB',
                    },
                  }}
                />
                <FormHelperText>
                  Your email address cannot be changed. Contact us for support.
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '80%' }}>
                <Typography variant="body1">Headline</Typography>
                <TextField
                  id="headline-text-input"
                  name="headline"
                  placeholder="Enter...2 sentences"
                  value={userData?.headline ?? 'I am a Yoga instructor.'}
                  onChange={handleChange}
                  multiline
                  maxRows={2}
                  sx={{
                    '& .MuiInputBase-root ': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 4px 0 #CBCBCB',
                    },
                  }}
                />
              </FormControl>

              <FormControl sx={{ width: '80%' }}>
                <Typography variant="body1">Description/About/Bio:</Typography>
                <TextField
                  id="biography-text-input"
                  name="bio"
                  placeholder="Enter...Biography"
                  value={userData?.bio ?? ''}
                  onChange={handleChange}
                  multiline
                  maxRows={4}
                  sx={{
                    '& .MuiInputBase-root ': {
                      borderRadius: '12px',
                      boxShadow: '0 4px 4px 0 #CBCBCB',
                    },
                  }}
                />
              </FormControl>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <FormControl sx={{ width: { xs: '100%', md: '100%' } }}>
                  <Typography variant="body1">Website URL</Typography>
                  <TextField
                    name="websiteURL"
                    id="webisite-url-text-input"
                    placeholder="Enter website URL"
                    value={userData?.websiteURL ?? ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-root ': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 4px 0 #CBCBCB',
                      },
                    }}
                  />
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', md: '60%' } }}>
                  <Typography variant="body1">My Location</Typography>
                  <TextField
                    name="location"
                    id="location-text-input"
                    placeholder='Enter "your location"'
                    value={userData?.location ?? ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-root ': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 4px 0 #CBCBCB',
                      },
                    }}
                  />
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  sx={{ display: 'flex', justifySelf: 'flex-end' }}
                >
                  {loading ? <CircularProgress /> : 'Save'}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Detailed Activity Streaks Section */}
          <Box sx={{ mt: 3, mx: 3 }}>
            <ActivityStreaks variant="detailed" />
          </Box>
        </Box>
      )}
    </>
  )
}
