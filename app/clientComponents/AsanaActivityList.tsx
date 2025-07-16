import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Typography, List, ListItem, Box, Chip, Stack } from '@mui/material'
import {
  getUserActivities,
  type AsanaActivityData,
} from '@lib/asanaActivityClientService'
import { getUserSeriesActivities } from '@lib/seriesActivityClientService'
import { getUserSequenceActivities } from '@lib/sequenceActivityClientService'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import Link from 'next/link'

type CombinedActivity =
  | (AsanaActivityData & { type: 'asana' })
  | {
      id: string
      userId: string
      seriesId: string
      seriesName: string
      datePerformed: string
      difficulty?: string
      completionStatus: string
      duration: number
      notes?: string
      createdAt: string
      updatedAt: string
      type: 'series'
    }
  | {
      id: string
      userId: string
      sequenceId: string
      sequenceName: string
      datePerformed: string
      difficulty?: string
      completionStatus: string
      duration: number
      notes?: string
      createdAt: string
      updatedAt: string
      type: 'sequence'
    }

export default function AsanaActivityList() {
  const { data: session, status } = useSession()
  const [activities, setActivities] = useState<CombinedActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDifficultyColor = (
    difficulty?: string,
    completionStatus?: string
  ) => {
    // Only apply difficulty-based coloring for 'complete' status
    if (completionStatus === 'complete' && difficulty) {
      switch (difficulty.toLowerCase()) {
        case 'easy':
          return 'success' // Green
        case 'average':
          return 'info' // Blue
        case 'difficult':
          return 'error' // Red
        default:
          return 'success'
      }
    }
    // Fallback to original completion status coloring
    return completionStatus === 'complete'
      ? 'success'
      : completionStatus === 'partial'
        ? 'warning'
        : 'default'
  }

  useEffect(() => {
    const fetchActivities = async () => {
      if (!session?.user?.id) return
      setLoading(true)
      setError(null)
      try {
        const [asanaData, seriesData, sequenceData] = await Promise.all([
          getUserActivities(session.user.id),
          getUserSeriesActivities(session.user.id),
          getUserSequenceActivities(session.user.id),
        ])
        // Transform data to CombinedActivity with type property
        const combinedData: CombinedActivity[] = [
          ...asanaData.map((activity) => ({
            ...activity,
            type: 'asana' as const,
          })),
          ...seriesData.map((activity) => ({
            ...activity,
            type: 'series' as const,
          })),
          ...sequenceData.map((activity) => ({
            ...activity,
            type: 'sequence' as const,
          })),
        ]
        // Sort by datePerformed descending
        const sorted = combinedData.sort(
          (a: CombinedActivity, b: CombinedActivity) =>
            new Date(b.datePerformed).getTime() -
            new Date(a.datePerformed).getTime()
        )
        // Limit to 5 most recent activities
        setActivities(sorted.slice(0, 5))
      } catch (e: any) {
        setError(e.message || 'Error loading activity')
      } finally {
        setLoading(false)
      }
    }
    if (status === 'authenticated') fetchActivities()
  }, [session, status])

  if (loading) return <LoadingSkeleton type="list" lines={5} height={60} />
  if (error) return <Typography color="error">{error}</Typography>
  if (!activities.length) return <Typography>No activity found.</Typography>

  return (
    <Box sx={{ borderRadius: 2, boxShadow: '0px 4px 4px 0px #F6893D' }}>
      <Typography
        variant="body1"
        sx={{ mb: 2 }}
        textAlign="center"
        fontWeight={600}
      >
        Your Recent Activity
      </Typography>
      <List>
        {activities.map((activity) => (
          <ListItem
            key={activity.id}
            divider
            sx={{
              '&:not(:last-child)::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '1px',
                backgroundColor: 'divider',
              },
              '&:not(:last-child)': {
                borderBottom: 'none',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Stack spacing={0.5}>
                {activity.type === 'series' ? (
                  <Link
                    href={`/navigator/flows/practiceSeries?id=${activity.seriesId}`}
                  >
                    <Typography variant="body1">
                      Series: {activity.seriesName}
                    </Typography>
                  </Link>
                ) : activity.type === 'sequence' ? (
                  <Link
                    href={`/navigator/flows/practiceSequences?sequenceId=${activity.sequenceId}`}
                  >
                    <Typography variant="body1">
                      Sequence: {activity.sequenceName}
                    </Typography>
                  </Link>
                ) : (
                  <Link
                    href={`/navigator/asanaPostures/${
                      activity.sort_english_name ||
                      encodeURIComponent(activity.postureName)
                    }`}
                  >
                    <Typography variant="body1">
                      {activity.postureName}
                    </Typography>
                  </Link>
                )}
                <Typography variant="caption" color="text.secondary">
                  {new Date(activity.datePerformed).toLocaleDateString(
                    undefined,
                    {
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {activity.difficulty && (
                  <Typography variant="caption" color="text.secondary">
                    {activity.difficulty}
                  </Typography>
                )}
                <Chip
                  label={activity.completionStatus}
                  size="small"
                  variant="outlined"
                  color={getDifficultyColor(
                    activity.difficulty,
                    activity.completionStatus
                  )}
                />
              </Stack>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
