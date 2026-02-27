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
import NAV_PATHS from '@app/utils/navigation/constants'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'

export type SeriesPoseEntry = {
  sort_english_name?: string
  secondary?: string
  // Prisma/Asana model stores Sanskrit names as an array on `sanskrit_names`
  sanskrit_names?: string[]
  alignment_cues?: string
  poseId?: string
}

export interface SeriesPoseListProps {
  /** Array of pose entries in object format */
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
 * Expects object-based entries with optional alignment cues.
 * Displays alignment cues inline as minor parenthetical text.
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
    // Link to practice page only when a valid ID exists.
    if (poseId) {
      return `${NAV_PATHS.PRACTICE_ASANAS}?id=${poseId}`
    }
    return NAV_PATHS.PRACTICE_ASANAS
  }

  const navigation = useNavigationWithLoading()

  const hrefResolver = getHref || defaultGetHref

  return (
    <Stack spacing={0} sx={[{ width: '100%' }, containerSx as any]}>
      {seriesPoses.map((pose, index) => {
        // Normalize pose entry to extract name, secondary, and alignment cues
        const poseName = pose.sort_english_name || ''
        const sanskritName =
          Array.isArray(pose.sanskrit_names) && pose.sanskrit_names[0]
            ? String(pose.sanskrit_names[0]).trim()
            : ''
        const secondaryText = pose.secondary
          ? String(pose.secondary).trim()
          : ''
        const alternateText =
          secondaryText &&
          sanskritName &&
          secondaryText.toLowerCase() !== sanskritName.toLowerCase()
            ? secondaryText
            : ''
        const fallbackSecondary =
          !sanskritName && secondaryText ? secondaryText : ''
        const alignmentCues = pose.alignment_cues || ''

        const resolvedName = poseName || `pose-${index}`
        const hasResolvedPoseState = Object.prototype.hasOwnProperty.call(
          poseIds,
          poseName
        )
        const resolvedPoseId = hasResolvedPoseState
          ? poseIds[poseName]
          : undefined
        const poseId = pose.poseId ?? resolvedPoseId ?? null
        const href = hrefResolver(poseName, poseId)
        const isPoseDeleted = hasResolvedPoseState && resolvedPoseId === null

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
              sx={[
                {
                  // make entries visually seamless within the parent `.journal`
                  width: '100%',
                  borderBottom: 'none',
                  backgroundColor: 'transparent',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  paddingLeft: '8px',
                  paddingRight: 0,
                  // Override global `.journal .journalLine` row flex styles
                  // so pose name, cues, and secondary text always stack vertically.
                  display: 'flex !important',
                  flexDirection: 'column !important',
                  flexWrap: 'nowrap !important',
                  alignItems: 'flex-start !important',
                  whiteSpace: 'normal',
                  overflow: 'visible',
                },
                poseSx as any,
              ]}
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
                    } else {
                      navigation.push(href)
                    }
                  }}
                  sx={{
                    display: 'block',
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
                  component="div"
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

              {showSecondary && sanskritName && (
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
                    {sanskritName}
                  </Typography>
                </Box>
              )}

              {showSecondary && alternateText && (
                <Box sx={{ width: '100%', mt: 0.5 }}>
                  <Typography
                    textAlign="left"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      width: '100%',
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      textOverflow: 'clip',
                    }}
                    data-testid={`${dataTestIdPrefix}-${index}-alternative`}
                  >
                    {alternateText}
                  </Typography>
                </Box>
              )}

              {showSecondary && fallbackSecondary && (
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
                    {fallbackSecondary}
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
