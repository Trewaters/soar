import { Button, Paper, Stack } from '@mui/material'
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded'
import LightModeIcon from '@mui/icons-material/LightMode'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import Link from 'next/link'

export default function PlannerMenu() {
  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 2, m: 1, bgcolor: 'lightgray', width: '100%' }}
      >
        <Stack direction="column" useFlexGap={true} spacing={2}>
          <Link href="/PlannerGoal" passHref>
            <Button
              component="a"
              variant="contained"
              endIcon={<PriorityHighRoundedIcon />}
            >
              Goal
            </Button>
          </Link>
          <Button
            variant="contained"
            startIcon={<LightModeIcon />}
            sx={{ fontWeight: 'bold', fontSize: '150%' }}
          >
            Today
          </Button>
          <Button variant="contained" endIcon={<CloudUploadOutlinedIcon />}>
            History
          </Button>
        </Stack>
      </Paper>
    </>
  )
}
