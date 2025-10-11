[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/mobilePerformanceMonitor](../README.md) / useMobilePerformanceMonitor

# Function: useMobilePerformanceMonitor()

> **useMobilePerformanceMonitor**(): `object`

Defined in: app/utils/mobilePerformanceMonitor.ts:381

React hook for mobile performance monitoring

## Returns

`object`

### clearMetrics()

> **clearMetrics**: () => `void`

#### Returns

`void`

### exportMetrics()

> **exportMetrics**: () => [`PerformanceMetrics`](../interfaces/PerformanceMetrics.md)[]

#### Returns

[`PerformanceMetrics`](../interfaces/PerformanceMetrics.md)[]

### getStats()

> **getStats**: () => `object`

#### Returns

`object`

##### averages

> **averages**: `Partial`\<[`PerformanceMetrics`](../interfaces/PerformanceMetrics.md)\>

##### issueCount

> **issueCount**: `number`

##### peaks

> **peaks**: `Partial`\<[`PerformanceMetrics`](../interfaces/PerformanceMetrics.md)\>

##### suggestions

> **suggestions**: `string`[]

### startMonitoring()

> **startMonitoring**: () => `void`

#### Returns

`void`

### stopMonitoring()

> **stopMonitoring**: () => `void`

#### Returns

`void`
