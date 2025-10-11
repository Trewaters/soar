[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/user/loginStreak/route](../README.md) / GET

# Function: GET()

> **GET**(`req`): `Promise`\<`NextResponse`\<\{ `error`: `string`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `timestamp`: `string`; \}\> \| `NextResponse`\<\{ `currentStreak`: `number`; `debugInfo`: \{ `calculationTimeMs`: `number`; `deployment`: `string`; `region`: `string` \| `undefined`; \} \| `undefined`; `isActiveToday`: `boolean`; `lastLoginDate`: `string` \| `null`; `longestStreak`: `number`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `timestamp`: `string`; \}\>\>

Defined in: app/api/user/loginStreak/route.ts:52

## Parameters

### req

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `timestamp`: `string`; \}\> \| `NextResponse`\<\{ `currentStreak`: `number`; `debugInfo`: \{ `calculationTimeMs`: `number`; `deployment`: `string`; `region`: `string` \| `undefined`; \} \| `undefined`; `isActiveToday`: `boolean`; `lastLoginDate`: `string` \| `null`; `longestStreak`: `number`; `requestId`: `` `${string}-${string}-${string}-${string}-${string}` ``; `timestamp`: `string`; \}\>\>
