import { Box, Stack, Typography } from '@mui/material'
import React, { ComponentProps } from 'react'

interface ProfileDetailsProps {
  details: string | string[] | null | undefined
  label: string
  /**
   * Display variant for the details text
   * - 'text': Single line text (default)
   * - 'multiline': Preserves line breaks for multi-line content
   */
  variant?: 'text' | 'multiline'
  /**
   * Optional background color for the details section
   */
  highlightBackground?: boolean
}

// Extend only Stack props since it's the root element of our component
type ProfileDetailsComponentProps = ComponentProps<typeof Stack> &
  ProfileDetailsProps

/**
 * Displays detailed information about a user profile field in a styled definition list format.
 *
 * @remarks
 * This component uses Material UI's Box, Stack, and Typography components to layout the label and details.
 * It includes an icon and supports responsive design.
 *
 * @param props - The properties for the ProfileDetails component.
 * @param props.label - The label or title for the profile detail.
 * @param props.details - The detailed content for the profile detail.
 * @param props.variant - Display variant: 'text' (single line) or 'multiline' (preserves line breaks)
 * @param props.highlightBackground - Whether to apply a highlighted background
 * @param props.sx - Optional additional styling to apply to the details section.
 *
 * @returns A memoized React component rendering the profile detail section.
 *
 * @example
 * ```tsx
 * <ProfileDetails label="Username" details="YogaMaster123" highlightBackground />
 * <ProfileDetails label="Bio" details="Long bio text..." variant="multiline" />
 * ```
 */
export default React.memo(function ProfileDetails(
  props: ProfileDetailsComponentProps
) {
  const { variant = 'text', highlightBackground = false, ...otherProps } = props

  // If there is no meaningful details to show, render nothing.
  // Treat: undefined, null, empty string, empty array as "no data".
  const { details } = props

  // If details is an array, determine whether it contains any non-empty string entries
  const arrayHasNonEmptyEntries = Array.isArray(details)
    ? details.filter((d) => typeof d === 'string' && d.trim() !== '').length > 0
    : false

  const isEmpty =
    details === undefined ||
    details === null ||
    (typeof details === 'string' && details.trim() === '') ||
    (Array.isArray(details) && !arrayHasNonEmptyEntries)

  // When there's no meaningful details, show "N/A" for profile fields
  const displayContent = isEmpty ? 'N/A' : details

  // Narrow type for use below
  const safeDetails = displayContent as string | string[]

  // If details is an array, produce a cleaned array with only non-empty trimmed entries
  const cleanedArray = Array.isArray(safeDetails)
    ? (safeDetails as string[])
        .map((s) => (s ?? '').toString().trim())
        .filter((s) => s !== '')
    : null

  const ariaLabel = cleanedArray
    ? `${props.label}: ${cleanedArray.join(' ')}`
    : `${props.label}: ${safeDetails}`

  const content = cleanedArray ? cleanedArray.join('\n') : safeDetails

  return (
    <Box
      component="dl"
      sx={{
        width: '100%',
        margin: 0, // Reset default dl margins
      }}
      role="group"
      aria-label={`Profile detail: ${props.label}`}
    >
      <Stack spacing={0}>
        {/* Label Section */}
        <Typography
          variant="body2"
          component="dt"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
          }}
        >
          {props.label}
        </Typography>

        {/* Details Section */}
        <Typography
          variant="body1"
          component="dd"
          sx={{
            mb: 2,
            ml: 0, // Reset default dd margin
            backgroundColor: highlightBackground ? 'lightgray' : 'transparent',
            whiteSpace: variant === 'multiline' ? 'pre-line' : 'normal',
            color: 'text.primary',
            fontWeight: 400,
            p: highlightBackground ? 1 : 0,
            borderRadius: highlightBackground ? 1 : 0,
            ...otherProps.sx,
          }}
          aria-label={ariaLabel}
        >
          {content}
        </Typography>
      </Stack>
    </Box>
  )
})
