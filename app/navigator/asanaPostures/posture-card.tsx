import PostureCardFields from '@interfaces/postureData'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

interface PostureCardProps {
  postureCardProp: PostureCardFields
}

export default function PostureCard({ postureCardProp }: PostureCardProps) {
  const posture = postureCardProp
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
          title={posture?.english_name}
          subheader={posture?.simplified_english_name}
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
                  padding: 4,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                Sanskrit Name:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
                }}
              >
                {posture?.sanskrit_names?.[0]?.simplified ??
                  'Sanskrit Name not-found'}
              </Typography>
            </Grid>
            {/* 
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
                Duration (minutes):
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
                }}
              >
                1-3 minutes
              </Typography>
            </Grid>
 */}
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
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                Benefits:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                Breath (default):
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
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
                Activities:
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: '#fef3eb',
                  padding: 4,
                  marginTop: 2,
                  color: '#333',
                  borderTopRightRadius: { xs: 0, sm: 75 },
                  borderBottomRightRadius: { xs: 0, sm: 75 },
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Completed"
                  />
                  <FormControlLabel control={<Checkbox />} label="Easy" />
                  <FormControlLabel control={<Checkbox />} label="Difficult" />
                </FormGroup>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  )
}
