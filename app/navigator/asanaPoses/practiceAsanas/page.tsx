'use client'

import { useEffect, useState, useCallback } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { getAccessiblePoses, getPose, getAllPoses } from '@lib/poseService'
import { useSearchParams } from 'next/navigation'
import PoseActivityDetail from '@app/navigator/asanaPoses/poseActivityDetail'
import SplashHeader from '@app/clientComponents/splash-header'
import PoseSearch from '@app/navigator/asanaPoses/pose-search'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import { useSession } from 'next-auth/react'
import SubNavHeader from '@app/clientComponents/sub-nav-header'
import NAV_PATHS from '@app/utils/navigation/constants'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import { HELP_PATHS } from '@app/utils/helpLoader'
import { AsanaPose } from 'types/asana'
import { QuickTimer } from '@app/clientComponents/quickTimer'

export default function Page() {
  const { data: session } = useSession()
  const [posePropData, setPosePropData] = useState<AsanaPose[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedPose, setSelectedPose] = useState<AsanaPose | null>(null)
  const [selectedLoading, setSelectedLoading] = useState(false)
  const [selectedError, setSelectedError] = useState<string | null>(null)
  const searchParams = useSearchParams()

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

  // Watch for ?id= on the practice page and fetch pose details
  useEffect(() => {
    const id = searchParams?.get?.('id') || null
    if (!id) {
      setSelectedPose(null)
      setSelectedError(null)
      setSelectedLoading(false)
      return
    }

    let mounted = true
    const fetchPose = async () => {
      setSelectedLoading(true)
      setSelectedError(null)
      try {
        const pose = await getPose(id)
        if (mounted) {
          setSelectedPose(pose ?? null)
        }
      } catch (err: any) {
        // If pose not found by flexible lookup, attempt a tolerant fallback:
        // fetch all poses and try case-insensitive match on sort_english_name.
        try {
          const decoded = decodeURIComponent(id)
          const all = await getAllPoses()
          const match = all.find(
            (p: any) =>
              (p.sort_english_name || '').trim().toLowerCase() ===
              decoded.trim().toLowerCase()
          )
          if (mounted && match) {
            setSelectedPose(match)
            return
          }
        } catch (fallbackErr) {
          // ignore fallback errors
        }

        if (mounted) setSelectedError(err?.message || 'Failed to load pose')
      } finally {
        if (mounted) setSelectedLoading(false)
      }
    }

    fetchPose()
    return () => {
      mounted = false
    }
  }, [searchParams])

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
            <SubNavHeader mode="back" link={NAV_PATHS.ASANA_POSES} />
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
          {/* Inline Pose Detail */}
          <Box
            sx={{
              width: '100%',
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {selectedLoading && <LoadingSkeleton type="text" />}
            {selectedError && (
              <Typography color="error">{selectedError}</Typography>
            )}
            {selectedPose && (
              <Box sx={{ width: '100%', maxWidth: '900px' }}>
                <PoseActivityDetail
                  poseCardProp={selectedPose}
                  initialEditMode={searchParams?.get?.('edit') === 'true'}
                  showActions={false}
                  onSaveSuccess={async () => {
                    // Re-fetch the selected pose and visible list after a successful save
                    try {
                      setSelectedLoading(true)
                      setSelectedError(null)
                      const refreshed = await getPose(selectedPose.id)
                      setSelectedPose(refreshed ?? null)
                      // Refresh the listing as well
                      fetchData()
                    } catch (e: any) {
                      setSelectedError(e?.message || 'Failed to refresh pose')
                    } finally {
                      setSelectedLoading(false)
                    }
                  }}
                />
                <Box sx={{ height: '60px' }} />

                {/* Quick Timer Section - mirror dynamic page behavior */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    px: 2,
                  }}
                >
                  <QuickTimer
                    buttonText="+5 Minutes"
                    timerMinutes={5}
                    variant="default"
                    onTimerStart={() => {}}
                    onTimerEnd={() => {}}
                    onTimerUpdate={() => {}}
                    maxWidth="400px"
                  />
                </Box>
              </Box>
            )}
          </Box>
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
