import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Typography,
  List,
  ListItem,
  CircularProgress,
  Box,
} from '@mui/material'

interface AsanaActivityItem {
  id: string
  postureName: string
  datePerformed: string
}

export default function AsanaActivityList() {
  const { data: session, status } = useSession()
  const [activities, setActivities] = useState<AsanaActivityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!session?.user?.id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/asanaActivity?userId=${session.user.id}`)
        if (!res.ok) throw new Error('Failed to fetch activity')
        const data = await res.json()
        // Sort by datePerformed descending
        const sorted = data.sort(
          (a: AsanaActivityItem, b: AsanaActivityItem) =>
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

  if (loading) return <CircularProgress />
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
                width: '100%',
              }}
            >
              <Typography variant="body1">{activity.postureName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(activity.datePerformed).toLocaleDateString(
                  undefined,
                  {
                    month: 'short',
                    day: 'numeric',
                  }
                )}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
