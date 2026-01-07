'use client'

import { useEffect, useState, useCallback } from 'react'
import { Box, Stack, Typography, Drawer } from '@mui/material'
import { getAccessiblePoses } from '@lib/poseService'
import SplashHeader from '@app/clientComponents/splash-header'
import PoseSearch from '@app/navigator/asanaPoses/pose-search'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import { useSession } from 'next-auth/react'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import { AsanaPose } from 'types/asana'

export default function Page() {
  const { data: session } = useSession()
  const [posePropData, setPosePropData] = useState<AsanaPose[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleInfoClick = () => {
    setOpen(!open)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAccessiblePoses(session?.user?.email || undefined)
      setPosePropData(
        data.sort((a: AsanaPose, b: AsanaPose) => {
          if (a.sort_english_name < b.sort_english_name) return -1
          if (a.sort_english_name > b.sort_english_name) return 1
          return 0
        })
      )
    } catch (error: Error | any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.email])

  useEffect(() => {
    fetchData()

    // Check for refresh parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('refresh')) {
      console.log('Refresh parameter detected, forcing data reload...')
      // Remove the refresh parameter from URL without page reload
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [fetchData])

  // Refetch data when the page becomes visible (e.g., when returning from create page)
  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      fetchData()
    }
  }, [fetchData])

  const handleFocus = useCallback(() => {
    fetchData()
  }, [fetchData])

  const handlePopState = useCallback(() => {
    console.log('Navigation detected, refreshing pose data...')
    fetchData()
  }, [fetchData])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('popstate', handlePopState)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [handleVisibilityChange, handleFocus, handlePopState])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SplashHeader
          src={'/images/asana/practice-asana-pose-210x363.png'}
          alt={'Practice Asanas'}
          title="Practice Asanas"
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginX: 3,
            mb: '1em',
          }}
        >
          <SubNavHeader
            title="Asanas"
            link="/navigator/asanaPoses"
            onClick={handleInfoClick}
            sx={{
              width: '100%',
              maxWidth: '384px', // Match SplashHeader width
              alignSelf: 'center',
              mb: 2, // Add bottom margin for spacing
            }}
          />
          <Stack sx={{ px: 4, width: '100%', maxWidth: '600px' }}>
            {/* Search Section */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              {loading ? (
                <LoadingSkeleton type="search" />
              ) : (
                <PoseSearch posePropData={posePropData} />
              )}
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  Error: {error}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            maxWidth: '100vw',
          },
        }}
        disablePortal={false}
        disableScrollLock={true}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          Search and browse through your available yoga poses. Use the search
          bar to find specific asanas or scroll through the complete collection
          to explore and practice different poses.
        </Typography>
      </Drawer>
    </>
  )
}
