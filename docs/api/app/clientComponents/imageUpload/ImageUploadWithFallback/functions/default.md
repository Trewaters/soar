[**soar**](../../../../../README.md)

***

[soar](../../../../../modules.md) / [app/clientComponents/imageUpload/ImageUploadWithFallback](../README.md) / default

# Function: default()

> **default**(`props`): `Element`

Defined in: app/clientComponents/imageUpload/ImageUploadWithFallback.tsx:107

ImageUploadWithFallback is a React component for uploading images with robust fallback support.

This component allows users to upload images (JPEG, PNG, WebP) to a cloud endpoint, with automatic
fallback to local storage if the cloud upload fails (e.g., due to network issues or server errors).
It provides a user-friendly UI with drag-and-drop or button-based upload, image preview, alt text input,
and visual feedback for errors and upload progress.

Features:
- Drag-and-drop or button-triggered file selection.
- File type and size validation.
- Image preview and automatic alt text suggestion.
- Upload to cloud with progress indication.
- Fallback dialog for saving images locally if cloud upload fails.
- Local storage quota and usage display.
- Accessibility-friendly alt text input.
- Debug information for development.

## Parameters

### props

`ImageUploadWithFallbackProps`

Component props.

## Returns

`Element`

## Component

## Example

```ts
<ImageUploadWithFallback
  onImageUploaded={(img) => console.log('Uploaded:', img)}
  maxFileSize={5}
  acceptedTypes={['image/jpeg', 'image/png']}
  variant="dropzone"
/>
```

## Remarks

Requires a valid user session (via useSession) and a localImageStorage utility for local fallback.
The component is designed for Next.js/React applications and uses Material UI for styling.
