'use client'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material'
import Image from 'next/image'

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
      <Box width="100%" textAlign="center" marginTop={4}>
        <Typography variant="h2">Single Series</Typography>
        <Typography variant="h3">{series.seriesName}</Typography>
        <Stack rowGap={3} alignItems="center" marginTop={4}>
          {series.seriesPostures.map((pose) => (
            <Card
              key={pose}
              sx={{
                width: '100%',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/stick-tree-pose-400x400.png"
                  alt="Yoga Posture Image"
                  width={100}
                  height={100}
                  layout="fixed"
                />
              </CardMedia>
              <CardContent sx={{ flex: '1 1 auto' }}>
                <Typography textAlign={'left'} variant="body1">
                  {pose}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </>
  )
}
