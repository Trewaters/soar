[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/clientComponents/inputComponents/TextInputField](../README.md) / useTextInputField

# Function: useTextInputField()

> **useTextInputField**(`fieldKey`, `userId?`): `object`

Defined in: app/clientComponents/inputComponents/TextInputField.tsx:251

Hook for using TextInputField with common Soar patterns

## Parameters

### fieldKey

`string`

Stable key for the input field

### userId?

`string`

User ID for personalization

## Returns

`object`

Enhanced props and utilities for TextInputField

### blurField()

> **blurField**: () => `void`

#### Returns

`void`

### defaultProps

> **defaultProps**: `Partial`\<[`TextInputFieldProps`](../interfaces/TextInputFieldProps.md)\>

### focusField()

> **focusField**: () => `void`

#### Returns

`void`

### getValue()

> **getValue**: () => `string`

#### Returns

`string`

### ref

> **ref**: `RefObject`\<[`TextInputFieldRef`](../type-aliases/TextInputFieldRef.md)\>

### setValue()

> **setValue**: (`value`) => `void`

#### Parameters

##### value

`string`

#### Returns

`void`
