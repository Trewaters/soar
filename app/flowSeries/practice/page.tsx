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
  { id: 1, name: 'Mountain Series', flowSet: flows[0] },
  { id: 2, name: 'Tree Series', flowSet: flows[1] },
  { id: 3, name: 'Forward Bend Series', flowSet: flows[2] },
  { id: 4, name: 'Half Moon Series', flowSet: flows[3] },
]
/* use this later it was suggested by Ai
const flowSeries = [
  {
    name: 'Warrior Series',
    flows: [
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
    ],
  },
  {
    name: 'Sun Salutation Series',
    flows: [
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
    ],
  },
] */

export default function Page() {
  return (
    <>
      <Typography>Flow Series Practice</Typography>
      {flowSeries.map((flow) => (
        <Accordion key={flow.id}>
          <AccordionSummary>{flow.name}</AccordionSummary>
          <AccordionDetails>
            <Stack rowGap={2}>
              {flow.flowSet.map((pose) => (
                <Card key={pose} sx={{ width: '50%' }}>
                  <CardContent>
                    <Typography key={pose}>{pose}</Typography>
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
