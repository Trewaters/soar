[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/hooks/useNavigationWithLoading](../README.md) / useNavigationWithLoading

# Function: useNavigationWithLoading()

> **useNavigationWithLoading**(): `object`

Defined in: app/hooks/useNavigationWithLoading.ts:10

Enhanced router hook that provides loading state feedback for navigation actions.
Prevents multiple rapid taps/clicks on mobile devices by showing immediate visual feedback.

## Returns

### back()

> **back**: () => `void` = `goBack`

#### Returns

`void`

### forward()

> **forward**: () => `void` = `goForward`

#### Returns

`void`

### isElementLoading()

> **isElementLoading**: (`elementId`) => `boolean`

#### Parameters

##### elementId

`string`

#### Returns

`boolean`

### isNavigating

> **isNavigating**: `boolean` = `state.isNavigating`

### isNavigatingTo()

> **isNavigatingTo**: (`path`) => `boolean`

#### Parameters

##### path

`string`

#### Returns

`boolean`

### navigationState

> **navigationState**: `NavigationLoadingState` = `state`

### push()

> **push**: (`path`, `elementId?`, `options?`) => `void` = `navigateWithLoading`

#### Parameters

##### path

`string`

##### elementId?

`string`

##### options?

###### replace?

`boolean`

###### scroll?

`boolean`

###### shallow?

`boolean`

#### Returns

`void`

### refresh()

> **refresh**: () => `void`

Refresh current page with loading state

#### Returns

`void`

### replace()

> **replace**: (`path`, `elementId?`) => `void`

#### Parameters

##### path

`string`

##### elementId?

`string`

#### Returns

`void`

### targetPath

> **targetPath**: `string` \| `null` = `state.targetPath`
