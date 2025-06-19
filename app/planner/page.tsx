'use client'

import { Button, Paper, Stack } from '@mui/material'
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded'
import LightModeIcon from '@mui/icons-material/LightMode'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

export default function Page() {
  return (
    <Paper
      component="main"
      elevation={3}
      sx={{ p: 2, m: 1, bgcolor: 'lightgray', width: '100%' }}
      aria-labelledby="planner-title"
    >
      <nav aria-label="Planner navigation">
        <Stack direction="column" useFlexGap={true} spacing={2}>
          <Button
            component="a"
            variant="contained"
            aria-label="Navigate to goals section"
            endIcon={<PriorityHighRoundedIcon aria-hidden="true" />}
            sx={{
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            Goal
          </Button>
          <Button
            component="a"
            variant="contained"
            aria-label="Navigate to today's plan"
            startIcon={<LightModeIcon aria-hidden="true" />}
            sx={{
              fontWeight: 'bold',
              fontSize: '150%',
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            Today
          </Button>
          <Button
            component="a"
            variant="contained"
            aria-label="Navigate to history section"
            endIcon={<CloudUploadOutlinedIcon aria-hidden="true" />}
            sx={{
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            History
          </Button>
        </Stack>
      </nav>
    </Paper>
  )
}
