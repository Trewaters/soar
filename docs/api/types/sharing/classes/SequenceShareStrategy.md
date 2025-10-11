[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/sharing](../README.md) / SequenceShareStrategy

# Class: SequenceShareStrategy

Defined in: types/sharing.ts:159

Share strategy for yoga sequences (ordered flows with multiple series)
Combines sequence information with included series data
Uses sequence-specific URL or falls back to current context

## Implements

- [`ShareStrategy`](../interfaces/ShareStrategy.md)

## Constructors

### Constructor

> **new SequenceShareStrategy**(): `SequenceShareStrategy`

#### Returns

`SequenceShareStrategy`

## Methods

### generateShareConfig()

> **generateShareConfig**(`data`, `url?`): [`ShareConfig`](../interfaces/ShareConfig.md)

Defined in: types/sharing.ts:160

Generates the share configuration for the specific content type

#### Parameters

##### data

[`SequenceData`](../../../app/context/SequenceContext/interfaces/SequenceData.md)

The yoga content data to be shared

##### url?

`string`

The current page URL for context (optional)

#### Returns

[`ShareConfig`](../interfaces/ShareConfig.md)

ShareConfig object with formatted sharing data

#### Implementation of

[`ShareStrategy`](../interfaces/ShareStrategy.md).[`generateShareConfig`](../interfaces/ShareStrategy.md#generateshareconfig)
