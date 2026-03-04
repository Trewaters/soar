'use client'

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  SxProps,
  Theme,
} from '@mui/material'
import SeriesPoseList, {
  type SeriesPoseEntry,
} from '@app/clientComponents/SeriesPoseList'

export interface SequenceFlowCardProps {
  seriesName: string
  seriesPoses: SeriesPoseEntry[]
  isStale?: boolean
  onSeriesClick?: () => void
  titleColor?: string
  linkColor?: string
  // eslint-disable-next-line no-unused-vars
  getPoseHref?: (poseName: string, poseId?: string | null) => string
  headerTopContent?: React.ReactNode
  cardSx?: SxProps<Theme>
  poseSx?: SxProps<Theme>
  dataTestIdPrefix?: string
  emptyMessage?: string
}

export default function SequenceFlowCard({
  seriesName,
  seriesPoses,
  isStale = false,
  onSeriesClick,
  titleColor = 'primary.main',
  linkColor = 'primary.main',
  getPoseHref,
  headerTopContent,
  cardSx,
  poseSx,
  dataTestIdPrefix = 'sequence-flow-card',
  emptyMessage = 'No poses in this series',
}: SequenceFlowCardProps) {
  return (
    <Card
      sx={[
        {
          width: '100%',
          boxShadow: 3,
          textAlign: 'center',
          borderColor: 'primary.main',
          borderWidth: '1px',
          borderStyle: 'solid',
          cursor: isStale ? 'not-allowed' : onSeriesClick ? 'pointer' : 'auto',
          opacity: isStale ? 0.6 : 1,
        },
        cardSx as any,
      ]}
      className="journal"
      onClick={isStale ? undefined : onSeriesClick}
      aria-disabled={isStale ? 'true' : 'false'}
      data-testid={`${dataTestIdPrefix}-card`}
    >
      <Box className="journalTitleContainer" sx={{ px: 2, py: 1 }}>
        <Box width={'100%'}>
          {headerTopContent && (
            <Box sx={{ mb: 1 }} data-testid={`${dataTestIdPrefix}-header-top`}>
              {headerTopContent}
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              color: titleColor,
              cursor: isStale
                ? 'not-allowed'
                : onSeriesClick
                  ? 'pointer'
                  : 'inherit',
              '&:hover': isStale
                ? {}
                : onSeriesClick
                  ? {
                      textDecoration: 'underline',
                    }
                  : {},
            }}
          >
            {seriesName}
            {isStale && (
              <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                (Removed — no longer available)
              </Typography>
            )}
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ p: 0, textAlign: 'left' }}>
        {seriesPoses.length > 0 ? (
          <SeriesPoseList
            seriesPoses={seriesPoses}
            getHref={getPoseHref}
            linkColor={linkColor}
            containerSx={{ width: '100%' }}
            poseSx={poseSx}
            dataTestIdPrefix={`${dataTestIdPrefix}-pose`}
          />
        ) : (
          <Typography variant="body2" sx={{ p: 2 }}>
            {emptyMessage}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
