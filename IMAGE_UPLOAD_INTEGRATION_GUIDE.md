# Image Upload Integration Guide

Your yoga app now has a complete image upload and gallery system! Here's how to integrate and use the components.

## Architecture Overview

### Backend (Already Implemented ✅)

- **API Route**: `app/api/images/upload/route.ts`
  - POST: Upload images to Cloudflare + save to database
  - GET: Fetch user's uploaded images with pagination
  - DELETE: Remove images from Cloudflare + database
- **Database Model**: `PoseImage` in Prisma schema
- **Cloudflare Integration**: Images stored in Cloudflare Images

### Frontend Components (Already Implemented ✅)

- **ImageUpload.tsx**: Main upload component with dialog UI
- **ImageGallery.tsx**: Gallery view for managing uploaded images
- **ImageManagement.tsx**: Combined upload + gallery component
- **imageService.ts**: Client-side API functions

## Quick Integration Examples

### 1. Add to User Profile/Dashboard

```tsx
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'

function UserProfile() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">My Profile</Typography>

      {/* Add image management */}
      <ImageManagement title="My Yoga Pose Images" variant="full" />
    </Box>
  )
}
```

### 2. Add Upload-Only to Asana Creation

```tsx
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'

function CreateAsana() {
  return (
    <form onSubmit={handleSubmit}>
      {/* Existing form fields */}

      {/* Add image upload section */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <ImageManagement title="Reference Images" variant="upload-only" />
      </Box>

      <Button type="submit">Create Asana</Button>
    </form>
  )
}
```

### 3. Add to Posture Detail Page

Add this to `app/navigator/asanaPostures/[pose]/postureActivityDetail.tsx`:

```tsx
import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'

export default function PostureActivityDetail({ postureCardProp }) {
  return (
    <Paper>
      {/* Existing posture content */}

      {/* Add images section */}
      <Box sx={{ mt: 3, px: 2, pb: 3 }}>
        <ImageManagement
          title={`Images for ${postureCardProp.sort_english_name}`}
          variant="full"
        />
      </Box>
    </Paper>
  )
}
```

### 4. Standalone Upload Button

```tsx
import ImageUpload from '@app/clientComponents/imageUpload/ImageUpload'

function QuickUpload() {
  const handleImageUploaded = (image) => {
    console.log('Image uploaded:', image)
    // Handle success (show toast, update UI, etc.)
  }

  return (
    <ImageUpload
      onImageUploaded={handleImageUploaded}
      variant="button" // or "dropzone"
      maxFileSize={10} // MB
    />
  )
}
```

### 5. Gallery-Only View

```tsx
import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'

function MyImages() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">My Pose Images</Typography>
      <ImageGallery />
    </Box>
  )
}
```

## Component Props Reference

### ImageManagement

```tsx
interface ImageManagementProps {
  title?: string // Section title
  variant?: 'full' | 'upload-only' | 'gallery-only'
  showUploadButton?: boolean // Show upload tab
  showGallery?: boolean // Show gallery tab
}
```

### ImageUpload

```tsx
interface ImageUploadProps {
  onImageUploaded?: (image: PoseImageData) => void
  maxFileSize?: number // In MB (default: 10)
  acceptedTypes?: string[] // MIME types
  variant?: 'button' | 'dropzone' // UI style
}
```

### ImageGallery

```tsx
// No props required - automatically fetches user's images
```

## Configuration

### Environment Variables

Make sure these are set in your `.env.local`:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### File Upload Limits

- **Max file size**: 10MB (configurable)
- **Accepted formats**: JPEG, PNG, WebP
- **Storage**: Cloudflare Images (optimized delivery)

## Usage Tips

1. **Authentication Required**: All upload/gallery features require user login
2. **Image Optimization**: Cloudflare automatically optimizes images for web delivery
3. **Mobile Friendly**: Components work well on mobile devices with touch/camera upload
4. **Accessibility**: Alt text support for screen readers
5. **Error Handling**: Built-in error messages and validation

## Next Steps

1. **Choose Integration Points**: Decide where you want image upload in your app
2. **Test Upload Flow**: Try uploading images in development
3. **Customize Styling**: Adjust MUI theme to match your app's design
4. **Add Features**: Consider features like image categories, tagging, or pose detection

The system is ready to use! Just import the components where you need them.
