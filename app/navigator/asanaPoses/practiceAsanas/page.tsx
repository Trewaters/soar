'use client'

import { useEffect, useState, useCallback } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { getAccessiblePoses } from '@lib/poseService'
import SplashHeader from '@app/clientComponents/splash-header'
import PoseSearch from '@app/navigator/asanaPoses/pose-search'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import { useSession } from 'next-auth/react'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
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
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              width: '87%',
              maxWidth: '384px',
              alignSelf: 'center',
            }}
          >
            <SubNavHeader mode="back" link="/navigator/asanaPoses" />
            <HelpButton onClick={handleInfoClick} />
          </Stack>
          <Stack sx={{ width: '100%', maxWidth: '600px' }}>
            {/* Search Section */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
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

      <HelpDrawer
        open={open}
        onClose={() => setOpen(false)}
        content={HELP_PATHS.asanas.practice}
      />
    </>
  )
}
