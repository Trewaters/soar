[**soar**](../../../../../../README.md)

***

[soar](../../../../../../modules.md) / [app/api/seriesActivity/weekly/route](../README.md) / GET

# Function: GET()

> **GET**(`req`): `Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<`WeeklySeriesActivityData`\> \| `NextResponse`\<\{ `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; `seriesStats`: `Record`\<`string`, \{ `activities`: `SeriesActivityData`[]; `count`: `number`; `lastPerformed`: `Date`; `seriesName`: `string`; \}\>; `totalActivities`: `number`; \}\>\>

Defined in: app/api/seriesActivity/weekly/route.ts:11

## Parameters

### req

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<`WeeklySeriesActivityData`\> \| `NextResponse`\<\{ `dateRange`: \{ `end`: `Date`; `start`: `Date`; \}; `seriesStats`: `Record`\<`string`, \{ `activities`: `SeriesActivityData`[]; `count`: `number`; `lastPerformed`: `Date`; `seriesName`: `string`; \}\>; `totalActivities`: `number`; \}\>\>
