'use client'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

const flows = {
  name: 'Sun Salutation A Series',
  postures: [
    'Mountain Pose',
    'Downward Dog',
    'Warrior 1',
    'Warrior 2',
    'Triangle Pose',
    'Tree Pose',
    "Child's Pose",
    'Corpse Pose',
  ],
}

export default function Page() {
  return (
    <>
      <Box sx={{ margin: 4 }}>
        <Typography variant="h1" textAlign="center">
          {flows.name}
        </Typography>
      </Box>
      <Stack rowGap={3} alignItems="center">
        {flows.postures.map((pose) => (
          <Card
            key={pose}
            sx={{
              width: '50%',
              boxShadow: 3,
              textAlign: 'center',
            }}
          >
            <CardContent>
              <Typography key={pose} variant="body1">
                {pose}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  )
}
