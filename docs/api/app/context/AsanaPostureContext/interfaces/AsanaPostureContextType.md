[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/context/AsanaPostureContext](../README.md) / AsanaPostureContextType

# Interface: AsanaPostureContextType

Defined in: app/context/AsanaPostureContext.tsx:280

## Properties

### addPoseImage()

> **addPoseImage**: (`image`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:286

#### Parameters

##### image

[`PoseImageData`](../../../../types/images/interfaces/PoseImageData.md)

#### Returns

`void`

***

### dispatch

> **dispatch**: `Dispatch`\<`AsanaPostureAction`\>

Defined in: app/context/AsanaPostureContext.tsx:282

***

### removePoseImage()

> **removePoseImage**: (`imageId`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:287

#### Parameters

##### imageId

`string`

#### Returns

`void`

***

### reorderImages()

> **reorderImages**: (`images`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:288

#### Parameters

##### images

[`PoseImageData`](../../../../types/images/interfaces/PoseImageData.md)[]

#### Returns

`void`

***

### resetCarousel()

> **resetCarousel**: () => `void`

Defined in: app/context/AsanaPostureContext.tsx:291

#### Returns

`void`

***

### setCurrentImageIndex()

> **setCurrentImageIndex**: (`index`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:284

#### Parameters

##### index

`number`

#### Returns

`void`

***

### setReordering()

> **setReordering**: (`isReordering`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:289

#### Parameters

##### isReordering

`boolean`

#### Returns

`void`

***

### setUploadProgress()

> **setUploadProgress**: (`progress`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:290

#### Parameters

##### progress

`number` | `null`

#### Returns

`void`

***

### state

> **state**: [`AsanaPosturePageState`](AsanaPosturePageState.md)

Defined in: app/context/AsanaPostureContext.tsx:281

***

### updateImageCount()

> **updateImageCount**: (`count`) => `void`

Defined in: app/context/AsanaPostureContext.tsx:285

#### Parameters

##### count

`number`

#### Returns

`void`
