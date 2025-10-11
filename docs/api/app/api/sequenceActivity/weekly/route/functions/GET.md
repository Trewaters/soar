[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/sequenceActivity/weekly/route](../README.md) / GET

# Function: GET()

> **GET**(`req`): `Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<`WeeklySequenceActivityData`\> \| `NextResponse`\<\{ `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; `sequenceStats`: `Record`\<`string`, \{ `activities`: `SequenceActivityData`[]; `count`: `number`; `lastPerformed`: `Date`; `sequenceName`: `string`; \}\>; `totalActivities`: `number`; \}\>\>

Defined in: app/api/sequenceActivity/weekly/route.ts:11

## Parameters

### req

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<`WeeklySequenceActivityData`\> \| `NextResponse`\<\{ `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; `sequenceStats`: `Record`\<`string`, \{ `activities`: `SequenceActivityData`[]; `count`: `number`; `lastPerformed`: `Date`; `sequenceName`: `string`; \}\>; `totalActivities`: `number`; \}\>\>
