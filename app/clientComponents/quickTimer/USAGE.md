# QuickTimer Component - Usage Examples

## Key Improvements

### ✅ Better Notification UX

- **No automatic permission requests** - Only requests when user explicitly enables notifications
- **Contextual permission requests** - Users understand why notifications are needed
- **Graceful fallbacks** - Works perfectly without notifications
- **Clear user feedback** - Shows permission status and provides guidance

### ✅ New Features

- **Notification toggle** - Optional UI to let users control notifications
- **Permission alerts** - Helpful messages when permissions are blocked
- **Better error handling** - Gracefully handles notification failures
- **Enhanced notifications** - More detailed notification content

## Usage Examples

### Basic Timer (No Notifications)

```tsx
import QuickTimer from '@/app/clientComponents/quickTimer/QuickTimer'

export default function MyPage() {
  return (
    <QuickTimer buttonText="+5 Minutes" timerMinutes={5} variant="default" />
  )
}
```

### Timer with Optional Notifications

```tsx
import QuickTimer from '@/app/clientComponents/quickTimer/QuickTimer'

export default function MyPage() {
  const handleTimerEnd = () => {
    console.log('Timer completed!')
  }

  return (
    <QuickTimer
      buttonText="Start Focus Session"
      timerMinutes={25}
      variant="default"
      enableNotifications={true}
      showNotificationToggle={true}
      onTimerEnd={handleTimerEnd}
      onTimerStart={() => console.log('Focus session started')}
    />
  )
}
```

### Compact Timer for Yoga/Meditation

```tsx
import QuickTimer from '@/app/clientComponents/quickTimer/QuickTimer'

export default function MeditationTimer() {
  return (
    <QuickTimer
      buttonText="Add 2 Minutes"
      timerMinutes={2}
      variant="compact"
      enableNotifications={true}
      showNotificationToggle={true}
      maxWidth="300px"
    />
  )
}
```

## Notification Behavior

### Before (❌ Poor UX)

- Automatically requested notification permission on component mount
- No user control or explanation
- Frustrated users with unexpected permission dialogs

### After (✅ Better UX)

1. **Opt-in by design**: Only requests permissions when user explicitly enables notifications
2. **Contextual requests**: Permission requested when user starts first timer with notifications enabled
3. **User control**: Optional toggle lets users enable/disable notifications
4. **Clear feedback**: Visual indicators show permission status
5. **Graceful fallbacks**: Works perfectly even when notifications are denied
6. **Helpful guidance**: Alerts explain how to enable notifications if blocked
