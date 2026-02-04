import { Box, Stack, Typography } from '@mui/material'
import React, { ComponentProps } from 'react'
import Image from 'next/image'

interface AsanaDetailsProps {
  details: string | string[] | null | undefined
  label: string
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
 * This component uses Material UI's Box, Stack, and Typography components to layout the label and details.
 * It also includes an icon and supports responsive design.
 *
 * @param props - The properties for the AsanaDetails component.
 * @param props.label - The label or title for the Asana detail.
 * @param props.details - The detailed description or content for the Asana detail.
 * @param props.showCategoryIcon - Optional boolean to show category-specific icons.
 * @param props.sx - Optional additional styling to apply to the details section.
 *
 * @returns A memoized React component rendering the Asana detail section.
 *
 * @example
 * ```tsx
 * <AsanaDetails label="Pose Name" details="Description of the pose." />
 * ```
 */
export default React.memo(function AsanaDetails(
  props: AsanaDetailsComponentProps
) {
  // If there is no meaningful details to show, render nothing.
  // Treat: undefined, null, empty string, empty array as "no data".
  const { details, showCategoryIcon } = props

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
    ? `${props.label}: ${cleanedArray.join(' ')}`
    : `${props.label}: ${safeDetails}`

  const content = cleanedArray ? cleanedArray.join('\n') : safeDetails

  // Helper to get category icon URL (mirrors logic in poseActivityDetail.tsx)
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'prone':
      case 'standing':
        return '/icons/designImages/asana-standing.svg'
      case 'seated':
      case 'supine':
        return '/icons/designImages/asana-supine.svg'
      case 'inversion':
      case 'arm_leg_support':
      case 'arm_balance_and_inversion':
        return '/icons/designImages/asana-inverted.svg'
      default:
        return '/stick-tree-pose-400x400.png'
    }
  }

  const categoryIcon =
    showCategoryIcon && typeof content === 'string'
      ? getCategoryIcon(content)
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
      aria-label={`Asana detail: ${props.label}`}
    >
      <Stack direction={'row'} gap={3} display={'flex'} alignItems={'center'}>
        <Image
          src={'/icons/asanas/label_name_leaf.png'}
          alt={props.label}
          aria-hidden="true"
          width={16}
          height={20}
        />
        <Typography
          variant="subtitle1"
          component="dt"
          sx={{
            fontWeight: 'bold',
            mr: 2,
            color: 'primary.main',
          }}
        >
          {props.label}:
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
