[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/mobileInputHelpers](../README.md) / preventMobileKeyboardDismiss

# Function: preventMobileKeyboardDismiss()

> **preventMobileKeyboardDismiss**(`event`, `callback?`): `boolean`

Defined in: app/utils/mobileInputHelpers.ts:32

Prevent mobile keyboard dismissal on blur events
This function checks if the blur is intentional or accidental

## Parameters

### event

`FocusEvent`

The blur event

### callback?

() => `void`

Optional callback to execute if blur should proceed

## Returns

`boolean`

boolean indicating if the blur should be prevented
