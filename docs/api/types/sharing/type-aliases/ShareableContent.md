[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/sharing](../README.md) / ShareableContent

# Type Alias: ShareableContent

> **ShareableContent** = \{ `contentType`: `"asana"`; `data`: [`AsanaPose`](../../asana/interfaces/AsanaPose.md); \} \| \{ `contentType`: `"series"`; `data`: [`FlowSeriesData`](../../../app/context/AsanaSeriesContext/interfaces/FlowSeriesData.md); \} \| \{ `contentType`: `"sequence"`; `data`: [`SequenceData`](../../../app/context/SequenceContext/interfaces/SequenceData.md); \}

Defined in: types/sharing.ts:10

Discriminated union for different types of shareable yoga content
Uses 'contentType' as the discriminator for type safety
