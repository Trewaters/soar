[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/glossary/\[term\]/route](../README.md) / PATCH

# Function: PATCH()

> **PATCH**(`req`, `__namedParameters`): `Promise`\<`NextResponse`\<\{ `category`: `string` \| `null`; `createdAt`: `Date`; `id`: `string`; `meaning`: `string`; `pronunciation`: `string` \| `null`; `readOnly`: `boolean`; `sanskrit`: `string` \| `null`; `source`: `GlossarySource`; `term`: `string`; `updatedAt`: `Date`; `userId`: `string` \| `null`; `whyMatters`: `string`; \}\> \| `NextResponse`\<\{ `error`: `string`; \}\>\>

Defined in: app/api/glossary/\[term\]/route.ts:13

## Parameters

### req

`Request`

### \_\_namedParameters

#### params

`Promise`\<\{ `term`: `string`; \}\>

## Returns

`Promise`\<`NextResponse`\<\{ `category`: `string` \| `null`; `createdAt`: `Date`; `id`: `string`; `meaning`: `string`; `pronunciation`: `string` \| `null`; `readOnly`: `boolean`; `sanskrit`: `string` \| `null`; `source`: `GlossarySource`; `term`: `string`; `updatedAt`: `Date`; `userId`: `string` \| `null`; `whyMatters`: `string`; \}\> \| `NextResponse`\<\{ `error`: `string`; \}\>\>
