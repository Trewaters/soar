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
  createSequenceActivity,
  checkSequenceActivityExists,
  deleteSequenceActivity,
} from '@lib/sequenceActivityClientService'

interface SequenceActivityTrackerProps {
  sequenceId: string
  sequenceName: string
  onActivityToggle?: (isTracked: boolean) => void
}

export default function SequenceActivityTracker({
  sequenceId,
  sequenceName,
  onActivityToggle,
}: SequenceActivityTrackerProps) {
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

  // Check if sequence activity already exists today
  useEffect(() => {
    const checkExistingActivity = async () => {
      if (session?.user?.id && sequenceId) {
        try {
          const result = await checkSequenceActivityExists(
            session.user.id,
            sequenceId
          )
          setChecked(result.exists)

          if (result.exists && result.activity?.difficulty) {
            setSelectedDifficulty(result.activity.difficulty)
            if (result.activity.difficulty === 'easy') {
              setEasyChipVariant('filled')
            } else if (result.activity.difficulty === 'average') {
              setAverageChipVariant('filled')
            } else if (result.activity.difficulty === 'difficult') {
              setDifficultChipVariant('filled')
            }
          }
        } catch (error) {
          console.error('Error checking existing sequence activity:', error)
        }
      }
    }

    checkExistingActivity()
  }, [session?.user?.id, sequenceId])

  const handleActivityToggle = async (isChecked: boolean) => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      if (isChecked) {
        await createSequenceActivity({
          userId: session.user.id,
          sequenceId,
          sequenceName,
          difficulty: selectedDifficulty || undefined,
          completionStatus: 'complete',
        })

        setChecked(true)
        onActivityToggle?.(true)
      } else {
        await deleteSequenceActivity(session.user.id, sequenceId)
        setChecked(false)
        setSelectedDifficulty(null)
        setEasyChipVariant('outlined')
        setAverageChipVariant('outlined')
        setDifficultChipVariant('outlined')
        onActivityToggle?.(false)
      }
    } catch (error) {
      console.error('Error toggling sequence activity:', error)
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
          Track Your Sequence Practice
        </Typography>

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            How was this sequence for you?
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
                : 'Track Sequence Practice'}
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
            Great job! This sequence practice has been added to your activity
            tracker.
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
