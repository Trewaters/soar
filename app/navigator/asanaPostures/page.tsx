'use client'

import { useEffect, useState } from 'react'
import { Autocomplete, Box, TextField } from '@mui/material'
import { useSession } from 'next-auth/react'
import SplashHeader from '@app/clientComponents/splash-header'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import SplashNavButton from '@app/clientComponents/splash-nav-button'
import { getAccessiblePostures } from '@lib/postureService'
import { FullAsanaData } from '@app/context/AsanaPostureContext'

export default function Page() {
  const router = useNavigationWithLoading()
  const { data: session } = useSession()
  const [userAsanas, setUserAsanas] = useState<FullAsanaData[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch user-accessible asanas (user's own + alpha users)
  useEffect(() => {
    const fetchUserAsanas = async () => {
      setLoading(true)
      try {
        // Use the new access-controlled service function
        const asanas = await getAccessiblePostures(
          session?.user?.email || undefined
        )
        setUserAsanas(asanas)
      } catch (error) {
        console.error('Error fetching accessible asanas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAsanas()
  }, [session?.user?.email])

  // Transform user asanas into autocomplete options
  const autocompleteOptions = userAsanas.map((asana) => ({
    label: `${asana.english_names?.[0] || asana.sort_english_name}`,
    value: asana.sort_english_name,
    asana: asana,
  }))

  // Add a helpful message if no asanas are found
  const getPlaceholderText = () => {
    if (loading) {
      return 'Loading accessible asanas...'
    }
    if (userAsanas.length === 0) {
      return session?.user?.email
        ? 'No accessible asanas found. Create your first asana below!'
        : 'No asanas available. Sign in to access your asanas.'
    }
    return session?.user?.email
      ? `Search your ${userAsanas.length} accessible asana${userAsanas.length === 1 ? '' : 's'}`
      : `Search ${userAsanas.length} available asana${userAsanas.length === 1 ? '' : 's'}`
  }

  const handlePracticeAsanaClick = () => {
    // Navigate to the dedicated practice asana page
    router.push('/navigator/asanaPostures/practiceAsanas')
  }

  const handleCreateAsanaClick = () => {
    router.push('/navigator/asanaPostures/createAsana')
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh', // Ensure full viewport height
          paddingBottom: { xs: '80px', sm: '80px' }, // Extra padding for mobile to ensure content is above nav
        }}
      >
        <SplashHeader
          src={'/images/asana-postures-splash-header.png'}
          alt={'Asana'}
          title="Asana"
        />
        <Box height={'32px'} />

        {/* Autocomplete Search for Asana Postures */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '363px',
            mb: 6,
          }}
        >
          <Autocomplete
            options={autocompleteOptions}
            getOptionLabel={(option) => option.label}
            loading={loading}
            disabled={!session?.user?.email}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={getPlaceholderText()}
                variant="outlined"
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  boxShadow: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: 500,
                    background: 'rgba(255,255,255,0.85)',
                    transition: 'box-shadow 0.2s',
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      boxShadow: 3,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                    fontSize: { xs: 15, sm: 17 },
                    color: 'primary.main',
                  },
                }}
                // InputProps={{
                //   ...params.InputProps,
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <SearchIcon sx={{ color: 'primary.main' }} />
                //     </InputAdornment>
                //   ),
                //   sx: {
                //     borderRadius: 3,
                //     fontSize: { xs: 16, sm: 18 },
                //     fontWeight: 500,
                //     background: 'rgba(255,255,255,0.85)',
                //   },
                // }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-inputRoot': {
                borderRadius: 3,
                padding: '6px 12px',
              },
              '& .MuiAutocomplete-listbox': {
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                fontSize: { xs: 16, sm: 18 },
              },
              '& .MuiAutocomplete-option': {
                fontWeight: 500,
                py: 1,
                px: 2,
                transition: 'background 0.2s',
                '&[aria-selected="true"]': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                },
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
              },
            }}
            onChange={(_, value) => {
              if (value?.value) {
                router.push(`/navigator/asanaPostures/${value.value}`)
              }
            }}
            fullWidth
            disableClearable
            autoHighlight
          />
        </Box>
        {/* Practice Asana Postures Button with embedded search */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '363px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <SplashNavButton
            title="Practice Asana Postures"
            description="Search and practice asana postures."
            image="/images/asana/practice-asana-posture-210x363.png"
            sx={{
              backgroundImage:
                "url('/images/asana/practice-asana-posture-210x363.png')",
              mb: 2,
            }}
            onClick={handlePracticeAsanaClick}
          />
        </Box>

        {/* Create Asana Postures Button */}
        <SplashNavButton
          title="Create Asana Posture"
          description="Customize your practice by creating new Asana postures."
          image="/images/asana/create-asana-splash-header.png"
          premium
          sx={{
            backgroundImage:
              "url('/images/asana/create-asana-splash-header.svg')",
          }}
          onClick={handleCreateAsanaClick}
        />
      </Box>
    </>
  )
}
