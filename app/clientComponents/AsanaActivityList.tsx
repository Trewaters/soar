import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Typography,
  List,
  ListItem,
  ListItemText,
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
        setActivities(sorted)
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
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Asana Activity
      </Typography>
      <List>
        {activities.map((activity) => (
          <ListItem key={activity.id} divider>
            <ListItemText
              primary={activity.postureName}
              secondary={new Date(activity.datePerformed).toLocaleDateString(
                undefined,
                {
                  month: 'short',
                  day: 'numeric',
                }
              )}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
