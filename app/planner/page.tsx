import { Button, Paper, Stack } from '@mui/material'
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded'
import LightModeIcon from '@mui/icons-material/LightMode'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

export default function Page() {
  return (
    <Paper
      elevation={3}
      sx={{ p: 2, m: 1, bgcolor: 'lightgray', width: '100%' }}
    >
      <Stack direction="column" useFlexGap={true} spacing={2}>
        <Button
          component="a"
          variant="contained"
          endIcon={<PriorityHighRoundedIcon />}
        >
          Goal
        </Button>
        <Button
          component="a"
          variant="contained"
          startIcon={<LightModeIcon />}
          sx={{ fontWeight: 'bold', fontSize: '150%' }}
        >
          Today
        </Button>
        <Button
          component="a"
          variant="contained"
          endIcon={<CloudUploadOutlinedIcon />}
        >
          History
        </Button>
      </Stack>
    </Paper>
  )
}
