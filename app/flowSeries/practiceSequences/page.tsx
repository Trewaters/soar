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
  const sequence = [
    {
      id: 1,
      nameSequence: 'C1 Sequence',
      sequencesSeries: [
        {
          seriesName: 'Integration Series',
          seriesSet: [
            "Child's Pose Balasana",
            'Downward Facing Dog, Adho Mukha Svanasana',
            'Ragdoll, Uttanasana',
            'Stand at Attention, Samsthiti',
          ],
        },
        {
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
          seriesName: 'Balancing Series',
          seriesSet: [
            'Eagle Pose, Garudasana',
            "Dancer's Pose, Natarajasana",
            'Tree Pose, Vrksasana',
          ],
        },
        {
          seriesName: 'Triangle Series',
          seriesSet: [
            'Warrior One, Virabhadrasana I',
            'Warrior Two, Virabhadrasana II',
            'Triangle Pose, Trikonasana',
            'Wide Leg Forward Fold, Paschimottansana',
          ],
        },
        {
          seriesName: 'Hip Series',
          seriesSet: ['Half Pigeon Eka Pada Rajakapotasana'],
        },
        {
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
          seriesName: 'Surrender Series',
          seriesSet: [
            'Seated Forward Fold, Paschimittonasana',
            'Happy Baby, Ananda Balasana',
            'Supine Twist, Jathara Parivartanasana',
            'Corpse Pose, Savasana',
            'Easy Pose, Sukhasana',
          ],
        },
      ],
    },
  ]
  return (
    <Paper>
      <Typography variant="h2" align="center">
        Practice Sequences
      </Typography>
      {sequence.map((flow) => (
        <React.Fragment key={flow.id}>
          <Box sx={{ margin: 4 }}>
            <Typography variant="h3" textAlign="center">
              {flow.nameSequence}
            </Typography>
          </Box>
          <Stack rowGap={3} alignItems="center">
            {flow.sequencesSeries.map((seriesMini, i) => (
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
                    <Typography
                      key={asanaIndex}
                      textAlign={'left'}
                      variant="body1"
                    >
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
