'use client'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { SequenceData } from '@context/SequenceContext'
import { FEATURES } from '@app/FEATURES'
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
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

  const router = useRouter()

  useEffect(() => {
    async function getData() {
      const seriesData = await fetchSeries()

      if (seriesData) {
        setFlowSeries(seriesData)
      }
    }
    getData()
  }, [session])

  function handleSelect(event: ChangeEvent<{}>, value: FlowSeriesData | null) {
    // Logs the type of event (e.g., 'click')
    // Logs the element that triggered the event
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
      // eslint-disable-next-line no-unused-vars
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
    // Clear the form
    setNameSequence('')
    setDescription('')
    setSeriesNameSet([])
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
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
        }}
      >
        <Stack
          spacing={2}
          sx={{ marginX: 3, marginY: 3, mb: '1em', width: 'fit-content' }}
        >
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
          {FEATURES.SHOW_CREATE_SEQUENCE && (
            <>
              <FormGroup sx={{ mt: 4 }}>
                <FormControl>
                  <FormLabel>Sequence Name</FormLabel>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="nameSequence"
                    value={nameSequence}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Series Name</FormLabel>
                  <Stack
                    direction="column"
                    spacing={2}
                    justifyContent="flex-start"
                    sx={{ mt: 3 }}
                  >
                    {seriesNameSet.map((series, index) => (
                      <Box
                        key={`${series}+${index}`}
                        display={'flex'}
                        sx={{ pl: 4 }}
                      >
                        <Typography sx={{ mr: 2 }} key={index}>
                          {index + 1}.
                        </Typography>
                        <Typography key={index}>{series}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </FormControl>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setSeriesNameSet((prev) => prev.slice(0, -1))
                    }
                  >
                    <Typography>Remove One (-1)</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSeriesNameSet([])}
                  >
                    Clear
                  </Button>
                </Stack>

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
                      label="Pick Series"
                      placeholder="Search for a Series"
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

                {postures?.length > 0 && (
                  <>
                    <Typography variant="h3">
                      {seriesNameSet.slice(-1)[0]} Postures
                    </Typography>
                    <List>
                      {postures.map((series, index) => (
                        <ListItem key={`${series}${index}`}>
                          <ListItemText primary={series} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <TextField
                    id="description"
                    variant="outlined"
                    name="description"
                    multiline
                    value={description}
                    onChange={handleChange}
                  />
                </FormControl>
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
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Stack>
              </FormGroup>
            </>
          )}
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

      {/* 
    OLD CODE BELOW
    */}

      {/* <Stack
        spacing={2}
        flexDirection={'column'}
        sx={{ marginX: 3, marginY: 3, background: 'white', mb: '1em' }}
      >
        <>
          {FEATURES.SHOW_CREATE_SEQUENCE && (
            <>
              <Stack
                direction="column"
                spacing={5}
                sx={{ mt: 4 }}
                justifyContent={'space-between'}
              >
                <Typography variant="h2" textAlign="center">
                  Create a Sequence
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  href="/navigator/flows"
                  LinkComponent="a"
                  sx={{ my: 3, display: 'block' }}
                >
                  Back to flow
                </Button>
              </Stack>
              <FormGroup sx={{ mt: 4 }}>
                <FormControl>
                  <FormLabel>Sequence Name</FormLabel>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="nameSequence"
                    value={nameSequence}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Series Name</FormLabel>
                  <Stack
                    direction="column"
                    spacing={2}
                    justifyContent="flex-start"
                    sx={{ mt: 3 }}
                  >
                    {seriesNameSet.map((series, index) => (
                      <Box
                        key={`${series}+${index}`}
                        display={'flex'}
                        sx={{ pl: 4 }}
                      >
                        <Typography sx={{ mr: 2 }} key={index}>
                          {index + 1}.
                        </Typography>
                        <Typography key={index}>{series}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </FormControl>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setSeriesNameSet((prev) => prev.slice(0, -1))
                    }
                  >
                    <Typography>Remove One (-1)</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSeriesNameSet([])}
                  >
                    Clear
                  </Button>
                </Stack>

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
                  sx={{ my: 3 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Pick Series" />
                  )}
                  onChange={handleSelect}
                />

                {postures?.length > 0 && (
                  <>
                    <Typography variant="h3">
                      {seriesNameSet.slice(-1)[0]} Postures
                    </Typography>
                    <List>
                      {postures.map((series, index) => (
                        <ListItem key={`${series}${index}`}>
                          <ListItemText primary={series} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <TextField
                    id="description"
                    variant="outlined"
                    name="description"
                    multiline
                    value={description}
                    onChange={handleChange}
                  />
                </FormControl>
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
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Stack>
              </FormGroup>
            </>
          )}
        </>
      </Stack> */}
    </>
  )
}
