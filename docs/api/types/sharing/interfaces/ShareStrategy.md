[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/sharing](../README.md) / ShareStrategy

# Interface: ShareStrategy

Defined in: types/sharing.ts:43

Strategy interface for handling different content types
Implements the Strategy pattern for extensible sharing functionality

## Methods

### generateShareConfig()

> **generateShareConfig**(`data`, `url?`): [`ShareConfig`](ShareConfig.md)

Defined in: types/sharing.ts:50

Generates the share configuration for the specific content type

#### Parameters

##### data

`any`

The yoga content data to be shared

##### url?

`string`

The current page URL for context (optional)

#### Returns

[`ShareConfig`](ShareConfig.md)

ShareConfig object with formatted sharing data
