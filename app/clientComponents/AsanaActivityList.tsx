import React, { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import {
  Typography,
  List,
  ListItem,
  Box,
  Chip,
  Stack,
  Button,
  Paper,
} from '@mui/material'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined'
import {
  getUserActivities,
  type AsanaActivityData,
} from '@lib/asanaActivityClientService'
import { getUserSeriesActivities } from '@lib/seriesActivityClientService'
import { getUserSequenceActivities } from '@lib/sequenceActivityClientService'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import Link from 'next/link'
import { NAV_PATHS } from '@app/utils/navigation/constants'

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
    if (difficulty) {
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

    // Listen for SW / client revalidation messages and refetch when relevant
    const onMessage = (ev: MessageEvent) => {
      if (!ev?.data) return
      const data = ev.data
      try {
        if (data.command === 'SOAR_ACTIVITY_REVALIDATED') {
          if (
            data.userId &&
            session?.user?.id &&
            data.userId === session.user.id
          ) {
            fetchActivities()
          }
        } else if (
          data.command === 'SOAR_SW_INVALIDATE' ||
          data.command === 'INVALIDATE_URLS'
        ) {
          // If the invalidated urls include the user's activities endpoint, refetch
          if (Array.isArray(data.urls) && session?.user?.id) {
            const userUrl = `/api/asanaActivity?userId=${encodeURIComponent(
              session.user.id
            )}`
            const matched = data.urls.some(
              (u: string) => u.indexOf(userUrl) !== -1
            )
            if (matched) fetchActivities()
          }
        }
      } catch (e) {
        // ignore handler errors
      }
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [session, status])

  if (loading || status === 'loading')
    return <LoadingSkeleton type="list" lines={5} height={60} />
  if (error) return <Typography color="error">{error}</Typography>
  if (status === 'unauthenticated') {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Log in to view activities marked completed
          </Typography>
          <Button variant="contained" color="primary" onClick={() => signIn()}>
            Login
          </Button>
        </Stack>
      </Paper>
    )
  }
  if (!activities.length) return <Typography>No activity found.</Typography>

  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: '0px 4px 4px 0px #F6893D',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <List>
        {activities.map((activity) => (
          <ListItem
            key={activity.id}
            divider
            sx={{
              width: '100%',
              boxSizing: 'border-box',
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
                minWidth: 0, // Allow shrinking
                gap: 1,
              }}
            >
              {(() => {
                const Icon =
                  activity.type === 'series'
                    ? WorkspacesIcon
                    : activity.type === 'sequence'
                      ? GroupWorkIcon
                      : Brightness1OutlinedIcon
                let href = '#'
                if (activity.type === 'series') {
                  href = `${NAV_PATHS.FLOWS_PRACTICE_SERIES}?id=${activity.seriesId}`
                } else if (activity.type === 'sequence') {
                  href = `${NAV_PATHS.SEQUENCES}/${activity.sequenceId}`
                } else {
                  // asana activity -> link to asana detail page
                  if ((activity as any).asanaId) {
                    href = `${NAV_PATHS.PRACTICE_ASANAS}?id=${(activity as any).asanaId}`
                  } else if ((activity as any).asanaName) {
                    href = `${NAV_PATHS.PRACTICE_ASANAS}?id=${encodeURIComponent(
                      (activity as any).asanaName
                    )}`
                  }
                }
                const name =
                  activity.type === 'series'
                    ? activity.seriesName
                    : activity.type === 'sequence'
                      ? activity.sequenceName
                      : activity.asanaName

                return (
                  <>
                    <Stack spacing={0.5} alignItems="center">
                      <Icon
                        sx={{
                          fontSize: 20,
                          color: 'secondary.main',
                        }}
                      />
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
                    <Stack
                      sx={{ flex: 1, minWidth: 0 }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Link href={href}>
                        <Typography
                          variant="body1"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {name}
                        </Typography>
                      </Link>
                    </Stack>
                  </>
                )
              })()}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ flexShrink: 0 }}
              >
                <Chip
                  label={activity.difficulty || activity.completionStatus}
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
