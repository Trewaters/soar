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
  Icon,
  IconButton,
  Stack,
} from '@mui/material'
import { PostureData } from '@context/AsanaPostureContext'
import { FEATURES } from '@app/FEATURES'
import { useRouter } from 'next/navigation'
import yogaMatWoman from '@public/yogaMatWoman.svg'
import asanaStanding from '@public/icons/designImages/asana-standing.svg'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'

interface PostureCardProps {
  postureCardProp: PostureData
}

export default function PostureActivityDetail({
  postureCardProp,
}: PostureCardProps) {
  const posture = postureCardProp
  const router = useRouter()

  function handleClick() {
    router.push(`../../views/viewAsanaPractice/${posture?.english_name}/`)
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
            display: 'flex',

            '& .MuiCardHeader-title': {
              fontWeight: 'bold',
            },
            '& .MuiCardHeader-subheader': {
              fontWeight: 'light',
              color: 'primary.contrastText',
            },
          }}
          avatar={
            <Image
              alt="Asana Standing"
              height={36}
              width={36}
              src={'/icons/designImages/asana-standing.svg'}
            ></Image>
          }
          title={posture?.english_name}
          titleTypographyProps={{
            variant: 'h1',
            component: 'h2',
            sx: { color: 'primary.contrastText' },
          }}
          subheader={posture?.category}
          subheaderTypographyProps={{
            variant: 'subtitle1',
            component: 'h3',
            sx: {
              mx: '40%',
              color: 'primary.contrastText',
              border: '1px solid black',
              borderRadius: '8px',
              backgroundColor: 'info.contrastText',
            },
          }}
        />
        <CardMedia sx={{ width: '50%', margin: 'auto' }}>
          {/* <Image
            src="/resized-posture card - generic.jpg"
            alt="Yoga Posture Image"
            width={500}
            height={500}
            layout="responsive"
          /> */}
        </CardMedia>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack direction={'column'}>
            <AsanaDetails
              details={posture?.description}
              label="Description"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={
                posture?.sanskrit_names?.[0]?.simplified ??
                'Sanskrit Name not-found'
              }
              label="Sanskrit Name"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={posture?.posture_meaning ?? 'Feel into the asana.'}
              label="Meaning of Posture"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={posture?.benefits}
              label="Benefits"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={posture?.breath ?? 'Inhale/Exhale'}
              label="Breath (default)"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={posture?.dristi ?? 'optimal gaze'}
              label="Dristi"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={posture?.difficulty}
              label="Difficulty"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={`${posture?.category}, ${posture?.subcategory}`}
              label="Category"
              sx={{ mb: '32px' }}
            />
            <AsanaDetails
              details={posture?.dristi ?? 'optimal gaze'}
              label="Activities"
              sx={{ mb: '32px' }}
            />
            <Typography
              variant="body1"
              sx={{
                padding: 4,
                marginTop: 2,
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
          </Stack>
        </CardContent>
      </Card>
      {posture && FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          sx={{ m: 2 }}
        >
          <IconButton disableRipple onClick={handleClick}>
            <Image
              src={yogaMatWoman}
              alt="practice view"
              width={24}
              height={24}
            />
          </IconButton>
        </ButtonGroup>
      )}
    </Paper>
  )
}
