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
import NAV_PATHS from '@app/utils/navigation/constants'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import { getPoseIdByName } from '@lib/poseService'

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
    // Link to practice page with query param `?id=` (use ID if available, fallback to encoded name)
    if (poseId) {
      return `${NAV_PATHS.PRACTICE_ASANAS}?id=${poseId}`
    }
    return `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(poseName)}`
  }

  const navigation = useNavigationWithLoading()

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
            sx={{
              mb: 0,
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              width: '100%',
              ml: 0,
              float: 'none',
              boxSizing: 'border-box',
              overflow: 'visible',
            }}
          >
            <Box
              className="journalLine"
              sx={{
                // make entries visually seamless within the parent `.journal`
                width: '100%',
                borderBottom: 'none',
                backgroundColor: 'transparent',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '8px',
                paddingRight: 0,
                whiteSpace: 'normal',
                overflow: 'visible',
                ...poseSx,
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
                <Link
                  underline="hover"
                  color={linkColor}
                  href={href}
                  onClick={async (e) => {
                    // Prevent the click from bubbling up to parent cards which
                    // have an onClick for navigating to the series.
                    e.preventDefault()
                    e.stopPropagation()

                    // Prefer an explicit poseId passed in via props/poseIds
                    if (poseId) {
                      navigation.push(
                        `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(
                          String(poseId)
                        )}`
                      )
                      return
                    }

                    // Attempt to resolve the ObjectId by name. If not found,
                    // avoid navigating to a name-based `?id=` URL which may
                    // return a 404; instead navigate to the asana list.
                    try {
                      const resolved = await getPoseIdByName(poseName)
                      if (resolved) {
                        navigation.push(
                          `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(
                            resolved
                          )}`
                        )
                        return
                      }
                    } catch (err) {
                      // ignore and fall through
                    }

                    // Fallback: open the asana list page instead of a name-based detail
                    navigation.push(NAV_PATHS.PRACTICE_ASANAS)
                  }}
                  sx={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                  }}
                >
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
                    display: 'block',
                    mt: 0.5,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                  }}
                  data-testid={`${dataTestIdPrefix}-${index}-cue`}
                >
                  ({alignmentCuesInline})
                </Typography>
              )}

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
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      textOverflow: 'clip',
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
