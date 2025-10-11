[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/imageCarouselOptimizations](../README.md) / default

# Variable: default

> `const` **default**: `object`

Defined in: app/utils/imageCarouselOptimizations.ts:269

## Type Declaration

### deleteImageWithReorder()

> **deleteImageWithReorder**: (`prisma`, `imageId`, `postureId`) => `Promise`\<`boolean`\>

Efficient image deletion with order gap filling
Maintains proper displayOrder sequence (1, 2, 3) after deletion

#### Parameters

##### prisma

`any`

##### imageId

`string`

##### postureId

`string`

#### Returns

`Promise`\<`boolean`\>

### getCarouselImages()

> **getCarouselImages**: (`prisma`, `options`) => `Promise`\<`ImageQueryResult`\>

Optimized query for carousel images with proper indexing
Uses composite index [postureId, displayOrder] for efficient sorting

#### Parameters

##### prisma

`any`

##### options

`ImageQueryOptions`

#### Returns

`Promise`\<`ImageQueryResult`\>

### getImageCount()

> **getImageCount**: (`prisma`, `postureId`) => `Promise`\<`number`\>

Efficient count query for image limit enforcement
Uses indexed postureId for fast counting

#### Parameters

##### prisma

`any`

##### postureId

`string`

#### Returns

`Promise`\<`number`\>

### monitorImageQueryPerformance()

> **monitorImageQueryPerformance**: \<`T`\>(`queryName`, `promise`) => `Promise`\<`T`\>

Monitor query performance for debugging slow operations

#### Type Parameters

##### T

`T`

#### Parameters

##### queryName

`string`

##### promise

`Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

### performanceMetrics

> **performanceMetrics**: `object`

Performance monitoring configuration

#### performanceMetrics.developmentLogging

> **developmentLogging**: `boolean` = `true`

#### performanceMetrics.slowQueryThreshold

> **slowQueryThreshold**: `number` = `200`

### updateImageOrder()

> **updateImageOrder**: (`prisma`, `reorderData`) => `Promise`\<`boolean`\>

Optimized reordering update with batch operations
Updates multiple displayOrder values efficiently

#### Parameters

##### prisma

`any`

##### reorderData

`object`[]

#### Returns

`Promise`\<`boolean`\>

### validateImageIndexes()

> **validateImageIndexes**: () => `object`[]

Database index recommendations for optimal performance
Call this during development to ensure proper indexing

#### Returns

`object`[]
