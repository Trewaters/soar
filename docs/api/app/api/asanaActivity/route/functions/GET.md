[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/api/asanaActivity/route](../README.md) / GET

# Function: GET()

> **GET**(`req`): `Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `activity`: \{ `completionStatus`: `string`; `createdAt`: `Date`; `datePerformed`: `Date`; `difficulty`: `string` \| `null`; `duration`: `number`; `id`: `string`; `notes`: `string` \| `null`; `poseId`: `string` \| `null`; `postureId`: `string`; `postureName`: `string`; `sensations`: `string` \| `null`; `sort_english_name`: `string`; `updatedAt`: `Date`; `userId`: `string`; \} \| `null`; `exists`: `boolean`; \}\> \| `NextResponse`\<`object`[]\>\>

Defined in: app/api/asanaActivity/route.ts:123

## Parameters

### req

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `activity`: \{ `completionStatus`: `string`; `createdAt`: `Date`; `datePerformed`: `Date`; `difficulty`: `string` \| `null`; `duration`: `number`; `id`: `string`; `notes`: `string` \| `null`; `poseId`: `string` \| `null`; `postureId`: `string`; `postureName`: `string`; `sensations`: `string` \| `null`; `sort_english_name`: `string`; `updatedAt`: `Date`; `userId`: `string`; \} \| `null`; `exists`: `boolean`; \}\> \| `NextResponse`\<`object`[]\>\>
