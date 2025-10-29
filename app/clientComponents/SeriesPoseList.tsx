'use client'

import {
  Box,
  Link,
  Stack,
  Typography,
  SxProps,
  Theme,
  Tooltip,
} from '@mui/material'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'

export type SeriesPoseEntry =
  | string
  | {
      sort_english_name?: string
      secondary?: string
      // Prisma/Asana model stores Sanskrit names as an array on `sanskrit_names`
      sanskrit_names?: string[]
      alignment_cues?: string
      poseId?: string
    }

export interface SeriesPoseListProps {
  /** Array of pose entries (legacy string format or object format) */
  seriesPoses: SeriesPoseEntry[]

  /** Optional map of pose names to resolved pose IDs for navigation */
  poseIds?: Record<string, string | null>

  /** Optional function to generate href for each pose entry (receives poseName and poseId) */
  // eslint-disable-next-line no-unused-vars
  getHref?: (poseName: string, poseId?: string | null) => string

  /** Show alignment cues inline next to pose name (default: true) */
  showAlignmentInline?: boolean

  /** Show secondary/Sanskrit name (default: true) */
  showSecondary?: boolean

  /** Link text color (default: 'primary.main') */
  linkColor?: string

  /** Container sx overrides */
  containerSx?: SxProps<Theme>

  /** Individual pose box sx overrides */
  poseSx?: SxProps<Theme>

  /** Data test ID prefix for testing (default: 'series-pose') */
  dataTestIdPrefix?: string
}

/**
 * SeriesPoseList - Shared component for displaying a list of yoga poses in a series
 *
 * Supports both legacy string format ("Pose Name (Sanskrit)") and new object format
 * with alignment_cues. Displays alignment cues inline as minor parenthetical text.
 */
export default function SeriesPoseList({
  seriesPoses,
  poseIds = {},
  getHref,
  showAlignmentInline = true,
  showSecondary = true,
  linkColor = 'primary.main',
  containerSx = {},
  poseSx = {},
  dataTestIdPrefix = 'series-pose',
}: SeriesPoseListProps) {
  const defaultGetHref = (poseName: string, poseId?: string | null): string => {
    // Use ID if available, fallback to encoded name
    if (poseId) {
      return `/navigator/asanaPoses/${poseId}`
    }
    return `/navigator/asanaPoses/${encodeURIComponent(poseName)}`
  }

  const hrefResolver = getHref || defaultGetHref

  return (
    <Stack spacing={0} sx={{ width: '100%', ...containerSx }}>
      {seriesPoses.map((pose, index) => {
        // Normalize pose entry to extract name, secondary, and alignment cues
        let poseName = ''
        let secondary = ''
        let alignmentCues = ''

        if (typeof pose === 'string') {
          const split = splitSeriesPoseEntry(pose)
          poseName = split.name
          secondary = split.secondary
        } else if (pose && typeof pose === 'object') {
          poseName = pose.sort_english_name || ''
          // Prefer explicit `secondary`, otherwise use the first element of `sanskrit_names` from the model
          secondary =
            pose.secondary ||
            (Array.isArray(pose.sanskrit_names) && pose.sanskrit_names[0]) ||
            ''
          alignmentCues = pose.alignment_cues || ''
        }

        const resolvedName = poseName || `pose-${index}`
        const poseId = poseIds[poseName] || null
        const href = hrefResolver(poseName, poseId)
        const isPoseDeleted =
          poseName && poseIds.hasOwnProperty(poseName) && poseId === null

        // Debug logging
        if (poseName) {
          console.log('SeriesPoseList render:', {
            poseName,
            hasPoseIds: Object.keys(poseIds).length > 0,
            poseIdValue: poseIds[poseName],
            hasOwnProperty: poseIds.hasOwnProperty(poseName),
            isPoseDeleted,
          })
        }

        // Extract first line of alignment cue for inline display
        const alignmentCuesInline =
          showAlignmentInline && alignmentCues
            ? String(alignmentCues).split('\n')[0]
            : ''

        return (
          <Box
            key={`${resolvedName}-${index}`}
            className="lines"
            data-testid={`${dataTestIdPrefix}-${index}`}
          >
            <Box
              className="journalLine"
              sx={{
                // p: 2,
                // borderBottom: '1px solid #eee',
                // backgroundColor: 'limegreen',
                ...poseSx,
              }}
            >
              <Typography
                textAlign="left"
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {isPoseDeleted ? (
                  <Tooltip
                    title="This pose has been deleted and is no longer available"
                    arrow
                    placement="top"
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: 'text.disabled',
                        textDecoration: 'line-through',
                        cursor: 'not-allowed',
                      }}
                      data-testid={`${dataTestIdPrefix}-${index}-deleted`}
                    >
                      {resolvedName}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Link underline="hover" color={linkColor} href={href}>
                    {resolvedName}
                  </Link>
                )}
                {alignmentCuesInline && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontStyle: 'normal',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '60%',
                    }}
                    data-testid={`${dataTestIdPrefix}-${index}-cue`}
                  >
                    ({alignmentCuesInline})
                  </Typography>
                )}
              </Typography>
              {showSecondary && secondary && (
                // place secondary on its own block so it appears below the name
                <Box sx={{ width: '100%', mt: 0.5 }}>
                  <Typography
                    textAlign="left"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontStyle: 'italic',
                      display: 'block',
                      width: '100%',
                    }}
                    data-testid={`${dataTestIdPrefix}-${index}-secondary`}
                  >
                    {secondary}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}
