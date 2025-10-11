[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/imageCarouselOptimizations](../README.md) / deleteImageWithReorder

# Function: deleteImageWithReorder()

> **deleteImageWithReorder**(`prisma`, `imageId`, `postureId`): `Promise`\<`boolean`\>

Defined in: app/utils/imageCarouselOptimizations.ts:148

Efficient image deletion with order gap filling
Maintains proper displayOrder sequence (1, 2, 3) after deletion

## Parameters

### prisma

`any`

### imageId

`string`

### postureId

`string`

## Returns

`Promise`\<`boolean`\>
