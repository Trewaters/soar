'use client'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import SplashHeader from '@app/clientComponents/splash-header'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import NavBottom from '@serverComponents/navBottom'
import { SequenceData } from '@app/context/SequenceContext'
import SearchIcon from '@mui/icons-material/Search'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SplashNavButton from '@app/clientComponents/splash-nav-button'

export default function Page() {
  const [sequences, setSequences] = useState<SequenceData[]>([])
  const [singleSequence, setSingleSequence] = useState<SequenceData | null>(
    null
  )
  const [lastRefresh, setLastRefresh] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autocompleteInputValue, setAutocompleteInputValue] =
    useState<string>('')

  const [page, setPage] = useState(1)
  const itemsPerPage = 1
  const router = useRouter()

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const paginatedData = singleSequence
    ? singleSequence.sequencesSeries.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      )
    : []

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
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

      setSequences(
        newSequences.sort((a: SequenceData, b: SequenceData) =>
          a.nameSequence.localeCompare(b.nameSequence)
        )
      )
      setLastRefresh(Date.now())
    } catch (error: any) {
      console.error('Error fetching sequences:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Check for refresh parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('refresh')) {
      console.log('Refresh parameter detected, forcing data reload...')
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  // Refetch data when the page becomes visible or on navigation events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing sequence data...')
        fetchData()
      }
    }

    const handleFocus = () => {
      console.log('Window gained focus, refreshing sequence data...')
      fetchData()
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('Page show event (persisted), refreshing sequence data...')
        fetchData()
      }
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

  function handleSelect(
    event: ChangeEvent<object>,
    value: SequenceData | null
  ) {
    event.preventDefault()
    setSingleSequence(value)
    setPage(1) // Reset pagination when a new sequence is selected
    setAutocompleteInputValue('') // Clear input for new search
  }

  const handleCreateSequenceClick = () => {
    router.push('/navigator/flows/createSequence')
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
          paddingBottom: { xs: '80px', sm: '80px' },
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
          <SubNavHeader title="Flows" link="/navigator/flows" />
          <Stack sx={{ px: 4 }}>
            {loading && !sequences.length ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Autocomplete
                key={`sequence-autocomplete-${sequences.length}-${lastRefresh}`}
                disablePortal
                freeSolo={false}
                id="combo-box-sequence-search"
                options={sequences}
                getOptionLabel={(option: SequenceData) => option.nameSequence}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.nameSequence}
                  </li>
                )}
                inputValue={autocompleteInputValue}
                onInputChange={(event, newInputValue) => {
                  setAutocompleteInputValue(newInputValue)
                }}
                onChange={handleSelect}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '12px',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'primary.light',
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
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                Error: {error}
              </Typography>
            )}
          </Stack>
        </Stack>

        {singleSequence && (
          <Box width="100%" sx={{ p: 2 }} key={singleSequence.id}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Typography variant="h4" color="primary.main" gutterBottom>
                {singleSequence.nameSequence}
              </Typography>
              {paginatedData.length > 0 &&
                paginatedData.map((series) => (
                  <Box
                    key={series.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: '12px',
                      width: '100%',
                    }}
                  >
                    <Typography variant="h6">{series.seriesName}</Typography>
                    {series.seriesPostures.map((posture) => (
                      <Typography key={posture} variant="body2">
                        <Link
                          href={`/navigator/asanaPostures/${
                            posture.split(';')[0]
                          }`}
                          passHref
                        >
                          {posture.split(';')[0]}
                        </Link>
                        : {posture.split(';')[1]}
                      </Typography>
                    ))}
                  </Box>
                ))}
              {singleSequence.sequencesSeries.length > itemsPerPage && (
                <Pagination
                  count={Math.ceil(
                    singleSequence.sequencesSeries.length / itemsPerPage
                  )}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                  sx={{ mt: 2 }}
                />
              )}
              <Box
                className={'journal'}
                sx={{
                  marginTop: '32px',
                  p: 4,
                  color: 'primary.main',
                  backgroundColor: 'navSplash.dark',
                  width: '100%',
                }}
              >
                <Stack flexDirection={'row'} alignItems={'center'}>
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    Description
                  </Typography>
                  <Image
                    src={'/icons/designImages/leaf-2.svg'}
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
            </Box>
          </Box>
        )}
        <SplashNavButton
          title="Create Sequence"
          description="Build a new sequence of series to customize your practice."
          sx={{
            backgroundImage:
              "url('/icons/designImages/create-sequence-splash-button.png')",
          }}
          onClick={handleCreateSequenceClick}
        />
      </Box>
      <Box height={'72px'} />

      <NavBottom subRoute="/navigator/flows" />
    </>
  )
}
