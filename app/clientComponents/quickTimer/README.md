# QuickTimer Component

A standalone, reusable timer component for the Soar app that can be placed anywhere in the application.

## Features

- ⏱️ Customizable timer duration
- 🔄 Add time to running timer
- 📱 Mobile-friendly with device sleep handling
- 🔔 Browser notifications when timer completes
- 🎨 Multiple variants (default, compact, minimal)
- 🔧 Configurable callbacks for timer events
- 📍 Persistent timer state across page visibility changes

## Usage

### Basic Usage

```tsx
import { QuickTimer } from '@app/clientComponents/quickTimer'

function MyComponent() {
  return <QuickTimer />
}
```

### Advanced Usage

```tsx
import { QuickTimer } from '@app/clientComponents/quickTimer'

function MyComponent() {
  const handleTimerStart = () => {
    console.log('Timer started!')
  }

  const handleTimerEnd = () => {
    console.log('Timer completed!')
    // Perform actions when timer ends
  }

  const handleTimerUpdate = (remainingSeconds: number) => {
    // Update other UI elements based on remaining time
    console.log(`${remainingSeconds} seconds remaining`)
  }

  return (
    <QuickTimer
      buttonText="+10 Minutes"
      timerMinutes={10}
      variant="compact"
      onTimerStart={handleTimerStart}
      onTimerEnd={handleTimerEnd}
      onTimerUpdate={handleTimerUpdate}
      maxWidth="300px"
      sx={{ mb: 2 }}
    />
  )
}
```

## Props

| Prop              | Type                                  | Default        | Description                                         |
| ----------------- | ------------------------------------- | -------------- | --------------------------------------------------- |
| `buttonText`      | `string`                              | `"+5 Minutes"` | Text displayed on the timer button                  |
| `timerMinutes`    | `number`                              | `5`            | Duration to add when button is clicked (in minutes) |
| `sx`              | `object`                              | `{}`           | Custom styling for the container                    |
| `onTimerStart`    | `() => void`                          | `undefined`    | Callback when timer starts                          |
| `onTimerEnd`      | `() => void`                          | `undefined`    | Callback when timer ends                            |
| `onTimerUpdate`   | `(remainingSeconds: number) => void`  | `undefined`    | Callback with remaining seconds on each update      |
| `showTimeDisplay` | `boolean`                             | `true`         | Show/hide the timer display when active             |
| `variant`         | `'default' \| 'compact' \| 'minimal'` | `'default'`    | Layout variant                                      |
| `maxWidth`        | `string \| number`                    | `'400px'`      | Maximum width of the component                      |

## Variants

### Default

- Full-sized paper container with elevation
- Large button and timer display
- Ideal for main timer sections

### Compact

- Smaller paper container with reduced padding
- Medium-sized elements
- Good for sidebar or secondary timer displays

### Minimal

- No paper container (just Box)
- Smallest size
- Perfect for embedding in other components

## Examples

### Different Variants

```tsx
{
  /* Default variant */
}
;<QuickTimer buttonText="+5 Minutes" timerMinutes={5} variant="default" />

{
  /* Compact variant */
}
;<QuickTimer buttonText="+3 Min" timerMinutes={3} variant="compact" />

{
  /* Minimal variant */
}
;<QuickTimer buttonText="+1 Min" timerMinutes={1} variant="minimal" />
```

### Custom Styling

```tsx
<QuickTimer
  sx={{
    backgroundColor: 'primary.light',
    borderRadius: 3,
    border: '2px solid',
    borderColor: 'primary.main',
  }}
/>
```

### Integration with Other Components

```tsx
function YogaSession() {
  const [sessionActive, setSessionActive] = useState(false)

  return (
    <Box>
      <Typography variant="h4">Yoga Session</Typography>

      <QuickTimer
        buttonText="Add Practice Time"
        timerMinutes={5}
        variant="compact"
        onTimerStart={() => setSessionActive(true)}
        onTimerEnd={() => setSessionActive(false)}
        onTimerUpdate={(seconds) => {
          // Update session progress
          updateSessionProgress(seconds)
        }}
      />

      {sessionActive && (
        <Typography color="success.main">Session in progress...</Typography>
      )}
    </Box>
  )
}
```

## Features in Detail

### Mobile Device Sleep Handling

The timer continues to work correctly even when:

- User locks their device
- User switches to another app
- Browser tab becomes inactive
- Device goes to sleep

### Browser Notifications

- Automatically requests notification permission on mount
- Shows notification when timer completes (if permission granted)
- Customizable notification with app icon

### Timer Persistence

- Timer state persists across page visibility changes
- Recalculates remaining time when page becomes visible again
- Handles multiple timer additions seamlessly

### Accessibility

- Proper semantic structure
- Screen reader friendly
- Keyboard navigation support
- Material-UI accessibility features

## Installation

The component is already part of the Soar app structure. Simply import it from:

```tsx
import { QuickTimer } from '@app/clientComponents/quickTimer'
```

## Dependencies

- React (useState, useEffect, useRef, useCallback)
- Material-UI (@mui/material)
- Timer icon from @mui/icons-material

## Browser Compatibility

- Modern browsers with notification API support
- Graceful degradation for older browsers
- Mobile Safari and Chrome tested
