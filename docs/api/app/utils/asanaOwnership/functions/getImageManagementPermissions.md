[**soar**](../../../../README.md)

***

[soar](../../../../modules.md) / [app/utils/asanaOwnership](../README.md) / getImageManagementPermissions

# Function: getImageManagementPermissions()

> **getImageManagementPermissions**(`asana`, `session`): `object`

Defined in: app/utils/asanaOwnership.ts:85

Get image management permissions for a user and asana

## Parameters

### asana

[`AsanaPostureData`](../../../../types/images/interfaces/AsanaPostureData.md)

The asana to check permissions for

### session

The user's authentication session

`Session` | `null`

## Returns

`object`

Object with permission details

### canDelete

> **canDelete**: `boolean`

### canManage

> **canManage**: `boolean`

### canReorder

> **canReorder**: `boolean`

### canUpload

> **canUpload**: `boolean`

### currentCount

> **currentCount**: `number`

### isOwner

> **isOwner**: `any`

### isUserCreated

> **isUserCreated**: `boolean`

### maxImages

> **maxImages**: `number`

### remainingSlots

> **remainingSlots**: `number`
