[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/imageCarouselOptimizations](../README.md) / getCarouselImages

# Function: getCarouselImages()

> **getCarouselImages**(`prisma`, `options`): `Promise`\<`ImageQueryResult`\>

Defined in: app/utils/imageCarouselOptimizations.ts:32

Optimized query for carousel images with proper indexing
Uses composite index [postureId, displayOrder] for efficient sorting

## Parameters

### prisma

`any`

### options

`ImageQueryOptions`

## Returns

`Promise`\<`ImageQueryResult`\>
