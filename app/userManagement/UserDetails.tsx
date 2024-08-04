'use client'
import React, { useEffect } from 'react'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  IconButtonProps,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { red } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import MapIcon from '@mui/icons-material/Map'
import LinkIcon from '@mui/icons-material/Link'
import { useSession } from 'next-auth/react'
import { UseUser } from '@app/context/UserContext'
import Link from 'next/link'

// profile card
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default function UserDetails() {
  const { data: session } = useSession()
  const {
    state: { userData },
    dispatch,
  } = UseUser()

  const [expanded, setExpanded] = React.useState(false)

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
      throw new Error(`Error updating user data: ${error}`)
    }
  }
  const membershipDate = new Date(userData?.createdAt).toLocaleDateString()

  return (
    <Grid
      container
      spacing={4}
      direction="row"
      justifyContent={'center'}
      sx={{ p: 2 }}
      component={'form'}
      onSubmit={handleSubmit}
    >
      {!session && <div>Sign In</div>}
      {session && (
        <>
          <Button type="submit">Save</Button>
          <Grid xs={12} item>
            <Typography variant="h2">Yogi Profile</Typography>
          </Grid>
          <Grid xs={12} item>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="name initial">
                    {userData?.name?.charAt(0) ?? 'U'}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={userData?.name ?? 'Yogi Name'}
                subheader={`Member since ${membershipDate ?? '6/9/2024'}`}
              />
              <CardMedia
                component="img"
                src={userData?.image ?? '/stick-tree-pose-400x400.png'}
                alt="Profile Image"
                sx={{
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  margin: 'auto',
                }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {userData?.headline ?? 'What does yoga mean to you?'}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" disabled>
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share" disabled>
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
              <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                // sx={{
                //   maxWidth: '70vw',
                //   // width: '70vw',
                // }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Share Quickly: </Typography>
                    <Typography variant="body1">
                      Information about yourself.
                    </Typography>
                  </Stack>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="body1">[YOGA_STYLE]</Typography>
                    <Typography variant="body1">[YOGA_EXPERIENCE]</Typography>
                    <Typography variant="body1">[userCompany]</Typography>
                    <Stack direction="row" spacing={2}>
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
                  <Stack direction="row" spacing={2}>
                    {/* 
                      // TODO: add a way to update the location
                      */}
                    <MapIcon />
                    <Typography>{userData.location ?? ''}</Typography>
                  </Stack>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <TextField
                name="name"
                id="outlined-basic"
                placeholder='Enter "First Name"'
                label="Name"
                value={userData?.name ?? ''}
                variant="outlined"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid xs={6} sm={6} md={6} item>
            <FormControl>
              <TextField
                name="firstName"
                id="outlined-basic"
                placeholder='Enter "First Name"'
                label="First Name"
                value={userData.firstName ?? ''}
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid xs={6} sm={6} md={6} item>
            <FormControl>
              <TextField
                required
                name="lastName"
                id="outlined-basic"
                placeholder='Enter "Last Name"'
                label="Last Name"
                value={userData.lastName ?? ''}
                onChange={handleChange}
                variant="outlined"
                type="text"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl>
              <TextField
                name="pronouns"
                id="pronouns"
                label="Pronouns:"
                variant="outlined"
                value={userData?.pronouns ?? ''}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl fullWidth>
              <TextField
                id="outlined-email-input"
                name="email"
                placeholder="xyz@ABC.com"
                label="Email (primary/internal):"
                value={userData?.email ?? ''}
                variant="outlined"
                type="email"
                disabled
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl fullWidth>
              <TextField
                id="outlined-textarea"
                name="headline"
                placeholder="Enter...2 sentences"
                label="Headline:"
                value={userData?.headline ?? 'I am a Yoga instructor.'}
                onChange={handleChange}
                multiline
                maxRows={2}
              />
            </FormControl>
            {/* I am a happy Yoga instructor, happy Reiki Master, and creator of the Happy Yoga app. */}
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormControl fullWidth>
              <TextField
                id="outlined-biography"
                name="bio"
                placeholder="Enter...Bio"
                label="Description/About/Bio:"
                value={userData?.bio ?? ''}
                onChange={handleChange}
                multiline
                maxRows={4}
              />
            </FormControl>
            {/* 'I am a yoga instructor. A software engineer bringing yoga to practitioners. A Reiki master who builds strength through practice. A father, husband, and son.' */}
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormControl>
              <TextField
                name="websiteURL"
                id="outlined-webisite-url-input"
                placeholder="www.WebsiteUrl.com"
                label="Website URL"
                value={userData?.websiteURL ?? ''}
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormControl>
              <TextField
                name="location"
                id="outlined-webisite-url-input"
                placeholder='Enter "your location"'
                label="location"
                value={userData?.location ?? ''}
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
          </Grid>
        </>
      )}
    </Grid>
  )
}
