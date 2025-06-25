import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Typography, List, ListItem, Box, Chip, Stack } from '@mui/material'
import {
  getUserActivities,
  type AsanaActivityData,
} from '@lib/asanaActivityClientService'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import Link from 'next/link'

export default function AsanaActivityList() {
  const { data: session, status } = useSession()
  const [activities, setActivities] = useState<AsanaActivityData[]>([])
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
        const data = await getUserActivities(session.user.id)
        // Sort by datePerformed descending
        const sorted = data.sort(
          (a: AsanaActivityData, b: AsanaActivityData) =>
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
  if (!activities.length)
    return <Typography>No asana activity found.</Typography>

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
