[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/urlGeneration](../README.md) / testUrlAccessibility

# Function: testUrlAccessibility()

> **testUrlAccessibility**(`url`, `environment`): `Promise`\<`boolean`\>

Defined in: app/utils/urlGeneration.ts:267

Validates URLs work correctly across different environments

## Parameters

### url

`string`

The URL to test

### environment

The target environment

`"development"` | `"production"` | `"test"`

## Returns

`Promise`\<`boolean`\>

Promise resolving to boolean indicating if URL is accessible
