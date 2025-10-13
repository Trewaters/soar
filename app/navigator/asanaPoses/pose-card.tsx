import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import {
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from '@mui/material'
import { FEATURES } from '@app/FEATURES'
import { useRouter } from 'next/navigation'
import { AsanaPose } from 'types/asana'

const yogaMatWoman = '/yogaMatWoman.svg'

interface PoseCardProps {
  poseCardProp: AsanaPose
}

export default function PoseCard({ poseCardProp }: PoseCardProps) {
  const pose = poseCardProp
  const router = useRouter()

  function handleClick() {
    router.push(
      `../views/viewAsanaPractice/${encodeURIComponent(pose?.sort_english_name || '')}/`
    )
  }

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
          title={pose?.sort_english_name}
          subheader={pose?.sanskrit_names?.[0] ?? ''}
        />
        <CardMedia sx={{ width: '50%', margin: 'auto' }}>
          <Image
            src="/resized-pose card - generic.jpg"
            alt="Yoga Pose Image"
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
                  whiteSpace: 'pre-line',
                }}
              >
                {pose?.description}
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
                {pose?.sanskrit_names?.[0] ?? 'Sanskrit Name not-found'}
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
                Meaning of Pose:
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
                Feel into the pose
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
                {pose?.benefits}
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
                {pose?.difficulty}
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
                {`${pose?.category}, ${pose?.category}`}
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
      {pose && FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
        <ButtonGroup
          variant="contained"
          aria-label="Asana practice actions"
          sx={{ m: 2 }}
        >
          <IconButton
            disableRipple
            onClick={handleClick}
            aria-label={`Start practice view for ${pose.english_names[0]} pose`}
            sx={{
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            <Image
              src={yogaMatWoman}
              alt="Start practice view"
              width={24}
              height={24}
            />
          </IconButton>
        </ButtonGroup>
      )}
    </Paper>
  )
}
