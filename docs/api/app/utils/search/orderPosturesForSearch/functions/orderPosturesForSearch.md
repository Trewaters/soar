[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/utils/search/orderPosturesForSearch](../README.md) / orderPosturesForSearch

# Function: orderPosturesForSearch()

> **orderPosturesForSearch**\<`T`\>(`postures`, `currentUserId`, `alphaUserIds`, `getTitle`): `T`[]

Defined in: app/utils/search/orderPosturesForSearch.ts:18

Orders postures for search: user-created, alpha-created, others (alphabetical), deduped by canonicalAsanaId (fallback to id).

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### postures

`T`[]

Array of posture objects

### currentUserId

Current user's id

`string` | `null` | `undefined`

### alphaUserIds

`string`[]

Array of alpha user ids

### getTitle

(`item`) => `string`

Function to get display title

## Returns

`T`[]

Ordered array: user-created, alpha, others
