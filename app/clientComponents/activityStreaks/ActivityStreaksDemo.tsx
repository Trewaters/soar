import React from 'react'
import { Box, Typography, Stack, Divider } from '@mui/material'
import ActivityStreaks from '@app/clientComponents/activityStreaks/ActivityStreaks'

export default function ActivityStreaksDemo() {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Activity Streaks Component Demo
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This component displays user activity streaks with extensible design for
        future streak types.
      </Typography>

      <Stack spacing={4}>
        {/* Compact variant */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Compact Variant (for dashboards and sidebars)
          </Typography>
          <ActivityStreaks variant="compact" />
        </Box>

        <Divider />

        {/* Detailed variant */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Detailed Variant (for dedicated pages)
          </Typography>
          <ActivityStreaks variant="detailed" />
        </Box>

        <Divider />

        {/* Future extensibility example */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Future Extensibility Examples
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The component is designed to easily support additional streak types:
          </Typography>

          {/* These would work once the corresponding APIs are implemented */}
          <Stack spacing={2}>
            <Typography variant="body2">
              • <code>streakTypes={['login', 'asana']}</code> - Login + Asana
              practice streaks
            </Typography>
            <Typography variant="body2">
              • <code>streakTypes={['login', 'asana', 'meditation']}</code> -
              Multiple activity types
            </Typography>
            <Typography variant="body2">
              • <code>streakTypes={['breathwork']}</code> - Breathwork practice
              streaks
            </Typography>
          </Stack>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Note: Additional streak types will be available once their
              corresponding API endpoints are implemented. The component
              structure supports easy extension without breaking changes.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
