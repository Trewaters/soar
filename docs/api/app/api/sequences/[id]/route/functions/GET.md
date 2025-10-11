[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/sequences/\[id\]/route](../README.md) / GET

# Function: GET()

> **GET**(`_req`, `__namedParameters`): `Promise`\<`NextResponse`\<\{ `breath_direction`: `string` \| `null`; `created_by`: `string` \| `null`; `createdAt`: `Date` \| `null`; `description`: `string` \| `null`; `durationSequence`: `string` \| `null`; `id`: `string`; `image`: `string` \| `null`; `nameSequence`: `string`; `sequencesSeries`: `JsonValue`[]; `updatedAt`: `Date` \| `null`; \}\> \| `NextResponse`\<\{ `error`: `any`; \}\>\>

Defined in: app/api/sequences/\[id\]/route.ts:7

## Parameters

### \_req

`NextRequest`

### \_\_namedParameters

#### params

`Promise`\<\{ `id`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<\{ `breath_direction`: `string` \| `null`; `created_by`: `string` \| `null`; `createdAt`: `Date` \| `null`; `description`: `string` \| `null`; `durationSequence`: `string` \| `null`; `id`: `string`; `image`: `string` \| `null`; `nameSequence`: `string`; `sequencesSeries`: `JsonValue`[]; `updatedAt`: `Date` \| `null`; \}\> \| `NextResponse`\<\{ `error`: `any`; \}\>\>
