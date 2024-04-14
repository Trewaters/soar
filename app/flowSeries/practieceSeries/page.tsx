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

const flowSeries = [
  {
    id: 1,
    seriesName: 'Integration Series',
    seriesSet: [
      "Child's Pose Balasana",
      'Downward Facing Dog, Adho Mukha Svanasana',
      'Ragdoll, Uttanasana',
      'Stand at Attention, Samsthiti',
    ],
  },
  {
    id: 2,
    seriesName: 'Sun Salutation A Series',
    seriesSet: [
      'Mountain Pose, Tadasana',
      'Standing Forward Fold, Uttanasana',
      'Halfway Lift Ardha, Uttanasana',
      'High to Low Plank, Chaturanga Dandasana',
      'Upward Facing Dog, Urdhva Mukha Svanasana',
      'Downward Facing Dog, Adho Mukha Svanasana',
    ],
  },
  {
    id: 3,
    seriesName: 'Sun Salutation B Series',
    seriesSet: [
      'Chair Pose, Utkatasana',
      'Standing Forward Fold, Uttanasana',
      'Halfway Lift, Ardha Uttanasana',
      'High to Low Plank, Chaturanga Dandasana',
      'Upward Facing Dog, Urdhva Mukha Svanasana',
      'Downward Facing Dog, Adho Mukha Svanasana',
      'Warrior Two, Virabhadrasana II',
      'Extended Side Angle, Utthita Parsvakonasana',
      'Reverse Warrior, Parivrtta Virabhadrasana II',
      'High to Low Plank, Chaturanga Dandasana',
    ],
  },
  {
    id: 4,
    seriesName: 'Core Series',
    seriesSet: [
      'Reclined Bound Angle Sit Ups, Supta Baddha Konasana Sit Ups',
      'Bicycle Twists',
      'Boat Pose, Navasana',
    ],
  },
  {
    id: 5,
    seriesName: 'Crescent Lunge Series',
    seriesSet: [
      'Crescent Lunge, Anjanayesana',
      'Revolved Crescent Lunge, Parivrtta Anjanayesana',
      "Runner's Lunge, Anjaneyasana",
      'Side Plank, Vasisthasana',
      'Prayer Twist, Parivrtta Utkatasana',
      'Gorilla Pose, Padahastasana',
      'Crow Pose, Bakasana',
    ],
  },
  {
    id: 6,
    seriesName: 'Balancing Series',
    seriesSet: [
      'Eagle Pose, Garudasana',
      "Dancer's Pose, Natarajasana",
      'Tree Pose, Vrksasana',
    ],
  },
  {
    id: 7,
    seriesName: 'Triangle Series',
    seriesSet: [
      'Warrior One, Virabhadrasana I',
      'Warrior Two, Virabhadrasana II',
      'Triangle Pose, Trikonasana',
      'Wide Leg Forward Fold, Paschimottansana',
    ],
  },
  {
    id: 8,
    seriesName: 'Hip Series',
    seriesSet: ['Half Pigeon Eka Pada Rajakapotasana'],
  },
  {
    id: 9,
    seriesName: 'Spine Series',
    seriesSet: [
      'Cobra Pose, Bhujangasana',
      'Bow Pose, Dhanurasana',
      'Camel Pose, Ustrasana',
      'Bridge Pose, Setu Bandha Sarvangasana',
      'Reclined Bound Angle Pose, Supta Baddha Konasana',
    ],
  },
  {
    id: 10,
    seriesName: 'Surrender Series',
    seriesSet: [
      'Seated Forward Fold, Paschimittonasana',
      'Happy Baby, Ananda Balasana',
      'Supine Twist, Jathara Parivartanasana',
      'Corpse Pose, Savasana',
      'Easy Pose, Sukhasana',
    ],
  },
]

export default function Page() {
  return (
    <>
      <Typography variant="h2" textAlign="center">
        Series Practice
      </Typography>
      {flowSeries.map((flow) => (
        <Accordion
          key={flow.id}
          sx={{ pb: '1em', borderWidth: '3px', margin: 3 }}
          disableGutters
        >
          <AccordionSummary sx={{ ml: 2, pt: 3 }}>
            <Typography variant="h3">{flow.seriesName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack rowGap={3} alignItems="center">
              {flow.seriesSet.map((pose) => (
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
