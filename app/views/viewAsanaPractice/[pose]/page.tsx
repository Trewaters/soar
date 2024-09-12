'use client'
import PostureData from '@app/interfaces/postureData'
import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import AsanaTimer from '@app/clientComponents/asanaTimer'
import { useTimer } from '@app/context/timerContext'
import { useRouter } from 'next/navigation'
import HomeIcon from '@mui/icons-material/Home'

export default function ViewAsanaPractice({
  params,
}: {
  params: { pose: string }
}) {
  // NOTES: include icons for more information like safety tips, focuse points, etc.

  /* call api/poses/?english_name=${pose} */
  const [viewPose, setViewPose] = useState<PostureData>()
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
      const response = await fetch(`/api/poses/?english_name=${params.pose}`)
      const responseData = await response.json()
      setViewPose(responseData)
      // return await response.json()
    }
    getViewPose()
  }, [params.pose])

  const paperStyle = {
    backgroundImage: 'url(/PismoBeachSunset-2020-03-19.JPG)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
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
    console.log('state.watch', state.watch)
  }

  const handleBackClick = () => {
    console.log('Back Clicked')
    router.push('/navigator/asanaPostures')
  }

  return (
    <Paper style={paperStyle}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h1" textAlign={'center'} color={'white'}>
            Asana Practice
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle1" color={'white'}>
            {viewPose?.english_name}
          </Typography>
        </Grid>
        {/* 
        <Grid item xs={6}>
          <Typography variant="subtitle1" color={'white'}>
            [PROGRESS_BAR]`
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" color={'white'}>
            Next: {viewPose?.next_poses}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" color={'white'}>
            [SERIES NAME]
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" color={'white'}>
            [TIMER... TIME REMAINING]
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" color={'white'}>
            [TIMER... TOTAL TIME]
          </Typography>
        </Grid>
 */}

        <Grid item xs={12}>
          <AsanaTimer
            onTimeUpdate={handleTimeUpdate}
            onPauseUpdate={handlePauseUpdate}
          />
        </Grid>

        <Grid item xs={2}>
          <IconButton onClick={handleIconButtonClick}>
            {state.watch.isPaused ? (
              <PlayCircleIcon sx={{ color: 'white', height: 40, width: 40 }} />
            ) : (
              <PauseCircleIcon sx={{ color: 'white', height: 40, width: 40 }} />
            )}
          </IconButton>
        </Grid>

        <Grid item xs={8}>
          <Button>NEXT</Button>
        </Grid>
        <Grid item xs={2}>
          <IconButton sx={{ color: 'white' }} onClick={handleBackClick}>
            <HomeIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  )
}
