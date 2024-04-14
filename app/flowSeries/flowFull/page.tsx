'use client'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'

export default function Page() {
  const flowFull = [
    {
      id: 1,
      nameFullFlow: 'Mountain Flow',
      series: [
        {
          seriesName: 'Mountain Series 1',
          seriesSet: [
            'Mountain Pose',
            'Downward Dog',
            'Warrior 1',
            'Warrior 2',
            'Triangle Pose',
          ],
        },
        {
          seriesName: 'Mountain Series 2',
          seriesSet: [
            'Tree Pose',
            "Child's Pose",
            'Corpse Pose',
            'Bridge Pose',
            'Camel Pose',
          ],
        },
        {
          seriesName: 'Mountain Series 4',
          seriesSet: [
            'Seated Forward Bend',
            'Cobra Pose',
            'Plank Pose',
            'Four-Limbed Staff Pose',
            'Crow Pose',
          ],
        },
        {
          seriesName: 'Mountain Series 5',
          seriesSet: [
            'Half Moon Pose',
            'Chair Pose',
            'Eagle Pose',
            'Garland Pose',
            'Boat Pose',
          ],
        },
      ],
    },
  ]
  return (
    <Paper>
      {flowFull.map((flow) => (
        <React.Fragment key={flow.id}>
          <Box sx={{ margin: 4 }}>
            <Typography variant="h1" textAlign="center">
              {flow.nameFullFlow}
            </Typography>
          </Box>
          <Stack rowGap={3} alignItems="center">
            {flow.series.map((seriesMini, i) => (
              <Card
                key={i}
                sx={{
                  width: '50%',
                  boxShadow: 3,
                  textAlign: 'center',
                }}
              >
                <CardHeader title={seriesMini.seriesName} />
                <CardContent>
                  {seriesMini.seriesSet.map((asana, asanaIndex) => (
                    <Typography key={asanaIndex} variant="body1">
                      {asana}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </React.Fragment>
      ))}
    </Paper>
  )
}
