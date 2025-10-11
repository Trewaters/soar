[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/user/recordActivity/route](../README.md) / POST

# Function: POST()

> **POST**(`req`): `Promise`\<`NextResponse`\<\{ `error`: `string`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `timestamp`: `string`; \}\> \| `NextResponse`\<\{ `debugInfo`: \{ `activityType`: `any`; `environment`: `"development"` \| `"production"` \| `"test"`; `existingLoginToday`: `boolean`; \} \| `undefined`; `loginRecorded`: `boolean`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `streakData`: \{ `currentStreak`: `number`; `isActiveToday`: `boolean`; `lastLoginDate`: `string` \| `null`; `longestStreak`: `number`; \}; `success`: `boolean`; `timestamp`: `string`; \}\>\>

Defined in: app/api/user/recordActivity/route.ts:38

## Parameters

### req

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `timestamp`: `string`; \}\> \| `NextResponse`\<\{ `debugInfo`: \{ `activityType`: `any`; `environment`: `"development"` \| `"production"` \| `"test"`; `existingLoginToday`: `boolean`; \} \| `undefined`; `loginRecorded`: `boolean`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `streakData`: \{ `currentStreak`: `number`; `isActiveToday`: `boolean`; `lastLoginDate`: `string` \| `null`; `longestStreak`: `number`; \}; `success`: `boolean`; `timestamp`: `string`; \}\>\>
