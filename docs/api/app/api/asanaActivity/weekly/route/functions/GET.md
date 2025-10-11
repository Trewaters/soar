[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/asanaActivity/weekly/route](../README.md) / GET

# Function: GET()

> **GET**(`req`): `Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `activities`: `object`[]; `count`: `number`; `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; \}\> \| `NextResponse`\<\{ `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; `postureStats`: `Record`\<`string`, \{ `activities`: `object`[]; `count`: `number`; `lastPerformed`: `Date`; `postureName`: `string`; \}\>; `totalActivities`: `number`; \}\>\>

Defined in: app/api/asanaActivity/weekly/route.ts:10

## Parameters

### req

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `activities`: `object`[]; `count`: `number`; `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; \}\> \| `NextResponse`\<\{ `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; `postureStats`: `Record`\<`string`, \{ `activities`: `object`[]; `count`: `number`; `lastPerformed`: `Date`; `postureName`: `string`; \}\>; `totalActivities`: `number`; \}\>\>
