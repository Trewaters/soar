[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/sharing](../README.md) / AsanaShareStrategy

# Class: AsanaShareStrategy

Defined in: types/sharing.ts:79

Share strategy for individual asana poses/asanas
Implements exact format specification from PRD with mandatory format:
"The asana pose [Asana Pose sort name] was shared with you. Below is the description:
Practice with Uvuyoga! https://www.happyyoga.app/navigator/flows/practiceSeries (www.happyyoga.app)"

## Implements

- [`ShareStrategy`](../interfaces/ShareStrategy.md)

## Constructors

### Constructor

> **new AsanaShareStrategy**(): `AsanaShareStrategy`

#### Returns

`AsanaShareStrategy`

## Methods

### generateShareConfig()

> **generateShareConfig**(`data`): [`ShareConfig`](../interfaces/ShareConfig.md)

Defined in: types/sharing.ts:80

Generates the share configuration for the specific content type

#### Parameters

##### data

[`AsanaPose`](../../asana/interfaces/AsanaPose.md)

The yoga content data to be shared

#### Returns

[`ShareConfig`](../interfaces/ShareConfig.md)

ShareConfig object with formatted sharing data

#### Implementation of

[`ShareStrategy`](../interfaces/ShareStrategy.md).[`generateShareConfig`](../interfaces/ShareStrategy.md#generateshareconfig)
