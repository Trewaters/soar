import { Box, Stack, Typography } from '@mui/material'
import React, { ComponentProps } from 'react'
import Image from 'next/image'
import {
  AsanaEditFieldProps,
  getFieldDisplayValue,
} from './asanaFieldConstants'

/**
 * Props for displaying Asana details in view mode
 * Supports both direct details or field configurations
 */
interface AsanaDetailsProps {
  /** Direct details to display (legacy mode) */
  details?: string | string[] | null | undefined

  /** Field configuration (new unified mode) */
  field?: AsanaEditFieldProps

  /** Display label for the detail */
  label: string

  /** Whether to show category-specific icons */
  showCategoryIcon?: boolean
}

// Extend only Stack props since it's the root element of our component
// Typography and Image props are internal implementation details
type AsanaDetailsComponentProps = ComponentProps<typeof Stack> &
  AsanaDetailsProps

// Memoize component to prevent unnecessary re-renders since it's used extensively
// in poseActivityDetail.tsx (10+ times with potentially different props)

/**
 * Displays detailed information about an Asana item in a styled definition list format.
 *
 * @remarks
 * This component supports two modes:
 * 1. Legacy mode: Direct details prop (string | string[] | null | undefined)
 * 2. Unified mode: Field configuration from AsanaFieldConfig (AsanaEditFieldProps)
 *
 * Using the field configuration ensures consistency with AsanaDetailsEdit component
 * and provides better type safety and maintainability.
 *
 * This component uses Material UI's Box, Stack, and Typography components to layout the label and details.
 * It also includes an icon and supports responsive design.
 *
 * @param props - The properties for the AsanaDetails component.
 * @param props.label - The label or title for the Asana detail.
 * @param props.details - The detailed description or content for the Asana detail (legacy).
 * @param props.field - The field configuration for unified mode.
 * @param props.showCategoryIcon - Optional boolean to show category-specific icons.
 * @param props.sx - Optional additional styling to apply to the details section.
 *
 * @returns A memoized React component rendering the Asana detail section.
 *
 * @example
 * ```tsx
 * // Legacy mode
 * <AsanaDetails label="Pose Name" details="Description of the pose." />
 *
 * // Unified mode
 * <AsanaDetails
 *   field={{
 *     type: 'text',
 *     label: 'Pose Name',
 *     value: 'Downward Dog',
 *     fieldKey: 'sort_english_name'
 *   }}
 * />
 * ```
 */
export default React.memo(function AsanaDetails(
  props: AsanaDetailsComponentProps
) {
  // If there is no meaningful details to show, render nothing.
  // Treat: undefined, null, empty string, empty array as "no data".
  const { showCategoryIcon, field } = props

  // Support both legacy details prop and new field configuration
  let details = props.details
  let label = props.label

  // If field is provided, extract details and label from it
  if (field) {
    details = getFieldDisplayValue(field)
    label = field.label
  }

  // If details is an array, determine whether it contains any non-empty string entries
  const arrayHasNonEmptyEntries = Array.isArray(details)
    ? details.filter((d) => typeof d === 'string' && d.trim() !== '').length > 0
    : false

  const isEmpty =
    details === undefined ||
    details === null ||
    (typeof details === 'string' && details.trim() === '') ||
    (Array.isArray(details) && !arrayHasNonEmptyEntries)

  // When there's no meaningful details, render nothing to declutter the UI.
  // Edit forms still expose the fields so users can add data later.
  if (isEmpty) {
    return null
  }

  // Narrow type for use below. At this point details is guaranteed non-null/non-empty.
  const safeDetails = details as string | string[]

  // If details is an array, produce a cleaned array with only non-empty trimmed entries
  const cleanedArray = Array.isArray(safeDetails)
    ? (safeDetails as string[])
        .map((s) => (s ?? '').toString().trim())
        .filter((s) => s !== '')
    : null

  const ariaLabel = cleanedArray
    ? `${label}: ${cleanedArray.join(' ')}`
    : `${label}: ${safeDetails}`

  const content = cleanedArray ? cleanedArray.join('\n') : safeDetails

  // Helper to get category icon URL based on asana category
  const getAsanaCategoryIconUrl = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'prone':
        return '/icons/designImages/asana-standing.svg'
      case 'standing':
        return '/icons/designImages/asana-standing.svg'
      case 'seated':
        return '/icons/designImages/asana-supine.svg'
      case 'supine':
        return '/icons/designImages/asana-supine.svg'
      case 'inversion':
        return '/icons/designImages/asana-inverted.svg'
      case 'arm_leg_support':
        return '/icons/designImages/asana-inverted.svg'
      case 'arm_balance_and_inversion':
        return '/icons/designImages/asana-inverted.svg'
      default:
        return '/stick-tree-pose-400x400.png'
    }
  }

  const categoryIcon =
    showCategoryIcon && typeof content === 'string'
      ? getAsanaCategoryIconUrl(content)
      : null

  return (
    <Box
      component="dl"
      sx={{
        width: {
          xs: '100%',
          md: '50vw',
        },
        px: { xs: '8px', sm: '8px' },
        margin: 0, // Reset default dl margins
      }}
      alignSelf={'center'}
      role="group"
      aria-label={`Asana detail: ${label}`}
    >
      <Stack direction={'row'} display={'flex'} alignItems={'center'}>
        <Typography
          variant="subtitle1"
          component="dt"
          sx={{
            fontWeight: 'bold',
            mr: 2,
            color: 'primary.main',
          }}
        >
          {label}:
        </Typography>
      </Stack>
      <Stack
        sx={{ py: 2, pl: 4 }}
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Typography
          variant="body1"
          component="dd"
          sx={{
            color: 'primary.contrastText',
            borderTopRightRadius: { xs: 0, sm: 75 },
            borderBottomRightRadius: { xs: 0, sm: 75 },
            whiteSpace: 'pre-line',
            ...props.sx,
          }}
          aria-label={ariaLabel}
        >
          {content}
        </Typography>
        {categoryIcon && (
          <Image
            src={categoryIcon}
            alt={`${content} icon`}
            width={32}
            height={32}
            style={{ marginLeft: '16px' }}
          />
        )}
      </Stack>
    </Box>
  )
})
