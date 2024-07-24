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
  // console.log('posture', posture)

  return (
    <Paper>
      <Card>
        <CardHeader
          sx={{
            textAlign: 'center',
            backgroundColor: 'primary.main',
            padding: 3,
            marginBottom: 2,
            '& .MuiCardHeader-title': {
              fontWeight: 'bold',
            },
            '& .MuiCardHeader-subheader': {
              fontWeight: 'light',
              color: 'primary.contrastText',
            },
          }}
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
            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 'bold',
                  color: '#555',
                }}
              >
                Description:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  color: '#333',
                }}
              >
                {posture?.description}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Pronunciation:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                {posture?.sanskrit_names[0].simplified}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Duration:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                3 breaths
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Meaning of Posture:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                Feel into the posture
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Intent of Posture:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                {posture?.benefits}
              </Typography>
              {/* <Typography variant="body1" sx={{ marginTop: 2, color: '#333' }}>
                Push through crown, thumb, pinkies, and heels
              </Typography> */}
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Breath:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                (Inhale/Exhale)
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Dristi:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                optimal gaze
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Difficulty:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                {posture?.difficulty}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Category:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                {`${posture?.category}, ${posture?.subcategory}`}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                border: '1px solid',
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontWeight: 'bold', color: '#555' }}
              >
                Completed:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 2,
                  marginTop: 2,
                  color: '#333',
                }}
              >
                (Done ✅){' '}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  )
}
