'use client'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'

const flows = [
  ['Mountain Pose', 'Downward Dog', 'Warrior 1', 'Warrior 2', 'Triangle Pose'],
  ['Tree Pose', "Child's Pose", 'Corpse Pose', 'Bridge Pose', 'Camel Pose'],
  [
    'Seated Forward Bend',
    'Cobra Pose',
    'Plank Pose',
    'Four-Limbed Staff Pose',
    'Crow Pose',
  ],
  ['Half Moon Pose', 'Chair Pose', 'Eagle Pose', 'Garland Pose', 'Boat Pose'],
  [
    'Mountain Pose',
    'Downward Dog',
    'Warrior 1',
    'Warrior 2',
    'Triangle Pose',
    'Tree Pose',
    "Child's Pose",
    'Corpse Pose',
  ],
]
const flowSeries = [
  { id: 1, name: 'Mountain Series 1', flowSet: flows[0] },
  { id: 2, name: 'Tree Series', flowSet: flows[1] },
  { id: 3, name: 'Forward Bend Series', flowSet: flows[2] },
  { id: 4, name: 'Half Moon Series', flowSet: flows[3] },
  { id: 5, name: 'Mountain Series 2', flowSet: flows[4] },
]

export default function Page() {
  return (
    <>
      <Typography variant="h1" textAlign="center">
        Flow Series Practice
      </Typography>
      {flowSeries.map((flow) => (
        <Accordion
          key={flow.id}
          sx={{ pb: '1em', borderWidth: '3px', margin: 3 }}
          disableGutters
        >
          <AccordionSummary sx={{ ml: 2, pt: 3 }}>
            <Typography variant="h2">{flow.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack rowGap={3} alignItems="center">
              {flow.flowSet.map((pose) => (
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
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}
