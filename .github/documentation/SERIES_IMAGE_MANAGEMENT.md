# Series Image Management Feature

## Overview

The Series Image Management feature allows users to upload multiple images to their series and delete specific images while editing. This enhances the visual representation of yoga series and gives users more control over their content.

## Key Features

### Multiple Images Support

- Users can upload multiple images per series
- Supports JPEG, PNG, and WebP formats
- Maximum file size: 10MB per image
- Images are stored securely in cloud storage

### Image Management

- **Upload**: Users can add new images using drag-and-drop or file selection
- **Delete**: Individual images can be deleted with confirmation
- **View**: Images are displayed in a responsive grid layout
- **Mobile Support**: Touch-friendly interface with floating action button

### Security & Permissions

- Only series creators can manage images
- Authentication required for all operations
- Images are linked to user accounts
- Unauthorized access is prevented

## Technical Implementation

### Database Schema

```prisma
model AsanaSeries {
  // ... other fields
  image   String?   // Legacy single image field (backward compatibility)
  images  String[]  // New multiple images array
  // ... other fields
}
```

### API Endpoints

- `GET /api/series/[id]/images` - Fetch series images
- `POST /api/series/[id]/images` - Upload new image
- `DELETE /api/series/[id]/images` - Delete specific image

### Components

- `SeriesImageManager` - Main image management component
- Integration with `EditSeriesDialog` - Seamless editing experience

## Usage

### For Series Creators

1. Open a series for editing
2. Navigate to the "Series Images" section
3. Click "Add Image" or use drag-and-drop to upload
4. Click the delete button on any image to remove it
5. Changes are saved automatically

### Backward Compatibility

- Existing series with single images are automatically migrated
- Legacy `image` field is preserved for compatibility
- New series initialize with empty images array

## Benefits

- **Enhanced Visual Appeal**: Multiple images showcase series better
- **User Control**: Delete unwanted images anytime
- **Mobile Friendly**: Optimized for all device sizes
- **Secure**: Only creators can manage their series images
- **Fast**: Efficient cloud storage integration

## Future Enhancements

- Image reordering capability
- Batch image upload
- Image editing tools
- Image compression optimization
- Series cover image selection
