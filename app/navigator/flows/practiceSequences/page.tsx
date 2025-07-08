'use client'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import { SequenceData } from '@context/SequenceContext'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import Image from 'next/image'
import CustomPaginationCircles from '@app/clientComponents/pagination-circles'
import NavBottom from '@serverComponents/navBottom'

export default function Page() {
  const [sequences, setSequences] = useState<SequenceData[]>([])
  const [singleSequence, setSingleSequence] = useState<SequenceData>({
    id: 0,
    nameSequence: '',
    sequencesSeries: [],
    description: '',
    duration: '',
    image: '',
    breath_direction: '',
    createdAt: '',
    updatedAt: '',
  })
  const [lastRefresh, setLastRefresh] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [autocompleteInputValue, setAutocompleteInputValue] =
    useState<string>('')

  const [page, setPage] = useState(1)
  const itemsPerPage = 1

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const paginatedData = singleSequence.sequencesSeries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Simplified function to fetch sequences
  const fetchSequences = async () => {
    try {
      setIsRefreshing(true)
      console.log('Fetching sequences...')

      const response = await fetch('/api/sequences', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
      }
      const newSequences = await response.json()
      console.log(`Successfully fetched ${newSequences.length} sequences`)

      setSequences(newSequences)
      setLastRefresh(Date.now())
      return newSequences
    } catch (error) {
      console.error('Error fetching sequences:', error)
      throw error
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSequences()
  }, [])

  // Refetch data when the page becomes visible (like asana postures page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing sequence data...')
        fetchSequences()
      }
    }

    const handleFocus = () => {
      console.log('Window gained focus, refreshing sequence data...')
      fetchSequences()
    }

    const handlePageShow = () => {
      console.log('Page show event, refreshing sequence data...')
      fetchSequences()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  // Function to refresh sequences data
  const refreshSequences = async () => {
    try {
      await fetchSequences()
      setAutocompleteInputValue('')
      console.log('Manual refresh completed successfully')
    } catch (error) {
      console.error('Manual refresh failed:', error)
    }
  }

  function handleSelect(
    event: ChangeEvent<object>,
    value: SequenceData | null
  ) {
    // Logs the type of event (e.g., 'click')
    // Logs the element that triggered the event
    event.preventDefault()
    if (value) {
      setSingleSequence(value)
      // Clear the input after selection to allow for new searches
      setAutocompleteInputValue('')
    }
  }
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  /* 
                  // breath icons
                  import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
                  import CloudUploadIcon from '@mui/icons-material/CloudUpload';
                  import ContactlessIcon from '@mui/icons-material/Contactless';
                  import DeblurIcon from '@mui/icons-material/Deblur';
                  import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
                  import FastForwardIcon from '@mui/icons-material/FastForward';
                  import FastRewindIcon from '@mui/icons-material/FastRewind';
                  import FileUploadIcon from '@mui/icons-material/FileUpload';
                  import FileDownloadIcon from '@mui/icons-material/FileDownload';
                  import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
                  import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
                  import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
                  import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
                  import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
                  import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

                  // best so far
                  import LoginIcon from '@mui/icons-material/Login';
                  import LogoutIcon from '@mui/icons-material/Logout';
                  <LoginIcon />
                    <LogoutIcon />

                  // meditation icon
                  import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

                  */

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
          sx={{ marginX: 3, marginY: 3, mb: '1em', width: '100%' }}
        >
          <SplashHeader
            src={'/icons/designImages/header-practice-sequence.png'}
            alt={'Practice Sequences'}
            title="Practice Sequences"
          />
          <SubNavHeader
            title="Flows"
            link="/navigator/flows"
            onClick={toggleDrawer(!open)}
          />
          <Stack sx={{ px: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Autocomplete
                key={`sequences-autocomplete-${sequences.length}-${lastRefresh}`}
                disablePortal
                id="combo-box-series-search"
                options={sequences}
                getOptionLabel={(option: SequenceData) => option.nameSequence}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    option.nameSequence
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                  )
                }
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.nameSequence}
                  </li>
                )}
                value={null} // Always reset to null to show placeholder
                inputValue={autocompleteInputValue}
                onInputChange={(event, newInputValue) => {
                  setAutocompleteInputValue(newInputValue)
                }}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '12px',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'primary.light', // Ensure border color does not change on hover
                    },
                  '& .MuiAutocomplete-endAdornment': {
                    display: 'none',
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                    {...params}
                    placeholder="Search for a Sequence"
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
              <Button
                variant="outlined"
                onClick={refreshSequences}
                disabled={isRefreshing}
                sx={{
                  minWidth: 'auto',
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  '&:hover': {
                    borderColor: 'primary.light',
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
                aria-label="Refresh sequences"
              >
                <RefreshIcon
                  sx={{
                    ...(isRefreshing && {
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': {
                          transform: 'rotate(0deg)',
                        },
                        '100%': {
                          transform: 'rotate(360deg)',
                        },
                      },
                    }),
                  }}
                />
              </Button>
            </Box>

            {/* Debug info for sequences count and last refresh */}
            <Typography
              variant="caption"
              sx={{ px: 2, color: 'text.secondary', mt: 1 }}
            >
              {sequences.length} sequences loaded • Last refresh:{' '}
              {new Date(lastRefresh).toLocaleTimeString()}
            </Typography>

            <React.Fragment key={singleSequence.id}>
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Typography
                  variant="body1"
                  component="h3"
                  textAlign="center"
                  sx={{
                    backgroundColor: 'primary.main',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    width: 'fit-content',
                    ml: 5,
                    pr: 7,
                    pl: 2,
                    fontWeight: 'bold',
                  }}
                >
                  {singleSequence.nameSequence}
                </Typography>
              </Box>
              {singleSequence?.id ? (
                <Stack rowGap={3} alignItems="center">
                  {paginatedData.map((seriesMini, i) => (
                    <Card
                      key={i}
                      sx={{
                        width: '85%',
                        boxShadow: 3,
                        textAlign: 'center',
                        borderColor: 'primary.main',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                      className="journal"
                    >
                      <CardHeader
                        className="journalTitle"
                        title={
                          <Box width={'100%'}>
                            <Stack
                              flexDirection={'row'}
                              justifyContent={'space-between'}
                            >
                              <Stack>
                                <Button
                                  disableRipple
                                  onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 1))
                                  }
                                  disabled={page === 1}
                                  startIcon={
                                    <Image
                                      src="/icons/navigation/nav-practice-sequence-back-arrow.svg"
                                      width={7}
                                      height={7}
                                      alt={'sequence-back-arrow'}
                                    />
                                  }
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      boxShadow: 'none',
                                    },
                                  }}
                                >
                                  {singleSequence.sequencesSeries[page - 2]
                                    ?.seriesName || 'Previous'}
                                </Button>
                              </Stack>
                              <Stack>
                                <Button
                                  disableRipple
                                  onClick={() =>
                                    setPage((prev) =>
                                      Math.min(
                                        prev + 1,
                                        Math.ceil(
                                          singleSequence.sequencesSeries
                                            .length / itemsPerPage
                                        )
                                      )
                                    )
                                  }
                                  disabled={
                                    page ===
                                    Math.ceil(
                                      singleSequence.sequencesSeries.length /
                                        itemsPerPage
                                    )
                                  }
                                  endIcon={
                                    <Image
                                      src="/icons/navigation/nav-practice-sequence-advance-arrow.svg"
                                      width={7}
                                      height={7}
                                      alt={'sequence-back-arrow'}
                                    />
                                  }
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      boxShadow: 'none',
                                    },
                                  }}
                                >
                                  {singleSequence.sequencesSeries[page]
                                    ?.seriesName || 'Next'}
                                </Button>
                              </Stack>
                            </Stack>
                            <Stack>
                              <Typography variant="h6">
                                {seriesMini.seriesName}
                              </Typography>
                            </Stack>
                          </Box>
                        }
                      />
                      <CardContent className="lines" sx={{ p: 0 }}>
                        {seriesMini.seriesPostures.map((asana, asanaIndex) => (
                          <Stack
                            direction={'row'}
                            key={asanaIndex}
                            className="journalLine"
                            alignItems="flex-start"
                          >
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ width: '30px', textAlign: 'right', mr: 2 }}
                            >
                              {asanaIndex + 1}.
                            </Typography>
                            <Stack direction={'column'}>
                              <Typography
                                textAlign={'left'}
                                fontWeight={'bold'}
                                variant="body1"
                              >
                                <Link
                                  underline="hover"
                                  href={`/navigator/asanaPostures/${asana.split(';')[0]}`}
                                >
                                  {asana.split(';')[0]}
                                </Link>
                              </Typography>
                              <Typography textAlign={'left'} variant="body2">
                                {asana.split(';')[1]}
                              </Typography>
                            </Stack>
                          </Stack>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                  <CustomPaginationCircles
                    count={Math.ceil(
                      singleSequence.sequencesSeries.length / itemsPerPage
                    )}
                    page={page}
                    onChange={handleChange}
                  />
                  <Box
                    className={'journal'}
                    sx={{
                      marginTop: '32px',
                      p: 4,
                      color: 'primary.main',
                      backgroundColor: 'navSplash.dark',
                    }}
                  >
                    <Stack flexDirection={'row'} alignItems={'center'}>
                      <Typography variant="h3" sx={{ mr: 2 }}>
                        Description
                      </Typography>
                      <Image
                        src={'/icons/flows/leaf-3.svg'}
                        alt={'leaf icon'}
                        height={21}
                        width={21}
                      ></Image>
                    </Stack>
                    <Typography
                      color="primary.contrastText"
                      variant="body1"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {singleSequence.description}
                    </Typography>
                  </Box>
                </Stack>
              ) : null}
            </React.Fragment>
          </Stack>
        </Stack>
      </Box>
      <Box height={'72px'} />

      <NavBottom subRoute="/navigator/flows" />
    </>
  )
}
