'use client'
import React, { useState, useEffect } from 'react'
import {
  Button,
  Stack,
  Chip,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import {
  createSeriesActivity,
  checkSeriesActivityExists,
  deleteSeriesActivity,
} from '@lib/seriesActivityClientService'

interface SeriesActivityTrackerProps {
  seriesId: string
  seriesName: string
  onActivityToggle?: (isTracked: boolean) => void
}

export default function SeriesActivityTracker({
  seriesId,
  seriesName,
  onActivityToggle,
}: SeriesActivityTrackerProps) {
  const { data: session } = useSession()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  )
  const [easyChipVariant, setEasyChipVariant] = useState<'filled' | 'outlined'>(
    'outlined'
  )
  const [averageChipVariant, setAverageChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')
  const [difficultChipVariant, setDifficultChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')

  // Check if series activity already exists today
  useEffect(() => {
    const checkExistingActivity = async () => {
      if (session?.user?.id && seriesId) {
        try {
          const result = await checkSeriesActivityExists(
            session.user.id,
            seriesId
          )
          setChecked(result.exists)

          if (result.exists && result.activity?.difficulty) {
            setSelectedDifficulty(result.activity.difficulty)
            // Set appropriate chip variant
            if (result.activity.difficulty === 'easy') {
              setEasyChipVariant('filled')
            } else if (result.activity.difficulty === 'average') {
              setAverageChipVariant('filled')
            } else if (result.activity.difficulty === 'difficult') {
              setDifficultChipVariant('filled')
            }
          }
        } catch (error) {
          console.error('Error checking existing series activity:', error)
        }
      }
    }

    checkExistingActivity()
  }, [session?.user?.id, seriesId])

  const handleActivityToggle = async (isChecked: boolean) => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      if (isChecked) {
        // Create new series activity
        await createSeriesActivity({
          userId: session.user.id,
          seriesId,
          seriesName,
          difficulty: selectedDifficulty || undefined,
          completionStatus: 'complete',
        })

        setChecked(true)
        onActivityToggle?.(true)
      } else {
        // Delete existing series activity
        await deleteSeriesActivity(session.user.id, seriesId)
        setChecked(false)
        setSelectedDifficulty(null)
        setEasyChipVariant('outlined')
        setAverageChipVariant('outlined')
        setDifficultChipVariant('outlined')
        onActivityToggle?.(false)
      }
    } catch (error) {
      console.error('Error toggling series activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
    setEasyChipVariant(difficulty === 'easy' ? 'filled' : 'outlined')
    setAverageChipVariant(difficulty === 'average' ? 'filled' : 'outlined')
    setDifficultChipVariant(difficulty === 'difficult' ? 'filled' : 'outlined')
  }

  if (!session?.user?.id) {
    return null
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" textAlign="center" fontWeight="bold">
          Track Your Practice
        </Typography>

        {/* Difficulty Selection */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            How was this practice for you?
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip
              label="Easy"
              variant={easyChipVariant}
              color="success"
              onClick={() => handleDifficultySelect('easy')}
              sx={{ cursor: 'pointer' }}
              size="small"
            />
            <Chip
              label="Average"
              variant={averageChipVariant}
              color="info"
              onClick={() => handleDifficultySelect('average')}
              sx={{ cursor: 'pointer' }}
              size="small"
            />
            <Chip
              label="Difficult"
              variant={difficultChipVariant}
              color="error"
              onClick={() => handleDifficultySelect('difficult')}
              sx={{ cursor: 'pointer' }}
              size="small"
            />
          </Stack>
        </Box>

        {/* Activity Tracker Toggle */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant={checked ? 'contained' : 'outlined'}
            color={checked ? 'success' : 'primary'}
            onClick={() => handleActivityToggle(!checked)}
            disabled={loading}
            sx={{ minWidth: '200px', textTransform: 'none' }}
          >
            {loading
              ? 'Saving...'
              : checked
                ? 'Tracked in Activity'
                : 'Track Series Practice'}
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => handleActivityToggle(e.target.checked)}
                disabled={loading}
              />
            }
            label=""
            sx={{ m: 0 }}
          />
        </Stack>

        {checked && (
          <Typography variant="caption" color="success.main" textAlign="center">
            Great job! This practice has been added to your activity tracker.
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
