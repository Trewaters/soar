[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/asanaOwnership](../README.md) / verifyAsanaOwnership

# Function: verifyAsanaOwnership()

> **verifyAsanaOwnership**(`postureId`, `userIdentifier`): `Promise`\<`boolean`\>

Defined in: app/utils/asanaOwnership.ts:18

Verify if a user owns a specific asana

## Parameters

### postureId

`string`

The ID of the asana to check

### userIdentifier

`string`

The user identifier to verify ownership for. Can be either the user's email or their internal id.

## Returns

`Promise`\<`boolean`\>

Promise<boolean> - True if user owns the asana
