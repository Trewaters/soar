[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/hooks/useFormManager](../README.md) / UseFormManagerOptions

# Interface: UseFormManagerOptions

Defined in: app/hooks/useFormManager.ts:20

## Properties

### enableMobileOptimizations?

> `optional` **enableMobileOptimizations**: `boolean`

Defined in: app/hooks/useFormManager.ts:22

***

### initialValues

> **initialValues**: `Record`\<`string`, `string`\>

Defined in: app/hooks/useFormManager.ts:21

***

### onSubmit()?

> `optional` **onSubmit**: (`values`) => `void` \| `Promise`\<`void`\>

Defined in: app/hooks/useFormManager.ts:23

#### Parameters

##### values

`Record`\<`string`, `string`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### validate()?

> `optional` **validate**: (`values`) => `Record`\<`string`, `string`\>

Defined in: app/hooks/useFormManager.ts:24

#### Parameters

##### values

`Record`\<`string`, `string`\>

#### Returns

`Record`\<`string`, `string`\>
