'use client'
import { FlowSeriesData } from '@app/interfaces/flowSeries'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Page() {
  const [series, setSeries] = useState<FlowSeriesData[]>([])

  async function fetchData() {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    const url = new URL('/api/series/', baseUrl)
    const res = await fetch(url.toString())
    const data = await res.json()
    // console.log('fetchData seriesMany', data)
    setSeries(data)
    return data
  }

  useEffect(() => {
    fetchData()
  }, [series])

  return (
    <>
      {series &&
        series.length > 0 &&
        series.map((series) => (
          <Box width="100%" textAlign="center" marginTop={4} key={series.id}>
            <Typography variant="h2">Practice Series</Typography>
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
                    borderColor: 'primary.light',
                    borderWidth: '1px',
                    borderStyle: 'solid',
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
                      priority={true}
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
        ))}
      {/* <Box width="100%" textAlign="center" marginTop={4}>
        <Typography variant="h2">Practice Series</Typography>
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
                borderColor: 'primary.light',
                borderWidth: '1px',
                borderStyle: 'solid',
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
                  priority={true}
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
      </Box> */}
    </>
  )
}
