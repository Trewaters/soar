'use client'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

const series = {
  seriesName: 'Integration Series',
  seriesPostures: [
    "Child's Pose Balasana",
    'Downward Facing Dog, Adho Mukha Svanasana',
    'Ragdoll, Uttanasana',
    'Stand at Attention, Samsthiti',
  ],
}

export default function Page() {
  return (
    <>
      <Box sx={{ margin: 4 }}>
        <Typography variant="h2" textAlign="center">
          Single Series
        </Typography>
        <Typography variant="h3" textAlign="center">
          {series.seriesName}
        </Typography>
      </Box>
      <Stack rowGap={3} alignItems="center">
        {series.seriesPostures.map((pose) => (
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
