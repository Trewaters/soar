'use client'
import { QuickTimer } from '@app/clientComponents/quickTimer'
import { Box, Typography, Paper } from '@mui/material'

/**
 * Example component showing different ways to use the QuickTimer
 * This demonstrates the timer's flexibility and reusability
 */
export default function QuickTimerExamples() {
  const handleTimerStart = () => {}

  const handleTimerEnd = () => {}

  const handleTimerUpdate = (remainingSeconds: number) => {}

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        QuickTimer Examples
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Default Variant (5 minutes)
        </Typography>
        <QuickTimer
          onTimerStart={handleTimerStart}
          onTimerEnd={handleTimerEnd}
          onTimerUpdate={handleTimerUpdate}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Compact Variant (3 minutes)
        </Typography>
        <QuickTimer
          buttonText="+3 Minutes"
          timerMinutes={3}
          variant="compact"
          onTimerStart={handleTimerStart}
          onTimerEnd={handleTimerEnd}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Minimal Variant (1 minute)
        </Typography>
        <QuickTimer
          buttonText="+1 Min"
          timerMinutes={1}
          variant="minimal"
          onTimerStart={handleTimerStart}
          onTimerEnd={handleTimerEnd}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alarm Test Timer (10 seconds) - For Testing Audio
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          This timer is set to 10 seconds so you can quickly test the alarm
          functionality. Make sure your sound is on!
        </Typography>
        <QuickTimer
          buttonText="Test Alarm (10s)"
          timerMinutes={10 / 60} // 10 seconds
          variant="default"
          enableAlarm={true}
          showAlarmToggle={true}
          onTimerStart={() => {}}
          onTimerEnd={() =>
            console.log('Alarm test timer completed! You should hear beeps.')
          }
          maxWidth="400px"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Custom Styled (10 minutes)
        </Typography>
        <QuickTimer
          buttonText="Start 10-Min Session"
          timerMinutes={10}
          variant="default"
          maxWidth="500px"
          sx={{
            backgroundColor: 'primary.light',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'primary.main',
          }}
          onTimerStart={handleTimerStart}
          onTimerEnd={handleTimerEnd}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Multiple Timers in One View
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <QuickTimer
            buttonText="Warm-up"
            timerMinutes={2}
            variant="compact"
            maxWidth="200px"
          />
          <QuickTimer
            buttonText="Practice"
            timerMinutes={15}
            variant="compact"
            maxWidth="200px"
          />
          <QuickTimer
            buttonText="Cool-down"
            timerMinutes={5}
            variant="compact"
            maxWidth="200px"
          />
        </Box>
      </Paper>
    </Box>
  )
}
