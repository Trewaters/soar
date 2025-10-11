import { Box, Stack, Typography } from '@mui/material'
import React, { ComponentProps } from 'react'
import Image from 'next/image'

interface AsanaDetailsProps {
  details: string | string[] | null | undefined
  label: string
}

// Extend only Stack props since it's the root element of our component
// Typography and Image props are internal implementation details
type AsanaDetailsComponentProps = ComponentProps<typeof Stack> &
  AsanaDetailsProps

// Memoize component to prevent unnecessary re-renders since it's used extensively
// in postureActivityDetail.tsx (10+ times with potentially different props)

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
        ></Image>
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
      <Stack sx={{ py: 2, pl: 4 }}>
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
          aria-label={`${props.label}: ${props.details || 'No details available'}`}
        >
          {props.details || 'No details available'}
        </Typography>
      </Stack>
    </Box>
  )
})
