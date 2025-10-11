[**soar**](../../../README.md)

***

[soar](../../../modules.md) / [types/asana](../README.md) / AsanaAction

# Type Alias: AsanaAction

> **AsanaAction** = \{ `payload`: [`AsanaPosture`](../interfaces/AsanaPosture.md); `type`: `"SET_ASANA"`; \} \| \{ `payload`: `Partial`\<[`AsanaPosture`](../interfaces/AsanaPosture.md)\>; `type`: `"UPDATE_ASANA"`; \} \| \{ `payload`: `number`; `type`: `"SET_CURRENT_IMAGE_INDEX"`; \} \| \{ `payload`: `number`; `type`: `"UPDATE_IMAGE_COUNT"`; \} \| \{ `payload`: [`PoseImageData`](../../images/interfaces/PoseImageData.md); `type`: `"ADD_POSE_IMAGE"`; \} \| \{ `payload`: `string`; `type`: `"REMOVE_POSE_IMAGE"`; \} \| \{ `payload`: [`PoseImageData`](../../images/interfaces/PoseImageData.md)[]; `type`: `"REORDER_IMAGES"`; \} \| \{ `payload`: `boolean`; `type`: `"SET_REORDERING"`; \} \| \{ `payload`: `number` \| `null`; `type`: `"SET_UPLOAD_PROGRESS"`; \} \| \{ `type`: `"RESET_IMAGE_STATE"`; \}

Defined in: types/asana.ts:235
