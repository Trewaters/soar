'use client'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import { Box, ButtonGroup, Chip, IconButton, Stack } from '@mui/material'
import { FullAsanaData } from '@context/AsanaPostureContext'
import { FEATURES } from '@app/FEATURES'
import { useRouter } from 'next/navigation'
import yogaMatWoman from '@public/yogaMatWoman.svg'
import AsanaDetails from '@app/clientComponents/asanaUi/asanaDetails'

interface PostureCardProps {
  postureCardProp: FullAsanaData
}

export default function PostureActivityDetail({
  postureCardProp,
}: PostureCardProps) {
  const posture = postureCardProp
  const router = useRouter()
  const [easyChipVariant, setEasyChipVariant] = useState<'filled' | 'outlined'>(
    'outlined'
  )
  const [averageChipVariant, setAverageChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')
  const [difficultChipVariant, setDifficultChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')

  const handleEasyChipClick = () => {
    setEasyChipVariant((prev) => (prev === 'outlined' ? 'filled' : 'outlined'))
  }

  const handleAverageChipClick = () => {
    setAverageChipVariant((prev) =>
      prev === 'outlined' ? 'filled' : 'outlined'
    )
  }

  const handleDifficultChipClick = () => {
    setDifficultChipVariant((prev) =>
      prev === 'outlined' ? 'filled' : 'outlined'
    )
  }

  const getAsanaIconUrl = (category: string) => {
    switch (category) {
      case 'prone':
        return '/icons/designImages/asana-standing.svg'
      case 'standing':
        return '/icons/designImages/asana-standing.svg'
      case 'seated':
        return '/icons/designImages/asana-supine.svg'
      case 'supine':
        return '/icons/designImages/asana-supine.svg'
      case 'inverted':
        return '/icons/designImages/asana-inverted.svg'
      case 'arm_leg_support':
        return '/icons/designImages/asana-inverted.svg'
      case 'arm_balance_and_inversion':
        return '/icons/designImages/asana-inverted.svg'
      default:
        return '/stick-tree-pose-400x400.png'
    }
  }
  const getAsanaBackgroundUrl = (category: string) => {
    switch (category) {
      case 'prone':
        return `url('/icons/designImages/asana-back-pattern 1.svg')`
      case 'standing':
        return `url('/icons/designImages/asana-back-pattern 1.svg')`
      case 'seated':
        return `url('/icons/designImages/asana-back-pattern 2.svg')`
      case 'supine':
        return `url('/icons/designImages/asana-back-pattern 2.svg')`
      case 'inverted':
        return `url('/icons/designImages/asana-back-pattern 3.svg')`
      case 'arm_leg_support':
        return `url('/icons/designImages/asana-back-pattern 3.svg')`
      case 'arm_balance_and_inversion':
        return `url('/icons/designImages/asana-back-pattern 3.svg')`
      default:
        return '/stick-tree-pose-400x400.png'
    }
  }

  function handleClick() {
    router.push(`../../views/viewAsanaPractice/${posture?.sort_english_name}/`)
  }

  return (
    <Paper
      sx={{
        mt: '-2.2px',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          backgroundImage: `${getAsanaBackgroundUrl(posture?.category)}`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          alignContent: 'space-around',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
        }}
      >
        <Stack direction={'column'} alignSelf={'center'}>
          <Stack>
            <Paper
              elevation={1}
              sx={{
                borderRadius: '16px',
                backgroundColor: 'info.contrastText',
                mt: 3,
                mb: '-24px',
                mx: '25%',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  borderRadius: '16px',
                  height: '50%',
                  display: 'flex',
                  flexDirection: 'row',
                  px: 4,
                  py: 1,
                  overflow: 'hidden', // Ensure the box does not overflow
                }}
                justifyContent={'space-around'}
                alignItems={'center'}
              >
                <Image
                  alt="Asana Standing"
                  height={36}
                  width={36}
                  style={{
                    alignContent: 'center',
                  }}
                  src={getAsanaIconUrl(posture?.category)}
                ></Image>
                <Typography
                  variant="h5"
                  component={'p'}
                  sx={{
                    color: 'secondary.contrastText',
                    flexShrink: 1, // Prevent the text from growing beyond the container
                    overflow: 'hidden', // Hide overflow text
                    textOverflow: 'ellipsis', // Add ellipsis for overflow text
                    whiteSpace: 'nowrap', // Prevent text from wrapping
                  }}
                >
                  {posture?.category}
                </Typography>
              </Box>
            </Paper>
          </Stack>
          <Stack>
            <Typography
              variant="h1"
              component={'h2'}
              sx={{
                pl: 2,
                pt: 2,
                height: '200px',
                width: '400px',
                backgroundColor: 'info.contrastText',
                color: 'primary.main',
                borderRadius: '12px',
                alignContent: 'center',
                boxShadow: '0 2px 2px 2px rgba(211, 211, 211, 0.5)',
              }}
            >
              {posture?.sort_english_name}

              {/* <Typography
                variant="subtitle1"
                component={'p'}
                color={'primary.contrastText'}
              >
                {posture?.sanskrit_names ?? 'Sanskrit Name not-found'}
              </Typography> */}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 3,
        }}
      >
        <Stack direction={'column'}>
          <AsanaDetails
            details={posture?.sort_english_name}
            label="English Variant Names"
            sx={{
              mb: '32px',
            }}
          />
          <AsanaDetails
            details={posture?.description}
            label="Description"
            sx={{
              mb: '32px',
            }}
          />
          {/* <AsanaDetails
            details={posture?.sanskrit_names[0] ?? 'Sanskrit Name not-found'}
            label="Sanskrit Name"
            sx={{ mb: '32px' }}
          /> 
          <AsanaDetails
            details={posture?.posture_intent ?? 'Feel into the asana.'}
            label="Meaning of Posture"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.benefits}
            label="Benefits"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.dristi ?? 'optimal gaze'}
            label="Dristi"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.dristi ?? 'optimal gaze'}
            label="Activities"
            sx={{ mb: '32px' }}
          />
          */}
          <AsanaDetails
            details={`${posture?.category}, ${posture?.category}`}
            label="Category"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.difficulty}
            label="Difficulty"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.breath_direction_default ?? 'Inhale/Exhale'}
            label="Breath (default)"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.preferred_side ?? 'No preferred side'}
            label="Breath (default)"
            sx={{ mb: '32px' }}
          />
          <AsanaDetails
            details={posture?.sideways ? 'True' : 'False'}
            label="Sideways"
            sx={{ mb: '32px' }}
          />
          <Stack
            flexDirection={'row'}
            gap={2}
            sx={{
              p: 2,
              ml: { xs: 2, md: '23%' },
              boxShadow: '0 -4px 4px 0 #000000',
              opacity: 0.75, // 25% transparency
              width: '100%', // Make the width responsive
              maxWidth: '50%', // Ensure it doesn't exceed 50% of the parent
              borderRadius: '12px',
              backdropFilter: 'blur(48%)', // Add blur effect
              overflow: 'hidden', // Prevent overflow
            }}
          >
            <Stack>
              <Chip
                label="Easy"
                variant={easyChipVariant}
                onClick={handleEasyChipClick}
              />
            </Stack>
            <Stack>
              <Chip
                label="Average"
                variant={averageChipVariant}
                onClick={handleAverageChipClick}
              />
            </Stack>
            <Stack>
              <Chip
                label="Difficult"
                variant={difficultChipVariant}
                onClick={handleDifficultChipClick}
              />
            </Stack>
          </Stack>
          {/* <Typography
            variant="body1"
            sx={{
              padding: 4,
              marginTop: 2,
              borderTopRightRadius: { xs: 0, sm: 75 },
              borderBottomRightRadius: { xs: 0, sm: 75 },
              ml: { xs: 0, md: '23%' },
            }}
          >
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="" />
              <FormControlLabel control={<Checkbox />} label="Difficult" />
            </FormGroup>
          </Typography> */}
        </Stack>
      </Box>
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
