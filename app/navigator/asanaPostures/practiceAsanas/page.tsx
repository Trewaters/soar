'use client'

import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { getAllPostures } from '@lib/postureService'
import SplashHeader from '@app/clientComponents/splash-header'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import { FullAsanaData } from '@app/context/AsanaPostureContext'

export default function Page() {
  const [posturePropData, setPosturePropData] = useState<FullAsanaData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllPostures()
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
  }

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
  }, [])

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
  }, [])

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
        <Box height={'32px'} />

        {/* Description */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            mb: 4,
            px: 2,
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Search and Practice Yoga Postures
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Use the search below to find any yoga posture and view detailed
            information about its alignment, benefits, and practice
            instructions.
          </Typography>
        </Box>

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
