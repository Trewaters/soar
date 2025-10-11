[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/api/debug-push-fixed/route](../README.md) / GET

# Function: GET()

> **GET**(): `Promise`\<`NextResponse`\<\{ `commonSolutions`: `string`[]; `environment`: `"development"` \| `"production"` \| `"test"`; `timestamp`: `string`; `troubleshootingSteps`: \{ `step1`: `string`; `step2`: `string`; `step3`: `string`; `step4`: `string`; `step5`: `string`; \}; `vapidKeyLength`: \{ `public`: `number`; \}; `vapidKeysPresent`: \{ `private`: `boolean`; `public`: `boolean`; \}; \}\> \| `NextResponse`\<\{ `details`: `string`; `error`: `string`; \}\>\>

Defined in: app/api/debug-push-fixed/route.ts:3

## Returns

`Promise`\<`NextResponse`\<\{ `commonSolutions`: `string`[]; `environment`: `"development"` \| `"production"` \| `"test"`; `timestamp`: `string`; `troubleshootingSteps`: \{ `step1`: `string`; `step2`: `string`; `step3`: `string`; `step4`: `string`; `step5`: `string`; \}; `vapidKeyLength`: \{ `public`: `number`; \}; `vapidKeysPresent`: \{ `private`: `boolean`; `public`: `boolean`; \}; \}\> \| `NextResponse`\<\{ `details`: `string`; `error`: `string`; \}\>\>
