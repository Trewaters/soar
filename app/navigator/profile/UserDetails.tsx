'use client'
import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  IconButtonProps,
  styled,
  Autocomplete,
  Tooltip,
  Paper,
  Box,
  FormHelperText,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { red } from '@mui/material/colors'
import ShareIcon from '@mui/icons-material/Share'
import MapIcon from '@mui/icons-material/Map'
import LinkIcon from '@mui/icons-material/Link'
import { useSession } from 'next-auth/react'
import { UseUser } from '@context/UserContext'
import Link from 'next/link'
import MyMap from '@app/clientComponents/googleMaps'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
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

export default function UserDetails() {
  // ! disable session while working on the UI
  const { data: session } = useSession()
  // const session = React.useMemo(() => ({ user: { email: '' } }), [])

  const router = useRouter()
  const {
    state: { userData },
    dispatch,
  } = UseUser()

  // const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileImageMode, setProfileImageMode] = useState<
    'active' | 'inactive' | 'edit'
  >('active')

  // const handleExpandClick = () => {
  //   setExpanded(!expanded)
  // }

  useEffect(() => {
    if (session?.user?.email && userData?.email !== session.user.email) {
      dispatch({
        type: 'SET_USER',
        payload: { ...userData, email: session.user.email },
      })
    }
    setProfileImageMode('active')
  }, [session, dispatch, userData])

  if (!session) {
    return (
      <Button variant="outlined" onClick={() => router.push('/auth/signin')}>
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

  // const handleShare = async () => {
  //   const shareData = {
  //     title: 'Happy Yoga',
  //     text: `Check out ${userData.firstName} ${userData.lastName}! ${userData.headline}; ${userData.shareQuick}; ${userData.yogaStyle}; ${userData.yogaExperience};  ${userData.company}; ${userData.websiteURL}; ${userData.location};`,
  //     url: window.location.href,
  //   }
  //   const resultPara = document.querySelector('.result')

  //   try {
  //     await navigator.clipboard.writeText(JSON.stringify(shareData))
  //     // console.log('Content copied to clipboard')

  //     if (navigator.share) {
  //       await navigator.share(shareData)
  //       // console.log('Content shared successfully')
  //     } else {
  //       // console.log('Web Share API not supported in this browser.')
  //       alert('Link copied to clipboard. Share it manually!')
  //     }
  //   } catch (error) {
  //     // console.error('Error sharing content:', error)
  //     if (resultPara) {
  //       resultPara.textContent = `Error: ${error}`
  //     }
  //   }
  // }

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
            <Grid
              container
              spacing={3}
              sx={{ p: 3 }}
              component={'form'}
              onSubmit={handleSubmit}
            >
              <Grid size={{ xs: 8 }}>
                <Typography variant="h2" color="primary.main">
                  Yoga Practitioner
                </Typography>
              </Grid>
              <Grid display={'flex'} alignItems={'center'} size={{ xs: 4 }}>
                <Image
                  src={'/icons/profile/leaf-profile.svg'}
                  width={50}
                  height={50}
                  alt="Yoga Practitioner icon"
                />
              </Grid>

              <Grid size={3}>
                <Avatar
                  sx={{
                    bgcolor: red[500],
                    width: { xs: '100%', md: '100%' },
                    height: { xs: '69%', md: '81%' },
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
                  <Image
                    src={'/icons/profile/profile-image-active.svg'}
                    alt="Active profile image icon"
                    width={27}
                    height={27}
                    style={{
                      position: 'relative',
                      bottom: '30%',
                      left: '80%',
                      cursor: 'pointer',
                    }}
                  />
                )}
                {profileImageMode === 'inactive' && (
                  <Image
                    src={'/icons/profile/profile-image-inactive.svg'}
                    width={50}
                    height={50}
                    alt="Inactive profile image icon"
                  />
                )}
                {profileImageMode === 'edit' && (
                  <Image
                    src={'/icons/profile/profile-image-edit.svg'}
                    width={50}
                    height={50}
                    alt="Edit profile image icon"
                  />
                )}
              </Grid>
              <Grid
                size={9}
                pt={2}
                // display={'flex'}
                // justifyContent={'flex-start'}
              >
                <Stack justifyContent={'center'}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {userData?.name ?? 'Yogi Name'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    Member since {membershipDate ?? '6/9/2024'}
                  </Typography>
                </Stack>
                {/* 
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
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems={'center'}
                        >
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
                        <MyMap />
                      </Stack>
                    </CardContent>
                  </Collapse>
                </Card>
                 */}
              </Grid>
              <Grid size={12}>
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
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl>
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
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl>
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
              </Grid>
              <Grid size={12}>
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
              </Grid>
              <Grid size={12}>
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
                    Your email address cannot be changed. Contact us for
                    support.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={12}>
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
              </Grid>
              <Grid size={12}>
                <FormControl sx={{ width: '80%' }}>
                  <Typography variant="body1">
                    Description/About/Bio:
                  </Typography>
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
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl sx={{ width: '100%' }}>
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
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl sx={{ width: '60%' }}>
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
              </Grid>
              <Grid size={9}>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  sx={{ display: 'flex', justifySelf: 'flex-end' }}
                >
                  {loading ? <CircularProgress /> : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </>
  )
}
