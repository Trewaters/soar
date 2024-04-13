'use client'
import { Card, CardContent, Stack, Typography } from '@mui/material'

const flowSeries = [
  'Mountain Pose',
  'Downward Dog',
  'Warrior 1',
  'Warrior 2',
  'Triangle Pose',
  'Tree Pose',
  "Child's Pose",
  'Corpse Pose',
]

export default function Page() {
  return (
    <>
      <Typography>Flow Series Practice</Typography>
      <Stack>
        {flowSeries.map((pose) => (
          <Card key={pose}>
            <CardContent>
              <Typography key={pose}>{pose}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  )
}
