[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/clientComponents/imageUpload/PostureImageUpload](../README.md) / default

# Function: default()

> **default**(`props`): `Element`

Defined in: app/clientComponents/imageUpload/PostureImageUpload.tsx:94

A React component for uploading images associated with a specific asana pose.

Supports both "button" and "dropzone" variants for file selection, drag-and-drop,
file type and size validation, image preview, alt text input for accessibility,
and error handling. Integrates with user session and associates the uploaded image
with a posture by ID and name.

## Parameters

### props

`PostureImageUploadProps`

Component props.

## Returns

`Element`

The image upload UI.

## Component

## Example

```ts
<PostureImageUpload
  postureId="123"
  postureName="Downward Dog"
  onImageUploaded={(img) => console.log(img)}
  variant="dropzone"
/>
```
