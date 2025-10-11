[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/hooks/useActiveProfileImage](../README.md) / useActiveProfileImage

# Function: useActiveProfileImage()

> **useActiveProfileImage**(): `object`

Defined in: app/hooks/useActiveProfileImage.ts:8

Custom hook to get the user's active profile image
Returns the active profile image URL, or fallback to session image, or placeholder

## Returns

### activeImage

> **activeImage**: `string`

The URL of the active profile image

### hasCustomImage

> **hasCustomImage**: `boolean`

Whether the user has uploaded custom profile images

### imageCount

> **imageCount**: `number`

Number of uploaded profile images

### isDefaultImage

> **isDefaultImage**: `boolean`

Whether the current active image is the default from OAuth provider

### isPlaceholder

> **isPlaceholder**: `boolean`

Whether using the placeholder image
