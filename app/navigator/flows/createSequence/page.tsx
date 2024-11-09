'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { SequenceData } from '@context/SequenceContext'
import { FEATURES } from '@app/FEATURES'
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  IconButton,
  Drawer,
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Typography,
  ListItemIcon,
  Checkbox,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { LooksOne } from '@mui/icons-material'
import LooksTwoIcon from '@mui/icons-material/LooksTwo'
import Looks3Icon from '@mui/icons-material/Looks3'
import Looks4Icon from '@mui/icons-material/Looks4'
import Looks5Icon from '@mui/icons-material/Looks5'
import { useRouter } from 'next/navigation'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import SearchIcon from '@mui/icons-material/Search'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import Image from 'next/image'

async function fetchSeries() {
  try {
    const res = await fetch('/api/series')
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error('Error fetching sequence data')
  }
}

export default function Page() {
  const { data: session } = useSession()

  const [sequences, setSequences] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
  })

  const [nameSequence, setNameSequence] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState('')
  const [breath_direction, setBreathDirection] = useState('')

  const [flowSeries, setFlowSeries] = useState<FlowSeriesData[]>([])
  const [seriesNameSet, setSeriesNameSet] = useState<string[]>([])
  const [postures, setPostures] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(
    seriesNameSet.length - 1
  )

  const router = useRouter()

  useEffect(() => {
    async function getData() {
      const seriesData = await fetchSeries()

      if (seriesData) {
        setFlowSeries(seriesData)
      }
    }

    if (
      session === null ||
      (session &&
        session.status === 'resolved_model' &&
        session.value === 'null')
    ) {
      router.push('/navigator/flows')
    }

    getData()
  }, [session])

  // Ensure postures are updated when a new series is added
  function handleSelect(event: ChangeEvent<{}>, value: FlowSeriesData | null) {
    event.preventDefault()
    if (value) {
      setSeriesNameSet((prevSeriesNameSet) => [
        ...prevSeriesNameSet,
        value.seriesName,
      ])
      setPostures(value.seriesPostures)
      setSequences({
        ...sequences,
        sequencesSeries: [...sequences.sequencesSeries, value],
      })
      const newIndex = seriesNameSet.length // Update index when a new series is added
      setCurrentSeriesIndex(newIndex)
      updatePostures(newIndex)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const updatedSequence = {
      ...sequences,
      nameSequence,
      sequencesSeries: sequences.sequencesSeries,
      description,
      duration,
      image,
      breath_direction,
    }

    try {
      const response = await fetch('/api/sequences/createSequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSequence),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
    } catch (error: Error | any) {
      error.message
    }
    router.push('/navigator/flows')
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    switch (name) {
      case 'nameSequence':
        setNameSequence(value)
        break
      case 'seriesName':
        setSeriesNameSet((prev) => [...prev, value])
        break
      case 'description':
        setDescription(value)
        setIsDirtyDescription(event.target.value.length > 0)
        break
      case 'duration':
        setDuration(value)
        break
      case 'image':
        setImage(value)
        break
      case 'breath_direction':
        setBreathDirection(value)
        break
    }
  }

  function handleCancel() {
    setNameSequence('')
    setDescription('')
    setSeriesNameSet([])
    setIsDirtyDescription(false)
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  // Function to update postures based on the current series index
  const updatePostures = (index: number) => {
    const seriesName = seriesNameSet[index]
    const series = flowSeries.find((s) => s.seriesName === seriesName)
    if (series) {
      setPostures(series.seriesPostures)
    }
  }

  // Update handleNextSeries to call updatePostures
  const handleNextSeries = () => {
    setCurrentSeriesIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, seriesNameSet.length - 1)
      updatePostures(newIndex)
      return newIndex
    })
  }

  // Update handlePreviousSeries to call updatePostures
  const handlePreviousSeries = () => {
    setCurrentSeriesIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0)
      updatePostures(newIndex)
      return newIndex
    })
  }

  const currentSeriesName = seriesNameSet[currentSeriesIndex] || ''
  const [isDirtyDescription, setIsDirtyDescription] = useState(false)

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Stack sx={{ marginX: 3, marginY: 3, mb: '1em' }}>
          <SplashHeader
            src={'/images/header-create-sequences.png'}
            alt={'Create Sequences'}
            title="Create Sequences"
          />
          <SubNavHeader
            title="Flows"
            link="/navigator/flows"
            onClick={toggleDrawer(!open)}
          />
          <FormControl sx={{ px: 4, pb: 2 }}>
            <Autocomplete
              disablePortal
              id="combo-box-series-search"
              options={flowSeries}
              getOptionLabel={(option: FlowSeriesData) => option.seriesName}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.seriesName}
                </li>
              )}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.seriesName
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase())
                )
              }
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '12px',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                },
                my: 3,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    '& .MuiInputBase-input': { color: 'primary.main' },
                  }}
                  placeholder="Add a Series to your Sequence..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onChange={handleSelect}
            />
          </FormControl>
          <Box sx={{ px: 2 }}>
            {FEATURES.SHOW_CREATE_SEQUENCE && (
              <>
                <FormGroup sx={{ mt: 4 }}>
                  <FormControl>
                    <TextField
                      id="outlined-basic"
                      variant="standard"
                      name="nameSequence"
                      value={nameSequence}
                      onChange={handleChange}
                      placeholder="Give your Sequence a name"
                      sx={{
                        backgroundColor: 'primary.main',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        width: '80%',
                        height: '2em',
                        ml: 5,
                        pr: 7,
                        pl: 2,
                        fontWeight: 'bold',
                        '& .MuiInputBase-input': {
                          padding: '0.5em 0 0 0',
                        },
                      }}
                    />
                  </FormControl>

                  <FormControl className="journal">
                    <FormLabel className="journalTitle">
                      List of Series in this Sequence
                    </FormLabel>
                    <Stack
                      direction="column"
                      spacing={2}
                      justifyContent="flex-start"
                      sx={{ mt: 3 }}
                      className="lines"
                    >
                      {seriesNameSet.map((series, index) => (
                        <Box
                          key={`${series}+${index}`}
                          display={'flex'}
                          sx={{ pl: 4 }}
                          className="journalLine"
                        >
                          <Typography sx={{ mr: 2 }} key={index}>
                            {index + 1}.
                          </Typography>
                          <Typography key={index}>{series}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </FormControl>

                  {postures?.length > 0 && (
                    <>
                      <FormControl sx={{ mt: 4 }} className="journal">
                        <FormLabel className="journalTitle">
                          {currentSeriesName}
                        </FormLabel>

                        <List className="lines">
                          {postures.map((series, index) => (
                            <ListItem
                              className="journalLine"
                              sx={{ whiteSpace: 'collapse' }}
                              key={`${series}${index}`}
                            >
                              <ListItemText
                                primary={series.split(',').map((item, idx) => (
                                  <Typography
                                    variant="body1"
                                    key={idx}
                                    sx={{
                                      fontStyle:
                                        idx === 1 ? 'italic' : 'normal',
                                    }}
                                  >
                                    {item}
                                  </Typography>
                                ))}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <ListItem>
                          <Stack>
                            <Stack>
                              <ListItemIcon
                                sx={{ color: 'error.light' }}
                                onClick={() =>
                                  setSeriesNameSet((prev) => prev.slice(0, -1))
                                }
                              >
                                <DeleteForeverIcon />
                                <ListItemText primary="Remove series" />
                              </ListItemIcon>
                            </Stack>
                            <Stack flexDirection={'row'} alignItems={'center'}>
                              <Typography>
                                {currentSeriesIndex > 0
                                  ? seriesNameSet[currentSeriesIndex - 1]
                                  : ''}
                              </Typography>
                              <IconButton
                                onClick={handlePreviousSeries}
                                disabled={currentSeriesIndex === 0}
                              >
                                <ArrowBack />
                              </IconButton>

                              <IconButton
                                onClick={handleNextSeries}
                                disabled={
                                  currentSeriesIndex ===
                                  seriesNameSet.length - 1
                                }
                              >
                                <ArrowForward />
                              </IconButton>
                              <Typography>
                                {currentSeriesIndex < seriesNameSet.length - 1
                                  ? seriesNameSet[currentSeriesIndex + 1]
                                  : ''}
                              </Typography>
                            </Stack>
                          </Stack>
                        </ListItem>
                      </FormControl>
                    </>
                  )}

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 4 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={session === null}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{ color: 'primary.contrastText' }}
                      onClick={handleCancel}
                    >
                      Start Over
                    </Button>
                  </Stack>
                  <FormControl
                    sx={{
                      width: '100%',
                      mt: 3,
                      border: '1px solid black',
                      borderRadius: '12px',
                      p: 2,
                    }}
                  >
                    <Stack gap={2} flexDirection={'row'} alignItems={'center'}>
                      <Typography color={'primary.main'} variant="h3">
                        Description
                      </Typography>
                      <Image
                        src={'/icons/flows/leaf-3.svg'}
                        alt={'leaf icon'}
                        height={21}
                        width={21}
                      ></Image>
                    </Stack>
                    <TextField
                      id="description"
                      // label="Description"
                      placeholder="Type a description of your sequence"
                      multiline
                      minRows={4}
                      variant="standard"
                      name="description"
                      value={description}
                      onChange={handleChange}
                      sx={{
                        '& .MuiInputBase-input': { color: 'primary.main' },
                        width: '100%',
                        alignSelf: 'center',
                        color: 'primary.main',
                        backgroundColor: 'navSplash.dark',
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
                </FormGroup>
              </>
            )}
          </Box>
        </Stack>
        <Drawer
          onClick={toggleDrawer(!open)}
          open={open}
          onClose={toggleDrawer(false)}
          anchor="bottom"
        >
          <List
            sx={{
              width: 'auto',
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
              Welcome to the sequence creation page
            </ListSubheader>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LooksOne />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="If you can't find a sequence, create your own!" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LooksTwoIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='"Sequence Name": Type a unique name for your sequence.' />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Looks3Icon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='"Pick Series": Add a series to
                  your sequence by selecting them from the "Pick Series"
                  dropdown below. View the asana postures in the series below "Pick Series" Click the "X" to enter a new series. "Remove One (-1)" will remove the last series added. "Clear" will remove all series so you can start over.'
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Looks4Icon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='"Description": Type a description of your sequence.' />
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
        </Drawer>
      </Box>
    </>
  )
}
