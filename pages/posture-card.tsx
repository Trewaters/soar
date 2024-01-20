import postureData from '@interfaces/postureData'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Paper from '@mui/material/Paper'
import Image from 'next/image'

interface PostureCardProps {
  postureCardProp: postureData
}

export default function PostureCard({ postureCardProp }: PostureCardProps) {
  const posture = postureCardProp

  return (
    <Paper>
      <Card>
        <CardHeader
          sx={{ textAlign: 'center' }}
          title={posture?.display_name}
          subheader={posture?.name}
        />
        <CardMedia sx={{ width: '50%', margin: 'auto' }}>
          <Image
            src="/resized-posture card - generic.jpg"
            alt="Yoga Posture Image"
            width={500}
            height={500}
            layout="responsive"
          />
        </CardMedia>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="label">Pronunciation:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">posture.sanskrit_names</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="label">Duration:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">3 breaths</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Meaning of Posture:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">
                posture.sanskrit_names[0].translation[0].description
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Intent of Posture:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">n/a</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Breath:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">(Inhale/Exhale)</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Dristi:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">
                optimal gaze for the position
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Difficulty:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">{posture?.difficulty}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Category:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">
                {`${posture?.category} ${posture?.subcategory} `}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Description:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">{posture?.description}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="label">Completed:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">(Done ✅) </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  )
}
