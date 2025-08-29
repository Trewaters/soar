'use client'

import { useEffect, useState, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import { getAccessiblePostures } from '@lib/postureService'
import SplashHeader from '@app/clientComponents/splash-header'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import { useSession } from 'next-auth/react'
import SubNavHeader from '@app/clientComponents/sub-nav-header'

export default function Page() {
  const { data: session } = useSession()
  const [posturePropData, setPosturePropData] = useState<FullAsanaData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInfoClick = () => {
    // Handle help/info click - could show a help dialog or navigate to help page
    console.log('Help info clicked for Practice Asanas page')
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAccessiblePostures(
        session?.user?.email || undefined
      )
      setPosturePropData(
        data.sort((a: FullAsanaData, b: FullAsanaData) => {
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
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing posture data...')
        fetchData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Also listen for focus events as a fallback
    const handleFocus = () => {
      console.log('Window gained focus, refreshing posture data...')
      fetchData()
    }

    window.addEventListener('focus', handleFocus)

    // Listen for popstate events (browser back/forward navigation)
    const handlePopState = () => {
      console.log('Navigation detected, refreshing posture data...')
      fetchData()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [fetchData])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          paddingBottom: { xs: '80px', sm: '80px' },
        }}
      >
        <SplashHeader
          src={'/images/asana/practice-asana-posture-210x363.png'}
          alt={'Practice Asana Postures'}
          title="Practice Asana Postures"
        />
        <Box
          sx={{
            justifyContent: 'space-around',
            width: '50%',
          }}
        >
          <SubNavHeader
            title="Asanas"
            link="/navigator/asanaPostures"
            onClick={handleInfoClick}
          />
        </Box>
        <Box height={'32px'} />
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
            <PostureSearch posturePropData={posturePropData} />
          )}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {error}
            </Typography>
          )}
        </Box>

        {/* Instructions */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            px: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Start typing to search for a posture, then select it to view
            detailed practice information.
          </Typography>
        </Box>
      </Box>
    </>
  )
}
