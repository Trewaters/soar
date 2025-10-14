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
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useEffect,
  useState,
  useMemo,
} from 'react'
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
import NavBottom from '@serverComponents/navBottom'
import { AppText } from '@app/navigator/constants/Strings'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'
import getAlphaUserIds from '@app/lib/alphaUsers'
import { getAllSeries } from '@lib/seriesService'

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
  const [poses, setPoses] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  // Get alpha user IDs (synchronous function like in practiceSeries)
  const alphaUserIds = useMemo(() => getAlphaUserIds(), [])

  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(
    seriesNameSet.length - 1
  )

  const router = useRouter()

  // Enrich series data with normalized createdBy field like in practiceSeries
  const enrichedSeries = useMemo(
    () =>
      (flowSeries || []).map((s) => ({
        ...s,
        createdBy: (s as any).createdBy ?? (s as any).created_by ?? undefined,
        canonicalAsanaId: (s as any).canonicalAsanaId ?? (s as any).id,
      })),
    [flowSeries]
  )

  // Prepare ordered series options with grouping like in practiceSeries
  const orderedSeriesOptions = useMemo(() => {
    if (!enrichedSeries || enrichedSeries.length === 0) return []

    // Get current user identifier
    const currentUserId = session?.user?.id
    const currentUserEmail = session?.user?.email

    // Filter series to only show those created by current user or alpha users
    const userIdentifiers = [currentUserId, currentUserEmail].filter(Boolean)
    const authorizedSeries = enrichedSeries.filter((s) => {
      const createdBy = (s as any).createdBy
      // Allow series created by current user or alpha users only
      return (
        (createdBy && userIdentifiers.includes(createdBy)) ||
        (createdBy && alphaUserIds.includes(createdBy))
      )
    })

    // Partition series into groups
    const mine: (FlowSeriesData & { id: string })[] = []
    const alpha: (FlowSeriesData & { id: string })[] = []

    authorizedSeries.forEach((item) => {
      const createdBy = (item as any).createdBy

      // Ensure id is always a string
      const itemWithId: FlowSeriesData & { id: string } = {
        ...item,
        id: (item as any).id ? String((item as any).id) : '',
      }

      if (createdBy && userIdentifiers.includes(createdBy)) {
        mine.push(itemWithId)
      } else if (createdBy && alphaUserIds.includes(createdBy)) {
        alpha.push(itemWithId)
      }
    })

    // Sort each group alphabetically
    mine.sort((a, b) => a.seriesName.localeCompare(b.seriesName))
    alpha.sort((a, b) => a.seriesName.localeCompare(b.seriesName))

    // Compose with section header markers
    const result: Array<
      | (FlowSeriesData & { id: string })
      | { section: 'Mine' | 'Alpha' | 'Others' }
    > = []

    if (mine.length > 0) {
      result.push({ section: 'Mine' })
      mine.forEach((item) => result.push(item))
    }
    if (alpha.length > 0) {
      result.push({ section: 'Alpha' })
      alpha.forEach((item) => result.push(item))
    }

    return result
  }, [enrichedSeries, session?.user?.id, session?.user?.email, alphaUserIds])

  useEffect(() => {
    async function getData() {
      const seriesData = await getAllSeries()

      if (seriesData) {
        setFlowSeries(seriesData as FlowSeriesData[])
      }
    }

    if (session === null) {
      router.push('/navigator/flows')
    }

    getData()
  }, [router, session])

  // Ensure poses are updated when a new series is added
  function handleSelect(
    event: ChangeEvent<object>,
    value: FlowSeriesData | null
  ) {
    event.preventDefault()
    if (value) {
      setSeriesNameSet((prevSeriesNameSet) => [
        ...prevSeriesNameSet,
        value.seriesName,
      ])
      setPoses(value.seriesPoses)
      setSequences({
        ...sequences,
        sequencesSeries: [...sequences.sequencesSeries, value],
      })
      const newIndex = seriesNameSet.length // Update index when a new series is added
      setCurrentSeriesIndex(newIndex)
      updatePoses(newIndex)
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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        body: JSON.stringify(updatedSequence),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('create sequence response', data)

      // Ensure the sequence was created successfully before navigating
      if (data.sequence) {
        console.log(
          'Sequence created successfully:',
          data.sequence.nameSequence
        )
        // Navigate to the newly created sequence detail page
        router.push(`/navigator/sequences/${data.sequence.id}`)
      } else {
        throw new Error('Sequence creation returned no sequence data')
      }
    } catch (error: Error | any) {
      console.error('Error creating sequence:', error.message)
    }
    handleCancel()
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

  // Function to update poses based on the current series index
  const updatePoses = (index: number) => {
    const seriesName = seriesNameSet[index]
    const series = flowSeries.find((s) => s.seriesName === seriesName)
    if (series) {
      setPoses(series.seriesPoses)
    }
  }

  // Update handleNextSeries to call updatePoses
  const handleNextSeries = () => {
    setCurrentSeriesIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, seriesNameSet.length - 1)
      updatePoses(newIndex)
      return newIndex
    })
  }

  // Update handlePreviousSeries to call updatePoses
  const handlePreviousSeries = () => {
    setCurrentSeriesIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0)
      updatePoses(newIndex)
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
          mb: 4,
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
              options={orderedSeriesOptions}
              getOptionLabel={(option) => {
                const opt = option as any
                if ('section' in opt) return ''
                return opt.seriesName
              }}
              // Render section headers for groups
              renderOption={(() => {
                // Build a map of option indices to section labels
                let lastSection: string | null = null
                const sectionHeaderMap: Record<number, string> = {}
                orderedSeriesOptions.forEach((opt: any, idx: number) => {
                  const o = opt as any
                  if ('section' in o) {
                    lastSection = o.section
                  } else if (lastSection) {
                    sectionHeaderMap[idx] = lastSection
                    lastSection = null
                  }
                })

                interface SectionOption {
                  section: 'Mine' | 'Alpha' | 'Others'
                }

                interface SeriesOption extends FlowSeriesData {
                  id: string
                  seriesName: string
                }

                type AutocompleteOption = SeriesOption | SectionOption

                interface RenderOptionProps {
                  key?: string
                  [key: string]: any
                }

                interface RenderOptionState {
                  index: number
                }

                const renderOptionFn = (
                  props: RenderOptionProps,
                  option: AutocompleteOption,
                  { index }: RenderOptionState
                ) => {
                  const opt = option as AutocompleteOption
                  if ('section' in opt) {
                    // Never render section as an option (handled below)
                    return null
                  }
                  const sectionLabel = sectionHeaderMap[index] || null
                  return (
                    <Fragment key={opt.id ?? `option-${index}`}>
                      {sectionLabel && (
                        <ListSubheader
                          key={`${sectionLabel}-header-${index}`}
                          component="div"
                          disableSticky
                          role="presentation"
                        >
                          {sectionLabel}
                        </ListSubheader>
                      )}
                      <li {...props} key={opt.id ?? `option-${index}`}>
                        {opt.seriesName}
                      </li>
                    </Fragment>
                  )
                }
                renderOptionFn.displayName = 'SeriesAutocompleteRenderOption'
                return renderOptionFn
              })()}
              // Filter options with proper grouping
              filterOptions={(options, state) => {
                // Partition options into groups by section
                const groups: Record<string, any[]> = {}
                let currentSection: 'Mine' | 'Alpha' | null = null
                for (const option of options) {
                  const opt = option as any
                  if ('section' in opt) {
                    currentSection = opt.section as 'Mine' | 'Alpha'
                    if (!groups[currentSection]) groups[currentSection] = []
                  } else if (currentSection) {
                    if (!groups[currentSection]) groups[currentSection] = []
                    // Only add if matches search
                    if (
                      opt.seriesName &&
                      opt.seriesName
                        .toLowerCase()
                        .includes(state.inputValue.toLowerCase())
                    ) {
                      groups[currentSection].push(opt)
                    }
                  }
                }
                // Flatten back to options array, inserting section header if group has any items
                const filtered: typeof options = []
                const sectionOrder: Array<'Mine' | 'Alpha'> = ['Mine', 'Alpha']
                for (const section of sectionOrder) {
                  if (groups[section] && groups[section].length > 0) {
                    filtered.push({
                      section: section as 'Mine' | 'Alpha' | 'Others',
                    })
                    filtered.push(...groups[section])
                  }
                }
                return filtered
              }}
              // Prevent section headers from being selected
              isOptionEqualToValue={(option, value) => {
                const opt = option as any
                const val = value as any
                if ('section' in opt || 'section' in val) return false
                return opt.id === val.id
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '12px',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: 'primary.light', // Ensure border color does not change on hover
                  },
                '& .MuiAutocomplete-popupIndicator': {
                  display: 'none',
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
              onChange={(event, value) => {
                const val = value as any
                // Ignore section header clicks
                if (val && 'section' in val) return
                handleSelect(event as any, value as FlowSeriesData | null)
              }}
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

                  {poses?.length > 0 && (
                    <>
                      <FormControl sx={{ mt: 4 }} className="journal">
                        <FormLabel className="journalTitle">
                          {currentSeriesName}
                        </FormLabel>

                        <List className="lines">
                          {poses.map((series, index) => {
                            const { name, secondary } =
                              splitSeriesPoseEntry(series)

                            return (
                              <ListItem
                                className="journalLine"
                                sx={{ whiteSpace: 'collapse' }}
                                key={`${series}${index}`}
                              >
                                <ListItemText
                                  primary={
                                    <>
                                      <Typography variant="body1">
                                        {name}
                                      </Typography>
                                      {secondary && (
                                        <Typography
                                          variant="body1"
                                          sx={{ fontStyle: 'italic' }}
                                        >
                                          {secondary}
                                        </Typography>
                                      )}
                                    </>
                                  }
                                />
                              </ListItem>
                            )
                          })}
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
                      {AppText.APP_BUTTON_SUBMIT}
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
                  dropdown below. View the asana poses in the series below "Pick Series" Click the "X" to enter a new series. "Remove One (-1)" will remove the last series added. "Clear" will remove all series so you can start over.'
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
              <ListItemText
                primary={`Click "${AppText.APP_BUTTON_SUBMIT}" when you are done.`}
              />
            </ListItem>
          </List>
        </Drawer>
      </Box>
      <Box height={'72px'} />

      <NavBottom subRoute="/navigator/flows" />
    </>
  )
}
