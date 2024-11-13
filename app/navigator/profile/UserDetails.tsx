// 'use client'
// import React, { useEffect } from 'react'
// import {
//   Avatar,
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   CardHeader,
//   CardMedia,
//   Collapse,
//   FormControl,
//   Grid,
//   IconButton,
//   IconButtonProps,
//   Stack,
//   styled,
//   TextField,
//   Typography,
// } from '@mui/material'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import { red } from '@mui/material/colors'
// import MoreVertIcon from '@mui/icons-material/MoreVert'
// import FavoriteIcon from '@mui/icons-material/Favorite'
// import ShareIcon from '@mui/icons-material/Share'
// import MapIcon from '@mui/icons-material/Map'
// import LinkIcon from '@mui/icons-material/Link'
// import { useSession } from 'next-auth/react'
// import { UseUser } from '@context/UserContext'
// import Link from 'next/link'

// // // profile card
// interface ExpandMoreProps extends IconButtonProps {
//   expand: boolean
// }

// const ExpandMore = styled((props: ExpandMoreProps) => {
//   const { expand, ...other } = props
//   return <IconButton {...other} />
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }))

// export default function UserDetails() {
//   const { data: session } = useSession()
//   const {
//     state: { userData },
//     dispatch,
//   } = UseUser()

//   const [expanded, setExpanded] = React.useState(false)

//   const handleExpandClick = () => {
//     setExpanded(!expanded)
//   }

//   useEffect(() => {
//     if (!session) return
//     if (session?.user?.email && userData?.email !== session.user.email) {
//       dispatch({
//         type: 'SET_USER',
//         payload: { ...userData, email: session.user.email },
//       })
//     }
//   }, [session, dispatch, userData])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     console.log('name:', name, 'value:', value)
//     dispatch({ type: 'SET_USER', payload: { ...userData, [name]: value } })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch(
//         `/api/user/updateUserData/?email=${userData.email}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//         }
//       )

//       if (!response.ok) {
//         throw new Error('Failed to update user data')
//       }

//       const updatedUser = await response.json()
//       dispatch({ type: 'SET_USER', payload: updatedUser })
//     } catch (error) {
//       throw new Error(`Error updating user data: ${error}`)
//     }
//   }
//   const membershipDate = new Date(userData?.createdAt).toLocaleDateString()

//   return (
//     <>
//       {!session && (
//         <Stack direction="column" spacing={2}>
//           <Typography variant="h2">Sign In</Typography>
//           <Typography variant="body1">
//             Please sign in to view your profile.
//           </Typography>
//         </Stack>
//       )}
//       {session && (
//         <Grid
//           container
//           spacing={4}
//           sx={{ p: 4 }}
//           component={'form'}
//           onSubmit={handleSubmit}
//           width={'100vw'}
//         >
//           <Grid size={12} item sx={{ display: 'flex', justifyContent: 'center' }}>
//             <Button type="submit">Save</Button>
//           </Grid>
//           <Grid size={12}>
//             <Typography variant="h2">Yogi Profile</Typography>
//           </Grid>
//           <Grid size={12}>
//             <Card>
//               <CardHeader
//                 avatar={
//                   <Avatar sx={{ bgcolor: red[500] }} aria-label="name initial">
//                     {userData?.name?.charAt(0) ?? 'U'}
//                   </Avatar>
//                 }
//                 action={
//                   <IconButton aria-label="settings">
//                     <MoreVertIcon />
//                   </IconButton>
//                 }
//                 title={userData?.name ?? 'Yogi Name'}
//                 subheader={`Member since ${membershipDate ?? '6/9/2024'}`}
//               />
//               <CardMedia
//                 component="img"
//                 src={userData?.image ?? '/stick-tree-pose-400x400.png'}
//                 alt="Profile Image"
//                 sx={{
//                   width: 'auto',
//                   height: 'auto',
//                   display: 'block',
//                   margin: 'auto',
//                 }}
//               />
//               <CardContent>
//                 <Typography variant="body2" color="text.secondary">
//                   {userData?.headline ?? 'What does yoga mean to you?'}
//                 </Typography>
//               </CardContent>
//               <CardActions disableSpacing>
//                 <IconButton aria-label="add to favorites" disabled>
//                   <FavoriteIcon />
//                 </IconButton>
//                 <IconButton aria-label="share" disabled>
//                   <ShareIcon />
//                 </IconButton>
//                 <ExpandMore
//                   expand={expanded}
//                   onClick={handleExpandClick}
//                   aria-expanded={expanded}
//                   aria-label="show more"
//                 >
//                   <ExpandMoreIcon />
//                 </ExpandMore>
//               </CardActions>
//               <Collapse
//                 in={expanded}
//                 timeout="auto"
//                 unmountOnExit
//                 // sx={{
//                 //   maxWidth: '70vw',
//                 //   // width: '70vw',
//                 // }}
//               >
//                 <CardContent>
//                   <Stack direction="row" spacing={2}>
//                     <Typography variant="body1">Share Quickly: </Typography>
//                     {/* <Typography variant="body1">
//                       Information about yourself.
//                     </Typography> */}
//                     <FormControl>
//                       <TextField
//                         name="ShareQuick"
//                         id="outlined-basic"
//                         placeholder='Share "Quickly"'
//                         label="Share Quickly"
//                         value={userData.shareQuick ?? ''}
//                         variant="outlined"
//                         onChange={handleChange}
//                       />
//                     </FormControl>
//                   </Stack>

//                   <Stack direction="row" spacing={2}>
//                     <Typography variant="body1">Yoga Style: </Typography>
//                     <FormControl>
//                       <TextField
//                         name="yogaStyle"
//                         id="outlined-basic"
//                         placeholder='Enter "Yoga Style"'
//                         label="Yoga Style"
//                         value={userData.yogaStyle ?? ''}
//                         variant="outlined"
//                         onChange={handleChange}
//                       />
//                     </FormControl>
//                   </Stack>

//                   <Stack direction="column" spacing={2}>
//                     <Typography variant="body1">[YOGA_STYLE]</Typography>
//                     <Typography variant="body1">[YOGA_EXPERIENCE]</Typography>
//                     <Typography variant="body1">[userCompany]</Typography>
//                     <Stack direction="row" spacing={2}>
//                       <LinkIcon />
//                       <Typography variant="body1">
//                         <Link
//                           href={
//                             userData.websiteURL?.startsWith('http')
//                               ? userData.websiteURL
//                               : `https://${userData.websiteURL}`
//                           }
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {userData.websiteURL}
//                         </Link>
//                       </Typography>
//                     </Stack>
//                   </Stack>
//                   <Stack direction="row" spacing={2}>
//                     {/*
//                       // TODO: add a way to update the location
//                       */}
//                     <MapIcon />
//                     <Typography>{userData.location ?? ''}</Typography>
//                   </Stack>
//                 </CardContent>
//               </Collapse>
//             </Card>
//           </Grid>
//           <Grid size={12}>
//             <FormControl>
//               <TextField
//                 name="name"
//                 id="outlined-basic"
//                 // placeholder='Enter "First Name"'
//                 label="Name"
//                 value={userData?.name ?? ''}
//                 variant="outlined"
//                 disabled
//               />
//             </FormControl>
//           </Grid>
//           <Grid size={6}>
//             <FormControl>
//               <TextField
//                 name="firstName"
//                 id="outlined-basic"
//                 placeholder='Enter "First Name"'
//                 label="First Name"
//                 value={userData.firstName ?? ''}
//                 onChange={handleChange}
//                 variant="outlined"
//               />
//             </FormControl>
//           </Grid>
//           <Grid size={6}>
//             <FormControl>
//               <TextField
//                 required
//                 name="lastName"
//                 id="outlined-basic"
//                 placeholder='Enter "Last Name"'
//                 label="Last Name"
//                 value={userData.lastName ?? ''}
//                 onChange={handleChange}
//                 variant="outlined"
//                 type="text"
//               />
//             </FormControl>
//           </Grid>
//           <Grid size={12}>
//             <FormControl>
//               <TextField
//                 name="pronouns"
//                 id="pronouns"
//                 label="Pronouns:"
//                 variant="outlined"
//                 value={userData?.pronouns ?? ''}
//                 onChange={handleChange}
//               />
//             </FormControl>
//           </Grid>
//           <Grid size={12}>
//             <FormControl fullWidth>
//               <TextField
//                 id="outlined-email-input"
//                 name="email"
//                 placeholder="xyz@ABC.com"
//                 label="Email (primary/internal):"
//                 value={userData?.email ?? ''}
//                 variant="outlined"
//                 type="email"
//                 disabled
//               />
//             </FormControl>
//           </Grid>
//           <Grid size={12}>
//             <FormControl fullWidth>
//               <TextField
//                 id="outlined-textarea"
//                 name="headline"
//                 placeholder="Enter...2 sentences"
//                 label="Headline:"
//                 value={userData?.headline ?? 'I am a Yoga instructor.'}
//                 onChange={handleChange}
//                 multiline
//                 maxRows={2}
//               />
//             </FormControl>
//             {/* I am a happy Yoga instructor, happy Reiki Master, and creator of the Happy Yoga app. */}
//           </Grid>
//           <Grid size={12}>
//             <FormControl fullWidth>
//               <TextField
//                 id="outlined-biography"
//                 name="bio"
//                 placeholder="Enter...Bio"
//                 label="Description/About/Bio:"
//                 value={userData?.bio ?? ''}
//                 onChange={handleChange}
//                 multiline
//                 maxRows={4}
//               />
//             </FormControl>
//             {/* 'I am a yoga instructor. A software engineer bringing yoga to practitioners. A Reiki master who builds strength through practice. A father, husband, and son.' */}
//           </Grid>
//           <Grid size={12} sm={6} md={6}>
//             <FormControl>
//               <TextField
//                 name="websiteURL"
//                 id="outlined-webisite-url-input"
//                 placeholder="www.WebsiteUrl.com"
//                 label="Website URL"
//                 value={userData?.websiteURL ?? ''}
//                 onChange={handleChange}
//                 variant="outlined"
//               />
//             </FormControl>
//           </Grid>
//           <Grid size={12} sm={6} md={6}>
//             <FormControl>
//               <TextField
//                 name="location"
//                 id="outlined-webisite-url-input"
//                 placeholder='Enter "your location"'
//                 label="location"
//                 value={userData?.location ?? ''}
//                 onChange={handleChange}
//                 variant="outlined"
//               />
//             </FormControl>
//           </Grid>
//         </Grid>
//       )}
//     </>
//   )
// }

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

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line no-unused-vars
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }: { theme: any; expand: boolean }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default function UserDetails() {
  // ! disable session while working on the UI
  // const { data: session } = useSession()
  const session = React.useMemo(() => ({ user: { email: '' } }), [])

  const {
    state: { userData },
    dispatch,
  } = UseUser()

  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    if (!session) return
    if (session?.user?.email && userData?.email !== session.user.email) {
      dispatch({
        type: 'SET_USER',
        payload: { ...userData, email: session.user.email },
      })
    }
  }, [session, dispatch, userData])

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

  const handleShare = async () => {
    const shareData = {
      title: 'Happy Yoga',
      text: `Check out ${userData.firstName} ${userData.lastName}! ${userData.headline}; ${userData.shareQuick}; ${userData.yogaStyle}; ${userData.yogaExperience};  ${userData.company}; ${userData.websiteURL}; ${userData.location};`,
      url: window.location.href,
    }
    const resultPara = document.querySelector('.result')

    try {
      await navigator.clipboard.writeText(JSON.stringify(shareData))
      // console.log('Content copied to clipboard')

      if (navigator.share) {
        await navigator.share(shareData)
        // console.log('Content shared successfully')
      } else {
        // console.log('Web Share API not supported in this browser.')
        alert('Link copied to clipboard. Share it manually!')
      }
    } catch (error) {
      // console.error('Error sharing content:', error)
      if (resultPara) {
        resultPara.textContent = `Error: ${error}`
      }
    }
  }

  return (
    <>
      {error && (
        <Grid size={12} textAlign={'center'}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}
      {!session && (
        <Stack direction="column" spacing={2}>
          <Typography variant="h2">Sign In</Typography>
          <Typography variant="body1">
            Please sign in to view your profile.
          </Typography>
        </Stack>
      )}
      {session && (
        <Box sx={{ flexGrow: 1, justifyItems: 'center' }}>
          <Paper elevation={1} sx={{ p: 2, width: '80%' }}>
            <Grid
              container
              spacing={3}
              sx={{ p: 4 }}
              // component={'form'}
              // onSubmit={handleSubmit}
              // width={'100vw'}
            >
              <Grid size={6}>
                <Typography variant="h2" color="primary.main">
                  Yoga Practitioner
                </Typography>
              </Grid>
              <Grid size={6}>
                <Image
                  src={'/icons/profile/leaf-profile.svg'}
                  width={50}
                  height={50}
                  alt="Yoga Practitioner icon"
                />
              </Grid>
              <Grid size={1} sx={{ pt: 1 }}>
                <Avatar sx={{ bgcolor: red[500] }} aria-label="name initial">
                  {userData?.image ?? (
                    <>
                      <Image
                        src={'/icons/profile/profile-person.svg'}
                        width={50}
                        height={50}
                        alt="Generic profile image icon"
                      />
                    </>
                  )}
                </Avatar>
              </Grid>
              <Grid size={11} sx={{ pb: 4 }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {userData?.name ?? 'Yogi Name'}
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  Member since {membershipDate ?? '6/9/2024'}
                </Typography>
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
                <FormControl fullWidth>
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
                <FormControl fullWidth>
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
                <FormControl fullWidth>
                  <Typography variant="body1">
                    Description/About/Bio:
                  </Typography>
                  <TextField
                    id="biography-text-input"
                    name="biography"
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
              <Grid size={6}>
                <FormControl fullWidth>
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
              <Grid size={6}>
                <FormControl fullWidth>
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
              <Grid
                size={12}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button type="submit" disabled={loading} variant="contained">
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
