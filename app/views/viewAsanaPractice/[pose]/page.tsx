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
import { useRouter } from 'next/navigation'
import { getPostureByName } from '@lib/postureService'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import Image from 'next/image'

export default function ViewAsanaPractice({
  params,
}: {
  params: Promise<{ pose: string }>
}) {
  const { pose } = use(params)
  const [viewPose, setViewPose] = useState<FullAsanaData>()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [totalTime] = useState(300) // Default 5 minutes
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const { state, dispatch } = useTimer()
  const router = useRouter()

  // Show/hide controls based on user interaction only - no artificial timeouts
  const toggleControls = useCallback(() => {
    setShowControls(!showControls)
  }, [showControls])

  const handleTimeUpdate = (time: number) => {
    setElapsedTime(time)
  }

  // Sync local elapsedTime with timer context state
  useEffect(() => {
    // Always sync local state with context state
    setElapsedTime(state.watch.elapsedTime)
  }, [state.watch.elapsedTime])

  const handlePlayPause = () => {
    console.log('handlePlayPause called, current state:', {
      isPaused: state.watch.isPaused,
      isRunning: state.watch.isRunning,
      elapsedTime: state.watch.elapsedTime,
    })

    if (state.watch.isPaused) {
      // Timer is currently paused - start or resume
      if (state.watch.elapsedTime === 0 && !state.watch.isRunning) {
        // Starting from beginning
        console.log('Starting timer from beginning')
        dispatch({ type: 'START_TIMER' })
      } else {
        // Resuming from pause
        console.log('Resuming timer from pause')
        dispatch({ type: 'RESUME_TIMER' })
      }
    } else {
      // Timer is currently running - pause it
      console.log('Pausing timer')
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
        const responseData = await getPostureByName(decodedPose)
        setViewPose(responseData)
      } catch (error) {
        console.error('Error fetching posture:', error)
      }
    }
    getViewPose()
  }, [pose])

  // Controls are visible by default and can be toggled by user
  // No artificial timeouts - user controls when to show/hide

  const paperStyle = {
    backgroundImage: 'url(/images/asana/view-asana-practice-background.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundColor: 'primary.dark',
    cursor: showControls ? 'default' : 'none',
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
                onClick={() => router.push('/navigator/asanaPostures')}
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
                style={{ marginBottom: '8px' }}
              />
              <Typography
                variant="h4"
                textAlign="center"
                color="white"
                sx={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontWeight: 'bold',
                }}
              >
                {viewPose?.sort_english_name}
              </Typography>
            </Box>
          </Grid>

          <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={showInfo ? 'Hide Info' : 'Show Info'}>
              <IconButton
                onClick={() => setShowInfo(!showInfo)}
                sx={{ color: 'white' }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      {/* Center Content - Posture info and timer */}
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
        {/* Info Panel */}
        {showInfo && (
          <Box
            sx={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: 2,
              p: 3,
              mb: 3,
              maxWidth: '500px',
              opacity: showControls ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Typography variant="h6" color="white" gutterBottom>
              Pose Information
            </Typography>
            <Typography variant="body1" color="white" sx={{ mb: 1 }}>
              <strong>Category:</strong> {viewPose?.category}
            </Typography>
            <Typography variant="body1" color="white" sx={{ mb: 1 }}>
              <strong>Difficulty:</strong> {viewPose?.difficulty}
            </Typography>
            <Typography variant="body1" color="white" sx={{ mb: 1 }}>
              <strong>Breath:</strong> {viewPose?.breath_direction_default}
            </Typography>
            {viewPose?.description && (
              <Typography variant="body2" color="white">
                {viewPose.description}
              </Typography>
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
              }}
            >
              <Tooltip title="Stop">
                <IconButton
                  onClick={handleStop}
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
                  onClick={handlePlayPause}
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
                  onClick={handleRestart}
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
                }}
              >
                <Tooltip title="Previous Pose">
                  <IconButton
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
                      onClick={handleVolumeToggle}
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
                    onChange={handleVolumeChange}
                    sx={{
                      color: 'white',
                      width: { xs: 60, sm: 80 },
                      '& .MuiSlider-thumb': { width: 16, height: 16 },
                    }}
                  />
                </Box>

                <Tooltip title="Settings">
                  <IconButton
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
                    onClick={handleFullscreen}
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
