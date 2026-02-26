'use client'

import { Box, Typography, IconButton, useTheme } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SeriesPoseList, {
  SeriesPoseEntry,
} from '@app/clientComponents/SeriesPoseList'

export interface FlowTitlePoseListSectionProps {
  /** Title of the flow */
  title: string
  /** Whether current user can edit this flow */
  isOwner: boolean
  /** Callback when edit button is clicked */
  onEditClick: () => void
  /** Array of pose entries in the series */
  seriesPoses: SeriesPoseEntry[]
  /** Map of pose names to resolved pose IDs for navigation */
  poseIds?: Record<string, string | null>
  /** Function to generate href for each pose entry */
  // eslint-disable-next-line no-unused-vars
  getHref?: (poseName: string, poseId?: string | null) => string
  /** Link text color (default: 'primary.contrastText') */
  linkColor?: string
  /** Data test ID prefix for poses */
  dataTestIdPrefix?: string
}

/**
 * FlowTitlePoseListSection
 *
 * A unified component that displays a flow's title with an optional edit button
 * and its associated poses in a journal-style container.
 *
 * Uses the `.journal` CSS class to provide consistent styling with:
 * - Border radius and shadow
 * - Background color
 * - Title container with double-border separator
 * - Pose list with journal line styling
 *
 * This component mirrors the asana page pattern where all details
 * are contained within a single cohesive container.
 */
export default function FlowTitlePoseListSection({
  title,
  isOwner,
  onEditClick,
  seriesPoses,
  poseIds = {},
  getHref,
  linkColor = 'primary.contrastText',
  dataTestIdPrefix = 'flow-title-pose-list',
}: FlowTitlePoseListSectionProps) {
  const theme = useTheme()

  return (
    <Box className="journal" sx={{ mb: 3, width: '100%' }}>
      {/* Title Container with Edit Button */}
      <Box className="journalTitleContainer">
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            color: theme.palette.primary.main,
          }}
        >
          {title}
        </Typography>
        {isOwner && (
          <IconButton
            aria-label="Edit flow"
            onClick={onEditClick}
            color="primary"
            size="small"
            data-testid={`${dataTestIdPrefix}-edit-button`}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>

      {/* Pose List */}
      <SeriesPoseList
        seriesPoses={seriesPoses}
        poseIds={poseIds}
        getHref={getHref}
        linkColor={linkColor}
        dataTestIdPrefix={dataTestIdPrefix}
      />
    </Box>
  )
}
