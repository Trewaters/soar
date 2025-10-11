[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/clientComponents/quickTimer/QuickTimer](../README.md) / QuickTimerProps

# Interface: QuickTimerProps

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:20

## Properties

### alarmSoundUrl?

> `optional` **alarmSoundUrl**: `string`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:47

Custom alarm sound URL (default: uses Web Audio API beep)

***

### buttonText?

> `optional` **buttonText**: `string`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:22

Custom button text (default: "+5 Minutes")

***

### enableAlarm?

> `optional` **enableAlarm**: `boolean`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:45

Enable audio alarm when timer completes (default: true)

***

### enableNotifications?

> `optional` **enableNotifications**: `boolean`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:41

Enable notifications when timer completes (default: false)

***

### maxWidth?

> `optional` **maxWidth**: `string` \| `number`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:39

Maximum width of the component

***

### onTimerEnd()?

> `optional` **onTimerEnd**: () => `void`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:30

Callback when timer ends

#### Returns

`void`

***

### onTimerStart()?

> `optional` **onTimerStart**: () => `void`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:28

Callback when timer starts

#### Returns

`void`

***

### onTimerUpdate()?

> `optional` **onTimerUpdate**: (`remainingSeconds`) => `void`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:33

Callback with remaining seconds on each update

#### Parameters

##### remainingSeconds

`number`

#### Returns

`void`

***

### showAlarmToggle?

> `optional` **showAlarmToggle**: `boolean`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:49

Show alarm settings toggle (default: true)

***

### showNotificationToggle?

> `optional` **showNotificationToggle**: `boolean`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:43

Show notification settings toggle (default: false)

***

### showTimeDisplay?

> `optional` **showTimeDisplay**: `boolean`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:35

Show/hide the timer display when active (default: true)

***

### sx?

> `optional` **sx**: `object`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:26

Custom styling for the container

***

### timerMinutes?

> `optional` **timerMinutes**: `number`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:24

Timer duration in minutes (default: 5)

***

### variant?

> `optional` **variant**: `"default"` \| `"compact"` \| `"minimal"`

Defined in: app/clientComponents/quickTimer/QuickTimer.tsx:37

Variant for different layouts
