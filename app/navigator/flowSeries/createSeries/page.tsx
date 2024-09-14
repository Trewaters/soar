'use client'
import React from 'react'
import { useFlowSeries } from '@app/context/AsanaSeriesContext'
import { FEATURES } from '@app/FEATURES'
import PostureData from '@app/interfaces/postureData'
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import NavigationIcon from '@mui/icons-material/Navigation'
import { LooksOne } from '@mui/icons-material'
import LooksTwoIcon from '@mui/icons-material/LooksTwo'
import Looks3Icon from '@mui/icons-material/Looks3'
import Looks4Icon from '@mui/icons-material/Looks4'
import Looks5Icon from '@mui/icons-material/Looks5'

export default function Page() {
  const { data: session } = useSession()
  const { state, dispatch } = useFlowSeries()
  const { seriesName, seriesPostures, breath, description, duration, image } =
    state.flowSeries

  // posture data
  const [postures, setPostures] = useState<PostureData[]>([])

  useEffect(() => {
    async function fetchData() {
      // const baseUrl =
      //   process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      // const url = new URL('/api/series/', baseUrl)
      // const res = await fetch(url.toString())
      // const data = await res.json()
      // const seriesData = Array.isArray(data) ? data : [data]
      // setSeries(JSON.parse(JSON.stringify(seriesData)))
      try {
        const response = await fetch('/api/poses')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setPostures(await response.json())
      } catch (error: Error | any) {
        error.message
      }
    }

    fetchData()
  }, [session])

  function handleSelect(event: ChangeEvent<{}>, value: PostureData | null) {
    // Logs the type of event (e.g., 'click')
    // Logs the element that triggered the event
    event.preventDefault()
    if (value) {
      dispatch({
        type: 'SET_FLOW_SERIES',
        payload: {
          ...state.flowSeries,
          seriesPostures: [
            ...state.flowSeries.seriesPostures,
            value.english_name,
          ],
        },
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const updatedSeries = {
      ...state.flowSeries,
      seriesName,
      seriesPostures,
      breath,
      description,
      duration,
      image,
    }
    dispatch({ type: 'SET_FLOW_SERIES', payload: updatedSeries })

    try {
      const response = await fetch('/api/series/createSeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSeries),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
    } catch (error: Error | any) {
      error.message
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({
      type: 'SET_FLOW_SERIES',
      payload: {
        ...state.flowSeries,
        [name]: value,
      },
    })
  }

  return (
    <Stack
      spacing={2}
      flexDirection={'column'}
      sx={{ marginX: 3, marginY: 3, background: 'white', mb: '1em' }}
    >
      <>
        {FEATURES.SHOW_CREATE_SERIES && (
          <>
            <Stack flexDirection={'column'}>
              <Typography variant="h2" textAlign="center">
                Create a Series
              </Typography>
              <List
                sx={{
                  width: 'auto',
                  // maxWidth: 360,
                  bgcolor: 'background.helper',
                  alignSelf: 'center',
                  borderRadius: 4,
                  my: 3,
                }}
              >
                <ListSubheader
                  sx={{ bgcolor: 'background.helper', textAlign: 'center' }}
                  component="h3"
                  id="nested-list-subheader"
                >
                  Welcome to the series creation page
                </ListSubheader>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LooksOne />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="If you can't find a series you like, create your own!" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LooksTwoIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='"Series Name": Type a unique name for your series.' />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Looks3Icon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='"Flow Series": Add asana postures to
                  your series by selecting them from the "Flow Series"
                  dropdown below. Click the "X" to enter a new posture.'
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Looks4Icon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='"Description": Type a description of your series.' />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Looks5Icon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Click "Submit" when you are done.' />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                href="/navigator/flowSeries"
                LinkComponent="a"
                sx={{ my: 3, display: 'block' }}
              >
                Back to flow
              </Button>
            </Stack>

            <Grid container flexDirection={'column'}>
              <FormGroup>
                <FormControl>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <TextField
                      sx={{ width: '100%' }}
                      id="outlined-basic"
                      label="Series Name"
                      variant="outlined"
                      name="seriesName"
                      value={seriesName}
                      onChange={handleChange}
                    />
                  </Grid>
                </FormControl>

                <Grid
                  item
                  xs={12}
                  display={'flex'}
                  direction={'column'}
                  sx={{ mb: 2 }}
                >
                  <FormControl>
                    <Stack
                      spacing={1}
                      direction={'row'}
                      flexWrap={'wrap'}
                      display={'flex'}
                      sx={{
                        mx: 4,
                        mb: 2,
                      }}
                    >
                      {seriesPostures.map((word, index) => (
                        <Box
                          key={`${word}+${index}`}
                          display={'flex'}
                          sx={{
                            alignItems: 'center',
                            // border: '1px solid #ccc',
                            pl: 2,
                          }}
                        >
                          <Typography key={word} variant="h3">
                            {word}
                          </Typography>
                          <IconButton
                            disabled
                            sx={{
                              transform: 'rotate(90deg)',
                            }}
                          >
                            <NavigationIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </FormControl>
                </Grid>
                <FormControl>
                  <Autocomplete
                    sx={{ mb: 2 }}
                    disablePortal
                    id="combo-box-series-search"
                    options={postures}
                    getOptionLabel={(option: PostureData) =>
                      option.english_name
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.english_name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Flow Series" />
                    )}
                    onChange={handleSelect}
                  />
                </FormControl>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      label="Description"
                      sx={{ width: '95vw' }}
                      multiline
                      variant="outlined"
                      name="description"
                      value={description}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={session === null}
                    >
                      Submit
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </FormGroup>
            </Grid>
          </>
        )}
      </>
    </Stack>
  )
}
