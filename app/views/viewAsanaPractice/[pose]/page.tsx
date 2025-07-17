'use client'
import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import AsanaTimer from '@app/clientComponents/asanaTimer'
import { useTimer } from '@context/timerContext'
import { useRouter } from 'next/navigation'
import HomeIcon from '@mui/icons-material/Home'
import { getPostureByName } from '@lib/postureService'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import Image from 'next/image'

export default function ViewAsanaPractice({
  params,
}: {
  params: { pose: string }
}) {
  // NOTES: include icons for more information like safety tips, focuse points, etc.

  /* call api/poses/?sort_english_name=${pose} */
  const [viewPose, setViewPose] = useState<FullAsanaData>()
  const [elapsedTime, setElapsedTime] = useState(0)
  // const [isPaused, setIsPaused] = useState(false)
  const { state, dispatch } = useTimer()
  const router = useRouter()

  const handleTimeUpdate = (time: number) => {
    setElapsedTime(time)
  }

  const handlePauseUpdate = (paused: boolean) => {
    dispatch({
      type: 'SET_TIMER',
      payload: {
        ...state.watch,
        isPaused: paused,
        startTime: Date.now(),
      },
    })
  }

  useEffect(() => {
    const getViewPose = async () => {
      try {
        // Decode the URL parameter to handle spaces and special characters
        const decodedPose = decodeURIComponent(params.pose)
        const responseData = await getPostureByName(decodedPose)
        setViewPose(responseData)
      } catch (error) {
        console.error('Error fetching posture:', error)
      }
    }
    getViewPose()
  }, [params.pose])

  const paperStyle = {
    backgroundImage: 'url(/images/asana/view-asana-practice-background.png)',
    backgroundSize: 'contain', // Changed from 'cover' to 'contain' to ensure full image is visible
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    // Add responsive padding for mobile optimization
    padding: { xs: 2, sm: 2.5, md: 3 }, // Responsive padding using theme breakpoints
    // Optional: Add a fallback background color
    backgroundColor: 'primary.dark', // In case image doesn't load
  }

  const handleIconButtonClick = () => {
    const newPauseState = !state.watch.isPaused
    dispatch({
      type: 'SET_TIMER',
      payload: {
        ...state.watch,
        isPaused: !newPauseState,
        startTime: Date.now(),
      },
    })
    // console.log('state.watch', state.watch)
  }

  const handleBackClick = () => {
    // console.log('Back Clicked')
    router.push('/navigator/asanaPostures')
  }
  return (
    <>
      <Box sx={{ height: 'auto', width: '100vw' }}>
        <Image
          src="/logo/Main Logo in Contrast Light150px.png"
          alt="UvuYoga Logo"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <Paper sx={paperStyle}>
        <Grid container>
          <Grid size={12}>
            <Typography variant="h1" textAlign={'center'} color={'white'}>
              Asana Practice
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle1" color={'white'}>
              {viewPose?.sort_english_name}
            </Typography>
          </Grid>
          {/* 
        <Grid size={6}>
        <Typography variant="subtitle1" color={'white'}>
        [PROGRESS_BAR]`
        </Typography>
        </Grid>
        
        <Grid size={12}>
        <Typography variant="body1" color={'white'}>
        Next: {viewPose?.next_poses}
        </Typography>
        </Grid>
        
        <Grid size={12}>
        <Typography variant="body1" color={'white'}>
        [SERIES NAME]
        </Typography>
        </Grid>
        
        <Grid size={12}>
        <Typography variant="body1" color={'white'}>
        [TIMER... TIME REMAINING]
        </Typography>
        </Grid>
        
        <Grid size={12}>
        <Typography variant="body1" color={'white'}>
        [TIMER... TOTAL TIME]
        </Typography>
        </Grid>
        */}

          <Grid size={12}>
            <AsanaTimer
              onTimeUpdate={handleTimeUpdate}
              onPauseUpdate={handlePauseUpdate}
            />
          </Grid>

          <Grid size={2}>
            <IconButton onClick={handleIconButtonClick}>
              {state.watch.isPaused ? (
                <PlayCircleIcon
                  sx={{ color: 'white', height: 40, width: 40 }}
                />
              ) : (
                <PauseCircleIcon
                  sx={{ color: 'white', height: 40, width: 40 }}
                />
              )}
            </IconButton>
          </Grid>

          <Grid size={8}>
            <Button sx={{ color: 'white' }}>NEXT</Button>
          </Grid>
          <Grid size={2}>
            <IconButton sx={{ color: 'white' }} onClick={handleBackClick}>
              <HomeIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
