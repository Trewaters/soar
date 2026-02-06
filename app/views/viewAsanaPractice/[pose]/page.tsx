'use client'
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Slider,
  Tooltip,
  LinearProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState, useCallback, use } from 'react'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopIcon from '@mui/icons-material/Stop'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoIcon from '@mui/icons-material/Info'
import HomeIcon from '@mui/icons-material/Home'
import AsanaTimer from '@app/clientComponents/asanaTimer'
import { useTimer } from '@context/timerContext'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { useSession } from 'next-auth/react'
import { getAccessiblePoses, getPoseByName } from '@lib/poseService'
import { orderPosesForSearch } from '@app/utils/search/orderPosesForSearch'
import getAsanaTitle from '@app/utils/search/getAsanaTitle'
import getAlphaUserIds from '@app/lib/alphaUsers'
import Image from 'next/image'
import { AsanaPose } from 'types/asana'
import NAV_PATHS from '@app/utils/navigation/constants'

export default function ViewAsanaPractice({
  params,
}: {
  params: Promise<{ pose: string }>
}) {
  const { pose } = use(params)
  const [viewPose, setViewPose] = useState<AsanaPose>()
  const [allPoses, setAllPoses] = useState<AsanaPose[]>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [totalTime] = useState(300) // Default 5 minutes
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const { state, dispatch } = useTimer()
  const router = useNavigationWithLoading()
  const { data: session } = useSession()

  // Show/hide controls based on user interaction
  const toggleControls = useCallback(() => {
    if (showInfo) {
      setShowInfo(false)
      // When closing info, usually users want to see the controls again
      setShowControls(true)
    } else {
      setShowControls(!showControls)
    }
  }, [showControls, showInfo])

  const handleInfoToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextShowInfo = !showInfo
    setShowInfo(nextShowInfo)
    // Automatically hide controls when info is displayed as requested
    if (nextShowInfo) {
      setShowControls(false)
    }
  }

  const handleTimeUpdate = useCallback((time: number) => {
    setElapsedTime(time)
  }, [])

  // Sync local elapsedTime with timer context state
  useEffect(() => {
    // Always sync local state with context state
    setElapsedTime(state.watch.elapsedTime)
  }, [state.watch.elapsedTime])

  const handlePlayPause = () => {
    if (state.watch.isPaused) {
      // Timer is currently paused - start or resume
      if (state.watch.elapsedTime === 0 && !state.watch.isRunning) {
        // Starting from beginning
        dispatch({ type: 'START_TIMER' })
      } else {
        // Resuming from pause
        dispatch({ type: 'RESUME_TIMER' })
      }
    } else {
      // Timer is currently running - pause it
      dispatch({ type: 'PAUSE_TIMER' })
    }
  }

  const handleStop = () => {
    // Stop the timer completely (this sets isPaused: true, isRunning: false, elapsedTime: 0)
    dispatch({ type: 'STOP_TIMER' })
    // Reset the local elapsed time to sync with the context
    setElapsedTime(0)
  }

  const handleRestart = () => {
    dispatch({ type: 'RESET_TIMER' })
    setElapsedTime(0)
    // Immediately start timer after reset
    dispatch({ type: 'START_TIMER' })
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue
    setVolume(value)
    if (value > 0) setIsMuted(false)
  }

  const handleProgressClick = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * totalTime
    setElapsedTime(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0

  useEffect(() => {
    const getViewPose = async () => {
      try {
        const decodedPose = decodeURIComponent(pose)
        const responseData = await getPoseByName(decodedPose)
        setViewPose(responseData)
      } catch (error) {
        console.error('Error fetching pose:', error)
      }
    }
    getViewPose()
  }, [pose])

  useEffect(() => {
    const fetchAllPoses = async () => {
      try {
        const poses = await getAccessiblePoses()
        const alphaUserIds = getAlphaUserIds()

        // Map to enriched poses (adding createdBy for the ordering utility)
        const enrichedPoses = poses.map((p) => ({
          ...p,
          createdBy: (p as any).created_by ?? undefined,
        }))

        const ordered = orderPosesForSearch(
          enrichedPoses,
          session?.user?.id,
          alphaUserIds,
          (p) =>
            getAsanaTitle({
              displayName: (p as any).displayName,
              englishName: p.sort_english_name,
              title: p.label,
            })
        )
        setAllPoses(ordered)
      } catch (error) {
        console.error('Error fetching all poses:', error)
      }
    }
    fetchAllPoses()
  }, [session])

  const handleNextPose = () => {
    if (allPoses.length === 0 || !viewPose) return
    const currentIndex = allPoses.findIndex((p) => p.id === viewPose.id)
    if (currentIndex === -1) return

    const nextIndex = (currentIndex + 1) % allPoses.length
    const nextPose = allPoses[nextIndex]
    router.push(
      `${NAV_PATHS.VIEW_ASANA_PRACTICE}/${encodeURIComponent(
        nextPose.sort_english_name
      )}`,
      undefined,
      { scroll: false }
    )
  }

  const handlePrevPose = () => {
    if (allPoses.length === 0 || !viewPose) return
    const currentIndex = allPoses.findIndex((p) => p.id === viewPose.id)
    if (currentIndex === -1) return

    const prevIndex = (currentIndex - 1 + allPoses.length) % allPoses.length
    const prevPose = allPoses[prevIndex]
    router.push(
      `${NAV_PATHS.VIEW_ASANA_PRACTICE}/${encodeURIComponent(
        prevPose.sort_english_name
      )}`,
      undefined,
      { scroll: false }
    )
  }

  // Controls are visible by default and can be toggled by user
  // No artificial timeouts - user controls when to show/hide

  const paperStyle = {
    backgroundImage: 'url(/images/asana/view-asana-practice-background.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundColor: 'primary.dark',
    cursor: showControls || showInfo ? 'default' : 'none',
  }

  return (
    <Paper sx={paperStyle} onClick={toggleControls}>
      {/* Header - Always visible when controls are shown */}
      <Box
        sx={{
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
          p: 2,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid size={2}>
            <Tooltip title="Back to Asanas">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(NAV_PATHS.ASANA_POSES, undefined, {
                    scroll: false,
                  })
                }}
                sx={{ color: 'white' }}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid size={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image
                src="/logo/Main Logo in Contrast Light150px.png"
                alt="Soar Yoga main logo"
                width={120}
                height={16}
              />
            </Box>
          </Grid>

          <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={showInfo ? 'Hide Info' : 'Show Info'}>
              <IconButton onClick={handleInfoToggle} sx={{ color: 'white' }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* Center Content - Pose info and timer */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          color="white"
          sx={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          {viewPose?.sort_english_name}
        </Typography>

        {/* Info Panel */}
        {showInfo && (
          <Box
            sx={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderRadius: 2,
              p: 3,
              mb: 3,
              maxWidth: '600px',
              maxHeight: '70vh',
              overflowY: 'auto',
              transition: 'opacity 0.3s ease',
              position: 'relative',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" color="white" gutterBottom>
              Pose Information
            </Typography>

            {/* Basic Info */}
            {viewPose?.category && (
              <Typography variant="body1" color="white" sx={{ mb: 1 }}>
                <strong>Category:</strong> {viewPose.category}
              </Typography>
            )}
            {viewPose?.difficulty && (
              <Typography variant="body1" color="white" sx={{ mb: 1 }}>
                <strong>Difficulty:</strong> {viewPose.difficulty}
              </Typography>
            )}
            {/* Pose-level breath intentionally hidden; series-level breath is still supported */}

            {/* Names */}
            {viewPose?.sanskrit_names &&
              Array.isArray(viewPose.sanskrit_names) &&
              viewPose.sanskrit_names.length > 0 && (
                <Typography variant="body1" color="white" sx={{ mb: 1 }}>
                  <strong>Sanskrit:</strong>{' '}
                  {viewPose.sanskrit_names.join(', ')}
                </Typography>
              )}
            {viewPose?.english_names &&
              Array.isArray(viewPose.english_names) &&
              viewPose.english_names.length > 0 && (
                <Typography variant="body1" color="white" sx={{ mb: 1 }}>
                  <strong>Also Known As:</strong>{' '}
                  {viewPose.english_names.join(', ')}
                </Typography>
              )}

            {/* Description */}
            {viewPose?.description && (
              <Typography variant="body2" color="white" sx={{ mb: 2 }}>
                {viewPose.description}
              </Typography>
            )}

            {/* Dristi */}
            {viewPose?.dristi && (
              <Typography variant="body2" color="white" sx={{ mb: 1 }}>
                <strong>Dristi (Gaze):</strong> {viewPose.dristi}
              </Typography>
            )}

            {/* Setup Cues */}
            {viewPose?.setup_cues && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="white" sx={{ mb: 0.5 }}>
                  <strong>Setup Cues:</strong>
                </Typography>
                <Typography variant="body2" color="white">
                  {viewPose.setup_cues}
                </Typography>
              </Box>
            )}

            {/* Deepening Cues */}
            {viewPose?.deepening_cues && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="white" sx={{ mb: 0.5 }}>
                  <strong>Deepening Cues:</strong>
                </Typography>
                <Typography variant="body2" color="white">
                  {viewPose.deepening_cues}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Main Timer Display */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            color="white"
            sx={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {formatTime(elapsedTime)}
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              opacity: 0.8,
            }}
          >
            / {formatTime(totalTime)}
          </Typography>
        </Box>

        <AsanaTimer onTimeUpdate={handleTimeUpdate} />
      </Box>

      {/* Bottom Controls - Music player style */}
      <Box
        sx={{
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          p: 2,
        }}
      >
        {/* Progress Bar */}
        <Box sx={{ mb: 2, px: 2 }}>
          <Box
            sx={{
              height: 8,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 4,
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            onClick={handleProgressClick}
          >
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: '100%',
                backgroundColor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'primary.main',
                  transition: 'transform 0.1s ease',
                },
              }}
            />
          </Box>

          {/* Time indicators */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="white">
              {formatTime(elapsedTime)}
            </Typography>
            <Typography variant="caption" color="white">
              -{formatTime(totalTime - elapsedTime)}
            </Typography>
          </Box>
        </Box>

        {/* Main Controls */}
        <Grid container spacing={2}>
          {/* Primary controls - Always centered */}
          <Grid size={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 1, sm: 2 },
                mb: { xs: 2, sm: 0 },
                pointerEvents: showControls ? 'auto' : 'none',
              }}
            >
              <Tooltip title="Stop">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStop()
                  }}
                  sx={{
                    color: 'white',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  <StopIcon fontSize="large" />
                </IconButton>
              </Tooltip>

              <Tooltip title={state.watch.isPaused ? 'Play' : 'Pause'}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayPause()
                  }}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                    minWidth: 60,
                    minHeight: 60,
                  }}
                >
                  {state.watch.isPaused ? (
                    <PlayCircleIcon sx={{ fontSize: { xs: 48, sm: 60 } }} />
                  ) : (
                    <PauseCircleIcon sx={{ fontSize: { xs: 48, sm: 60 } }} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Restart">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRestart()
                  }}
                  sx={{
                    color: 'white',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  <RestartAltIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* Secondary controls row */}
          <Grid size={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 1 },
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Navigation controls */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  pointerEvents: showControls ? 'auto' : 'none',
                }}
              >
                <Tooltip title="Previous Pose">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrevPose()
                    }}
                    sx={{
                      color: 'white',
                      minWidth: 44,
                      minHeight: 44,
                    }}
                  >
                    <SkipPreviousIcon fontSize="large" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Next Pose">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNextPose()
                    }}
                    sx={{
                      color: 'white',
                      minWidth: 44,
                      minHeight: 44,
                    }}
                  >
                    <SkipNextIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Volume and settings controls */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  flexWrap: 'wrap',
                  pointerEvents: showControls ? 'auto' : 'none',
                }}
              >
                {/* Volume Control */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: { xs: 'auto', sm: 100 },
                  }}
                >
                  <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVolumeToggle()
                      }}
                      sx={{
                        color: 'white',
                        minWidth: 44,
                        minHeight: 44,
                      }}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeOffIcon />
                      ) : (
                        <VolumeUpIcon />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Slider
                    size="small"
                    value={isMuted ? 0 : volume}
                    onChange={(e, v) => {
                      handleVolumeChange(e as any, v)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: 'white',
                      width: { xs: 60, sm: 80 },
                      '& .MuiSlider-thumb': { width: 16, height: 16 },
                    }}
                  />
                </Box>

                <Tooltip title="Settings">
                  <IconButton
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: 'white',
                      minWidth: 44,
                      minHeight: 44,
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFullscreen()
                    }}
                    sx={{
                      color: 'white',
                      minWidth: 44,
                      minHeight: 44,
                    }}
                  >
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
