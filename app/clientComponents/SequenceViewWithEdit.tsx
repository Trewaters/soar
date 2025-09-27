'use client'

import React, { useMemo, useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import EditSequence, { EditableSequence } from '@clientComponents/EditSequence'
import { getAllSeries } from '@lib/seriesService'
import Image from 'next/image'

type Props = {
  sequence: EditableSequence
  defaultShowEdit?: boolean
}

export default function SequenceViewWithEdit({
  sequence,
  defaultShowEdit = false,
}: Props) {
  const { data: session } = useSession()
  const navigation = useNavigationWithLoading()
  const [showEdit, setShowEdit] = useState<boolean>(defaultShowEdit)
  const [model, setModel] = useState<EditableSequence>(sequence)

  // Sync showEdit with defaultShowEdit prop changes
  useEffect(() => {
    setShowEdit(defaultShowEdit)
  }, [defaultShowEdit])

  const isOwner = useMemo(() => {
    const email = session?.user?.email ?? null
    if (!model.created_by || !email) return false
    // Compare case-insensitively and ignore stray whitespace
    return model.created_by.trim().toLowerCase() === email.trim().toLowerCase()
  }, [model.created_by, session?.user?.email])

  // Helper function to resolve series ID and navigate
  // This ensures we NEVER use pagination IDs, only actual MongoDB ObjectIds
  const handleSeriesNavigation = async (seriesMini: any) => {
    try {
      console.log('=== SERIES NAVIGATION DEBUG ===')
      console.log('Series data from sequence:', seriesMini)
      console.log('Series ID (likely pagination ID):', seriesMini.id)
      console.log('Series name to resolve:', seriesMini.seriesName)

      // NEVER use seriesMini.id directly - it's likely a pagination ID like "2"
      // ALWAYS resolve by name to get the actual MongoDB ObjectId

      if (!seriesMini.seriesName) {
        console.error('No series name available for resolution')
        alert('Cannot navigate: Series name is missing')
        return
      }

      console.log('Fetching all series to find match...')
      const allSeries = await getAllSeries()
      console.log(`Found ${allSeries.length} total series in database`)
      console.log(
        'Available series:',
        allSeries.map((s) => ({ id: s.id, name: s.seriesName }))
      )

      // Try exact name match first
      let matchingSeries = allSeries.find(
        (series) => series.seriesName === seriesMini.seriesName
      )

      // If no exact match, try case-insensitive match
      if (!matchingSeries) {
        console.log('No exact match found, trying case-insensitive match...')
        matchingSeries = allSeries.find(
          (series) =>
            series.seriesName.toLowerCase() ===
            seriesMini.seriesName.toLowerCase()
        )
      }

      // If still no match, try trimmed comparison (handle whitespace)
      if (!matchingSeries) {
        console.log('No case-insensitive match found, trying trimmed match...')
        matchingSeries = allSeries.find(
          (series) =>
            series.seriesName.trim().toLowerCase() ===
            seriesMini.seriesName.trim().toLowerCase()
        )
      }

      if (matchingSeries?.id) {
        console.log('✅ SUCCESS: Found matching series!')
        console.log('Series name:', matchingSeries.seriesName)
        console.log('MongoDB ObjectId:', matchingSeries.id)
        console.log(
          'Navigating to:',
          `/navigator/flows/practiceSeries?id=${matchingSeries.id}`
        )

        navigation.push(
          `/navigator/flows/practiceSeries?id=${matchingSeries.id}`
        )
      } else {
        console.error('❌ FAILED: Could not resolve series by name')
        console.error('Looking for series name:', seriesMini.seriesName)
        console.error(
          'Available series names:',
          allSeries.map((s) => s.seriesName)
        )

        alert(
          `Cannot find series named "${seriesMini.seriesName}". Please check if the series still exists.`
        )
      }
    } catch (error) {
      console.error('❌ ERROR during series resolution:', error)
      alert(
        `Error loading series: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      console.log('=== END SERIES NAVIGATION DEBUG ===')
    }
  }

  // Debug logging
  useEffect(() => {
    console.log('SequenceViewWithEdit render state:', {
      isOwner,
      showEdit,
      defaultShowEdit,
      shouldRenderEdit: isOwner && showEdit,
      model_created_by: model.created_by,
      user_email: session?.user?.email,
    })
    console.log('Sequence model data:', model)
    console.log('Sequence series data:', model.sequencesSeries)
  }, [isOwner, showEdit, defaultShowEdit, model, session?.user?.email])

  const handleSequenceUpdate = (updatedSequence: EditableSequence) => {
    // Update the model with the saved data
    setModel(updatedSequence)
    // Exit edit mode only after successful save
    setShowEdit(false)
    // Don't navigate away automatically - let user decide when to leave
    // The user can use the back button or navigate manually
  }

  const handleBackNavigation = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    // Navigate back to sequences page
    if (model.id) {
      navigation.push(`/navigator/sequences/${model.id}`)
    } else {
      // Fallback to general navigation back
      navigation.back()
    }
  }

  return (
    <Box component="section" aria-label="sequence-view" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        {/* Back Navigation Button */}
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Button
            variant="text"
            onClick={handleBackNavigation}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            }}
            disableRipple
            aria-label={`Navigate back to ${model.nameSequence} sequence practice`}
          >
            Back to {model.nameSequence}
          </Button>
        </Box>

        {/* Sequence Header with Soar styling */}
        <Box
          sx={{
            mt: 4,
          }}
        >
          <Typography
            variant="body1"
            component="h1"
            textAlign="center"
            sx={{
              backgroundColor: 'primary.main',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              width: 'fit-content',
              ml: 5,
              pr: 7,
              pl: 2,
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            {model.nameSequence}
          </Typography>
          {isOwner && (
            <Button
              variant="outlined"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowEdit((v) => !v)
              }}
              aria-label={showEdit ? 'hide edit' : 'show edit'}
              aria-expanded={showEdit}
              aria-controls="sequence-edit-region"
            >
              {showEdit ? 'Close edit' : 'Edit'}
            </Button>
          )}
        </Box>

        {/* Image Section */}
        {model.image && (
          <Box sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
            <Box
              sx={{
                position: 'relative',
                width: { xs: '100%', sm: '400px' },
                height: 200,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <Image
                src={model.image}
                alt={model.nameSequence || 'Sequence image'}
                fill
                sizes="(max-width: 600px) 100vw, 400px"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Box>
        )}
        {isOwner && showEdit && (
          <Box id="sequence-edit-region" role="region" aria-label="edit-region">
            <Divider sx={{ my: 2 }} />
            <EditSequence sequence={model} onChange={handleSequenceUpdate} />
          </Box>
        )}
        {/* Flow Series Cards - Following Soar pattern - Only show when NOT in edit mode */}
        {!showEdit && model.sequencesSeries?.length ? (
          <Stack spacing={3} alignItems="center">
            {model.sequencesSeries.map((seriesMini, i) => (
              <Card
                key={`${seriesMini.seriesName}-${i}`}
                sx={{
                  width: '100%',
                  maxWidth: '85%',
                  boxShadow: 3,
                  textAlign: 'center',
                  borderColor: 'primary.main',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                className="journal"
                onClick={() => handleSeriesNavigation(seriesMini)}
              >
                <CardHeader
                  className="journalTitle"
                  title={
                    <Box width={'100%'}>
                      <Stack
                        flexDirection={'row'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="h6">
                          {seriesMini.seriesName}
                        </Typography>
                      </Stack>
                    </Box>
                  }
                />
                <CardContent className="lines" sx={{ p: 0 }}>
                  {seriesMini.seriesPostures?.length ? (
                    seriesMini.seriesPostures.map((posture, index) => {
                      const [englishName, sanskritName] = posture.split(';')
                      return (
                        <Stack
                          key={`${englishName}-${index}`}
                          sx={{
                            px: 3,
                            py: 1,
                            '&:hover': {
                              backgroundColor: '#f0f0f0',
                              transition: 'all 0.2s',
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 'normal' }}
                          >
                            {englishName}
                          </Typography>
                          {sanskritName && (
                            <Typography
                              variant="body2"
                              sx={{
                                fontStyle: 'italic',
                                color: 'text.secondary',
                                fontSize: '0.9rem',
                              }}
                            >
                              {sanskritName.trim()}
                            </Typography>
                          )}
                        </Stack>
                      )
                    })
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 2 }}
                    >
                      No postures in this series
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : !showEdit ? (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No flow series added.
          </Typography>
        ) : null}

        {/* Description Section with Soar styling - Only show when NOT in edit mode */}
        {!showEdit && model.description && (
          <Box
            className={'journal'}
            sx={{
              marginTop: '32px',
              p: 4,
              color: 'primary.main',
              backgroundColor: 'navSplash.dark',
            }}
          >
            <Stack flexDirection={'row'} alignItems={'center'}>
              <Typography variant="h3" sx={{ mr: 2 }}>
                Description
              </Typography>
              <Image
                src={'/icons/flows/leaf-3.svg'}
                alt={'leaf icon'}
                height={21}
                width={21}
              />
            </Stack>
            <Typography
              color="primary.contrastText"
              variant="body1"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {model.description}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
