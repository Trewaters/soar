'use client'
import React from 'react'
import { useFlowSeries } from '@app/context/AsanaSeriesContext'
import { FEATURES } from '@app/FEATURES'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  Grid2,
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
import { LooksOne } from '@mui/icons-material'
import LooksTwoIcon from '@mui/icons-material/LooksTwo'
import Looks3Icon from '@mui/icons-material/Looks3'
import Looks4Icon from '@mui/icons-material/Looks4'
import Looks5Icon from '@mui/icons-material/Looks5'
import { useRouter } from 'next/navigation'
import { getAccessiblePoses } from '@lib/poseService'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SplashHeader from '@app/clientComponents/splash-header'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AutocompleteComponent from '@app/clientComponents/autocomplete-search'
import Image from 'next/image'
import { AppText } from '@app/navigator/constants/Strings'
import {
  formatSeriesPoseEntry,
  splitSeriesPoseEntry,
} from '@app/utils/asana/seriesPoseLabels'
import { AsanaPose } from 'types/asana'
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'
import type { PoseImageData } from '@app/clientComponents/imageUpload/ImageUpload'
import ImageIcon from '@mui/icons-material/Image'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function Page() {
  const { data: session } = useSession()
  const { state, dispatch } = useFlowSeries()
  const { seriesName, seriesPoses, breath, description, duration, image } =
    state.flowSeries
  const [poses, setPoses] = useState<AsanaPose[]>([])
  const [uploadedImages, setUploadedImages] = useState<PoseImageData[]>([])
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isDirtyDescription, setIsDirtyDescription] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const fetchPoses = React.useCallback(async () => {
    try {
      const poses = await getAccessiblePoses(session?.user?.email || undefined)
      setPoses(poses)
    } catch (error: Error | any) {
      console.error('Error fetching poses:', error.message)
    }
  }, [session?.user?.email])

  useEffect(() => {
    // console.log('create series session', session)

    if (
      session === null
      // ||
      // (session &&
      //   session.status === 'resolved_model' &&
      //   session.value === 'null')
    ) {
      router.push('/navigator/flows')
    }

    fetchPoses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, session])

  // Debug effect to monitor uploadedImages state changes
  useEffect(() => {
    console.log('📸 uploadedImages state changed:', uploadedImages)
  }, [uploadedImages])

  // Refetch poses when the page becomes visible (e.g., when returning from create asana page)
  // This ensures that newly created asanas appear in the autocomplete search
  const handleVisibilityChange = React.useCallback(() => {
    if (!document.hidden) {
      console.log('Page became visible, refreshing pose data...')
      fetchPoses()
    }
  }, [fetchPoses])

  const handleFocus = React.useCallback(() => {
    console.log('Window gained focus, refreshing pose data...')
    fetchPoses()
  }, [fetchPoses])

  const handlePopState = React.useCallback(() => {
    console.log('Navigation detected, refreshing pose data...')
    fetchPoses()
  }, [fetchPoses])

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('popstate', handlePopState)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('popstate', handlePopState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVisibilityChange, handleFocus, handlePopState])

  function handleSelect(
    event: React.SyntheticEvent<Element, Event>,
    value: AsanaPose | null
  ) {
    event.preventDefault()
    if (value) {
      const simplifiedName =
        Array.isArray(value.sanskrit_names) && value.sanskrit_names[0]
          ? value.sanskrit_names[0]
          : ''
      const formattedEntry = formatSeriesPoseEntry(
        value.sort_english_name,
        simplifiedName
      )
      dispatch({
        type: 'SET_FLOW_SERIES',
        payload: {
          ...state.flowSeries,
          seriesPoses: [...state.flowSeries.seriesPoses, formattedEntry],
        },
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const updatedSeries = {
      ...state.flowSeries,
      seriesName,
      seriesPoses,
      breath,
      description,
      duration,
      image,
    }
    dispatch({ type: 'SET_FLOW_SERIES', payload: updatedSeries })
    dispatch({
      type: 'RESET_FLOW_SERIES',
      payload: {
        seriesName: '',
        seriesPoses: [],
        breath: '',
        description: '',
        duration: '',
        image: '',
      },
    })

    try {
      const response = await fetch('/api/series/createSeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cache: 'no-store',
        },
        body: JSON.stringify(updatedSeries),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      // Redirect to the series detail page if we got an ID back
      if (data.id) {
        router.push(`/navigator/flows/practiceSeries?id=${data.id}`)
        return
      }

      return data
    } catch (error: Error | any) {
      console.error('Error creating series:', error.message)
    }
    // Fallback to flows page if something went wrong
    router.push('/navigator/flows')
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
    switch (name) {
      case 'seriesName':
        setIsDirty(value.length > 0)

        break
      case 'description':
        setIsDirtyDescription(event.target.value.length > 0)

        break
      default:
        break
    }
  }

  const handleImageUploaded = (img: PoseImageData) => {
    console.log('📸 Image uploaded callback received:', img)
    // Only keep one image - replace the array instead of appending
    setUploadedImages([img])
    console.log('📸 Series image set:', img)
    dispatch({
      type: 'SET_FLOW_SERIES',
      payload: {
        ...state.flowSeries,
        image: img.url,
      },
    })
  }

  function handleCancel() {
    dispatch({
      type: 'RESET_FLOW_SERIES',
      payload: {
        seriesName: '',
        seriesPoses: [],
      },
    })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
          mb: 4,
        }}
      >
        <Stack spacing={2} sx={{ marginX: 3, mb: '1em', width: 'fit-content' }}>
          <SplashHeader
            src={'/icons/designImages/header-create-series.png'}
            alt={'Create Series'}
            title="Create Series"
          />
          <SubNavHeader
            title="Flows"
            link="/navigator/flows"
            onClick={toggleDrawer(!open)}
          />
          {FEATURES.SHOW_CREATE_SERIES && (
            <form onSubmit={handleSubmit}>
              <Box sx={{ px: 4 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <AutocompleteComponent
                    options={poses.sort((a, b) =>
                      a.sort_english_name.localeCompare(b.sort_english_name)
                    )}
                    getOptionLabel={(option) =>
                      (option as AsanaPose).sort_english_name
                    }
                    renderOption={(props, option) => {
                      const poseOption = option as AsanaPose
                      return (
                        <li {...props} key={poseOption.id}>
                          {poseOption.sort_english_name}
                        </li>
                      )
                    }}
                    placeholder="Add a pose to your series"
                    onChange={(event, value) =>
                      handleSelect(event, value as AsanaPose | null)
                    }
                    renderInput={() => <TextField placeholder="Search..." />}
                  />
                </FormControl>
                <Box className="journal">
                  <FormControl>
                    <Grid2
                      size={12}
                      className="journalTitle"
                      display={'flex'}
                      direction={'row'}
                    >
                      <TextField
                        sx={{
                          '& .MuiInputBase-input': { color: 'primary.main' },
                          width: '100%',
                        }}
                        variant="standard"
                        id="series-name"
                        placeholder="Give your Series a name..."
                        name="seriesName"
                        value={seriesName}
                        onChange={handleChange}
                        InputProps={{
                          style: { color: 'primary.main' },
                        }}
                      />
                      <>
                        <Checkbox
                          checked={isDirty}
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      </>
                    </Grid2>
                    {/* <Grid2 size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDirty}
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label="Text field is dirty"
                    />
                  </Grid2> */}
                  </FormControl>

                  {/* Reference Images Section */}
                  <Grid2 size={12}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Series Image
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Upload one image to represent this series. This will
                        help identify your series in the library.
                      </Typography>

                      {uploadedImages.length === 0 ? (
                        <ImageManagement
                          title=""
                          variant="upload-only"
                          onImageUploaded={handleImageUploaded}
                          uploadTitle="Upload Series Image"
                          uploadSubtitle="Drag and drop an image here, or click to select (one image only)"
                        />
                      ) : (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="body2"
                            color="success.main"
                            gutterBottom
                          >
                            <CheckCircleIcon
                              sx={{
                                fontSize: 16,
                                mr: 0.5,
                                verticalAlign: 'middle',
                              }}
                            />
                            Series image uploaded successfully
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              maxWidth: 300,
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '2px solid',
                              borderColor: 'success.light',
                            }}
                          >
                            <Box
                              component="img"
                              src={uploadedImages[0].url}
                              alt={uploadedImages[0].altText || 'Series image'}
                              sx={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: 'success.lighter',
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                <ImageIcon sx={{ fontSize: 14 }} />
                                {uploadedImages[0].fileName || 'Series Image'}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              setUploadedImages([])
                              dispatch({
                                type: 'SET_FLOW_SERIES',
                                payload: {
                                  ...state.flowSeries,
                                  image: '',
                                },
                              })
                            }}
                            sx={{ mt: 2 }}
                          >
                            Remove Image
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Grid2>

                  <FormControl>
                    <Stack
                      className="lines"
                      spacing={1}
                      sx={{
                        mx: 4,
                      }}
                    >
                      {seriesPoses.map((entry, index) => {
                        // entry may be legacy string or new object
                        let name = ''
                        let secondary = ''
                        let alignmentCues = ''

                        if (typeof entry === 'string') {
                          const split = splitSeriesPoseEntry(entry)
                          name = split.name
                          secondary = split.secondary
                        } else if (entry && typeof entry === 'object') {
                          name = (entry as any).sort_english_name || ''
                          secondary = (entry as any).secondary || ''
                          alignmentCues = (entry as any).alignment_cues || ''
                        }

                        const handleRemove = () => {
                          dispatch({
                            type: 'SET_FLOW_SERIES',
                            payload: {
                              ...state.flowSeries,
                              seriesPoses: state.flowSeries.seriesPoses.filter(
                                (_, i) => i !== index
                              ),
                            },
                          })
                        }

                        const handleCueChange = (e: React.ChangeEvent<any>) => {
                          const newVal = e.target.value.slice(0, 1000)
                          const newSeries = state.flowSeries.seriesPoses.map(
                            (it, i) => {
                              if (i !== index) return it
                              if (typeof it === 'string') {
                                // convert legacy string to object when user edits cues
                                const s = splitSeriesPoseEntry(it)
                                return {
                                  poseId: undefined,
                                  sort_english_name: s.name,
                                  secondary: s.secondary,
                                  alignment_cues: newVal,
                                }
                              }
                              return {
                                ...(it as any),
                                alignment_cues: newVal,
                              }
                            }
                          )
                          dispatch({
                            type: 'SET_FLOW_SERIES',
                            payload: {
                              ...state.flowSeries,
                              seriesPoses: newSeries,
                            },
                          })
                        }

                        return (
                          <Stack
                            className="journalLine"
                            key={`${String(name)}+${index}`}
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 2,
                            }}
                          >
                            <Stack>
                              <IconButton
                                disableRipple
                                sx={{ color: 'error.light' }}
                                onClick={handleRemove}
                              >
                                <DeleteForeverIcon />
                              </IconButton>
                            </Stack>
                            <Stack sx={{ flex: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {name}
                              </Typography>
                              {secondary && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'bold',
                                    fontStyle: 'italic',
                                  }}
                                >
                                  {secondary}
                                </Typography>
                              )}
                              <TextField
                                placeholder="Optional alignment cues (max 1000 characters)"
                                variant="standard"
                                multiline
                                minRows={1}
                                value={alignmentCues}
                                onChange={handleCueChange}
                                inputProps={{
                                  maxLength: 1000,
                                  'data-testid': `alignment-cues-${index}`,
                                  'aria-label': `Alignment cues for ${name}`,
                                }}
                                sx={{ mt: 1 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary' }}
                              >
                                {alignmentCues.length}/1000
                              </Typography>
                            </Stack>
                          </Stack>
                        )
                      })}
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      sx={{ mt: 3 }}
                    >
                      {/* 
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          dispatch({
                            type: 'SET_FLOW_SERIES',
                            payload: {
                              ...state.flowSeries,
                              seriesPoses:
                                state.flowSeries.seriesPoses.slice(0, -1),
                            },
                          })
                        }
                      >
                        <Typography>Remove One (-1)</Typography>
                      </Button>
 */}
                      {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        dispatch({
                          type: 'SET_FLOW_SERIES',
                          payload: {
                            ...state.flowSeries,
                            seriesPoses: [],
                          },
                        })
                      }
                    >
                      Clear
                    </Button> */}
                    </Stack>
                  </FormControl>
                  <Grid2 size={12} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={session === null}
                        sx={{ borderRadius: '12px' }}
                      >
                        {AppText.APP_BUTTON_SUBMIT}
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        sx={{
                          color: 'primary.contrastText',
                          borderRadius: '12px',
                        }}
                        onClick={handleCancel}
                      >
                        Start Over
                      </Button>
                    </Stack>
                  </Grid2>

                  <Grid2 size={12} sx={{ mb: 2, mx: 2 }}>
                    <FormControl
                      sx={{
                        width: '100%',
                        border: '1px solid black',
                        borderRadius: '12px',
                        p: 2,
                      }}
                    >
                      <Stack
                        gap={2}
                        flexDirection={'row'}
                        alignItems={'center'}
                      >
                        <Typography color={'primary.main'} variant="h3">
                          Description
                        </Typography>
                        <Image
                          src={'/icons/designImages/leaf-2.svg'}
                          alt={'leaf icon'}
                          height={21}
                          width={21}
                        ></Image>
                      </Stack>
                      <TextField
                        id="outlined-basic"
                        // label="Description"
                        placeholder="Type a description..."
                        multiline
                        minRows={4}
                        variant="standard"
                        name="description"
                        value={description}
                        onChange={handleChange}
                        sx={{
                          '& .MuiInputBase-input': { color: 'primary.main' },
                          width: '100%',
                        }}
                        InputProps={{
                          endAdornment: (
                            <Checkbox
                              checked={isDirtyDescription}
                              onChange={handleChange}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: 'primary.main',
                                '&.Mui-checked': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid2>
                </Box>
              </Box>
            </form>
          )}
        </Stack>
        {/* information drawer */}
        <Drawer
          onClick={toggleDrawer(!open)}
          open={open}
          onClose={toggleDrawer(false)}
          anchor="bottom"
        >
          <Stack flexDirection={'column'}>
            <Typography variant="h2" textAlign="center">
              Create a Series
            </Typography>
            <List
              sx={{
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
                <ListItemText
                  primary={
                    "If you can't find a series you like, create your own!"
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LooksTwoIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={'"Series Name": Type a unique name for your series.'}
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Looks3Icon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    '"Image Upload": Optionally add an image to represent your series.'
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Looks4Icon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    '"Flow Series": Add asana poses to your series by selecting them from the "Flow Series" dropdown below.'
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Looks5Icon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={'"Description": Type a description of your series.'}
                />
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Looks5Icon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Click "${AppText.APP_BUTTON_SUBMIT}" when you are done.`}
                />
              </ListItem>
            </List>
          </Stack>
        </Drawer>
      </Box>
      {/* 
      TODO: add snackbar message for success/failure no
      */}
    </>
  )
}
