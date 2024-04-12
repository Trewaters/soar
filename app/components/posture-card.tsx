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
  console.log('posture', posture)

  return (
    <Paper>
      <Card>
        <CardHeader
          sx={{ textAlign: 'center' }}
          title={posture?.display_name}
          subheader={posture?.name}
          color="primary"
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
              <Typography variant="overline">Pronunciation:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">
                {posture?.sanskrit_names[0].simplified}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Duration:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">3 breaths</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Meaning of Posture:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">Feel into the posture</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Intent of Posture:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">{posture?.benefits}</Typography>
              {/* <Typography variant="body1">
                Push through crown, thumb, pinkies, and heels
              </Typography> */}
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Breath:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">(Inhale/Exhale)</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Dristi:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">optimal gaze</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Difficulty:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">{posture?.difficulty}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Category:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">
                {`${posture?.category}, ${posture?.subcategory}`}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Description:</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body1">{posture?.description}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="overline">Completed:</Typography>
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
