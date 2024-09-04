'use client'
import PostureData from '@app/interfaces/postureData'
import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

export default function ViewAsanaPractice() {
  /* call api/poses/?english_name=${pose_name} */
  const [viewPose, setViewPose] = useState<PostureData>()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const getViewPose = async () => {
      const response = await fetch('/api/poses/?english_name=Archer')
      const responseData = await response.json()
      setViewPose(responseData)
      // return await response.json()
    }
    getViewPose()
  }, [])
  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h1">VIEW: Asana Pose Practice</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle1">{viewPose?.english_name}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">[PROGRESS_BAR]</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">Next: {viewPose?.next_poses}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">[SERIES NAME]</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">[TIMER... TIME REMAINING]</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">[TIMER... TOTAL TIME]</Typography>
        </Grid>

        <Grid item xs={2}>
          <IconButton>
            {isPaused ? <PlayCircleIcon /> : <PauseCircleIcon />}
          </IconButton>
        </Grid>

        <Grid item xs={10}>
          <Button>NEXT</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
