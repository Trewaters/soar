[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/sharing](../README.md) / SeriesShareStrategy

# Class: SeriesShareStrategy

Defined in: types/sharing.ts:111

Share strategy for yoga series (collections of related asanas)
Implements exact format specification from PRD with mandatory format:
"Sharing a video of the yoga series "[Series Name]"
Below are the postures in this series: * [Posture 1], * [Posture 2], etc.
Practice with Uvuyoga! https://www.happyyoga.app/navigator/flows/practiceSeries (www.happyyoga.app)"

## Implements

- [`ShareStrategy`](../interfaces/ShareStrategy.md)

## Constructors

### Constructor

> **new SeriesShareStrategy**(): `SeriesShareStrategy`

#### Returns

`SeriesShareStrategy`

## Methods

### generateShareConfig()

> **generateShareConfig**(`data`): [`ShareConfig`](../interfaces/ShareConfig.md)

Defined in: types/sharing.ts:112

Generates the share configuration for the specific content type

#### Parameters

##### data

[`FlowSeriesData`](../../../app/context/AsanaSeriesContext/interfaces/FlowSeriesData.md)

The yoga content data to be shared

#### Returns

[`ShareConfig`](../interfaces/ShareConfig.md)

ShareConfig object with formatted sharing data

#### Implementation of

[`ShareStrategy`](../interfaces/ShareStrategy.md).[`generateShareConfig`](../interfaces/ShareStrategy.md#generateshareconfig)
