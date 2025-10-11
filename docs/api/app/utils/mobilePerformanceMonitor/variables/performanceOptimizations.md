[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/mobilePerformanceMonitor](../README.md) / performanceOptimizations

# Variable: performanceOptimizations

> `const` **performanceOptimizations**: `object`

Defined in: app/utils/mobilePerformanceMonitor.ts:400

Performance optimization utilities

## Type Declaration

### addPassiveListener()

> **addPassiveListener**: (`element`, `event`, `handler`) => () => `void`

Optimized event listener with passive option

#### Parameters

##### element

`EventTarget`

##### event

`string`

##### handler

`EventListener`

#### Returns

> (): `void`

##### Returns

`void`

### debounce()

> **debounce**: \<`T`\>(`func`, `delay`) => `T`

Debounce function for input handlers

#### Type Parameters

##### T

`T` *extends* `Function`

#### Parameters

##### func

`T`

##### delay

`number`

#### Returns

`T`

### scheduleUpdate()

> **scheduleUpdate**: (`callback`) => `void`

Optimize component rendering with RAF

#### Parameters

##### callback

() => `void`

#### Returns

`void`

### throttle()

> **throttle**: \<`T`\>(`func`, `delay`) => `T`

Throttle function for frequent events

#### Type Parameters

##### T

`T` *extends* `Function`

#### Parameters

##### func

`T`

##### delay

`number`

#### Returns

`T`
