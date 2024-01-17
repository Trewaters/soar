import postureData from '@interfaces/postureData'
import { Stack, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Paper from '@mui/material/Paper'

interface PostureCardProps {
  postureCardProp: postureData
}

export default function PostureCard({ postureCardProp }: PostureCardProps) {
  const posture = postureCardProp

  return (
    <Paper>
      <Card>
        <CardHeader title={posture?.display_name} subheader="posture name" />
        <CardMedia
          sx={{ height: 300, width: 200 }}
          image="yogaMat.jpg"
          title="yoga mat"
        />
        <CardContent>
          <Typography variant="body1">asana posture</Typography>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Pronunciation:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">posture.sanskrit_names</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Duration:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">3 breaths</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Meaning of Posture:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">
                posture.sanskrit_names[0].translation[0].description
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Intent of Posture:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">n/a</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Breath:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">(Inhale/Exhale)</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Dristi:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">
                optimal gaze for the position
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Difficulty:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">{posture?.difficulty}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Category:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">
                {`${posture?.category} ${posture?.subcategory} `}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Description:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">{posture?.description}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} direction="row">
            <Stack alignItems="flex-start">
              <Typography variant="body1">Completed:</Typography>
            </Stack>
            <Stack>
              <Typography variant="body1">(Done ✅) </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  )
}
