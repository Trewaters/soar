[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/api/poses/route](../README.md) / GET

# Function: GET()

> **GET**(`request`): `Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `acitivity_completed`: `boolean` \| `null`; `acitivity_practice`: `boolean` \| `null`; `additional_cues`: `string` \| `null`; `benefits`: `string` \| `null`; `breath_direction_default`: `string` \| `null`; `breath_series`: `string`[]; `category`: `string` \| `null`; `created_by`: `string` \| `null`; `created_on`: `Date` \| `null`; `customize_asana`: `string` \| `null`; `deepening_cues`: `string` \| `null`; `description`: `string` \| `null`; `difficulty`: `string` \| `null`; `dristi`: `string` \| `null`; `duration_asana`: `string` \| `null`; `english_names`: `string`[]; `id`: `string`; `image`: `string` \| `null`; `imageCount`: `number`; `isUserCreated`: `boolean`; `joint_action`: `string` \| `null`; `label`: `string` \| `null`; `lore`: `string` \| `null`; `modifications`: `string`[]; `muscle_action`: `string` \| `null`; `posture_intent`: `string` \| `null`; `preferred_side`: `string` \| `null`; `preparatory_postures`: `string`[]; `sanskrit_names`: `JsonValue`; `setup_cues`: `string` \| `null`; `sideways`: `boolean` \| `null`; `sort_english_name`: `string`; `suggested_postures`: `string`[]; `transition_cues_in`: `string` \| `null`; `transition_cues_out`: `string` \| `null`; `updated_on`: `Date` \| `null`; `variations`: `string`[]; \}\> \| `NextResponse`\<`object`[]\>\>

Defined in: app/api/poses/route.ts:11

## Parameters

### request

`NextRequest`

## Returns

`Promise`\<`NextResponse`\<\{ `error`: `string`; \}\> \| `NextResponse`\<\{ `acitivity_completed`: `boolean` \| `null`; `acitivity_practice`: `boolean` \| `null`; `additional_cues`: `string` \| `null`; `benefits`: `string` \| `null`; `breath_direction_default`: `string` \| `null`; `breath_series`: `string`[]; `category`: `string` \| `null`; `created_by`: `string` \| `null`; `created_on`: `Date` \| `null`; `customize_asana`: `string` \| `null`; `deepening_cues`: `string` \| `null`; `description`: `string` \| `null`; `difficulty`: `string` \| `null`; `dristi`: `string` \| `null`; `duration_asana`: `string` \| `null`; `english_names`: `string`[]; `id`: `string`; `image`: `string` \| `null`; `imageCount`: `number`; `isUserCreated`: `boolean`; `joint_action`: `string` \| `null`; `label`: `string` \| `null`; `lore`: `string` \| `null`; `modifications`: `string`[]; `muscle_action`: `string` \| `null`; `posture_intent`: `string` \| `null`; `preferred_side`: `string` \| `null`; `preparatory_postures`: `string`[]; `sanskrit_names`: `JsonValue`; `setup_cues`: `string` \| `null`; `sideways`: `boolean` \| `null`; `sort_english_name`: `string`; `suggested_postures`: `string`[]; `transition_cues_in`: `string` \| `null`; `transition_cues_out`: `string` \| `null`; `updated_on`: `Date` \| `null`; `variations`: `string`[]; \}\> \| `NextResponse`\<`object`[]\>\>
