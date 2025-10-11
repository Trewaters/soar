[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/hooks/useFormManager](../README.md) / UseFormManagerReturn

# Interface: UseFormManagerReturn

Defined in: app/hooks/useFormManager.ts:27

## Properties

### errors

> **errors**: `Record`\<`string`, `string`\>

Defined in: app/hooks/useFormManager.ts:30

***

### handleFieldBlur()

> **handleFieldBlur**: (`name`) => `void`

Defined in: app/hooks/useFormManager.ts:45

#### Parameters

##### name

`string`

#### Returns

`void`

***

### handleFieldFocus()

> **handleFieldFocus**: (`name`) => `void`

Defined in: app/hooks/useFormManager.ts:44

#### Parameters

##### name

`string`

#### Returns

`void`

***

### handleSubmit()

> **handleSubmit**: (`e`) => `void`

Defined in: app/hooks/useFormManager.ts:39

#### Parameters

##### e

`FormEvent`

#### Returns

`void`

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: app/hooks/useFormManager.ts:31

***

### registerField()

> **registerField**: (`name`) => (`ref`) => `void`

Defined in: app/hooks/useFormManager.ts:43

#### Parameters

##### name

`string`

#### Returns

> (`ref`): `void`

##### Parameters

###### ref

`HTMLElement` | `null`

##### Returns

`void`

***

### resetForm()

> **resetForm**: () => `void`

Defined in: app/hooks/useFormManager.ts:40

#### Returns

`void`

***

### setFieldError()

> **setFieldError**: (`name`, `error`) => `void`

Defined in: app/hooks/useFormManager.ts:35

#### Parameters

##### name

`string`

##### error

`string`

#### Returns

`void`

***

### setFieldTouched()

> **setFieldTouched**: (`name`, `touched`) => `void`

Defined in: app/hooks/useFormManager.ts:36

#### Parameters

##### name

`string`

##### touched

`boolean`

#### Returns

`void`

***

### setValue()

> **setValue**: (`name`, `value`) => `void`

Defined in: app/hooks/useFormManager.ts:34

#### Parameters

##### name

`string`

##### value

`string`

#### Returns

`void`

***

### touched

> **touched**: `Record`\<`string`, `boolean`\>

Defined in: app/hooks/useFormManager.ts:29

***

### values

> **values**: `Record`\<`string`, `string`\>

Defined in: app/hooks/useFormManager.ts:28
