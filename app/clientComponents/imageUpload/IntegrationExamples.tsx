/**
 * Integration examples for adding image upload and gallery functionality
 * to existing pages in the yoga app
 */

// 1. Integration with User Profile Page
// Add to app/profile/page.tsx or similar

import ImageManagement from '@app/clientComponents/imageUpload/ImageManagement'
import { useSession } from 'next-auth/react'

export function ProfileWithImages() {
  const { data: session } = useSession()

  if (!session) {
    return <div>Please log in to manage your pose images</div>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Other profile content */}

      {/* Image Management Section */}
      <Box sx={{ mt: 4 }}>
        <ImageManagement title="My Yoga Pose Images" variant="full" />
      </Box>
    </Box>
  )
}

// 2. Integration with Asana Creation Page
// Modify app/navigator/asanaPostures/createAsana/page.tsx

export function CreateAsanaWithImages() {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.')
  }

  return (
    <Box sx={{ px: 2, pb: 7 }}>
      <Typography variant="h1">Create Asana</Typography>

      {/* Existing form content */}
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}

        {/* Add image upload section */}
        <Grid size={12}>
          <FormControl sx={{ width: '100%', mb: 3 }}>
            <ImageManagement title="Reference Images" variant="upload-only" />
          </FormControl>
        </Grid>

        {/* Rest of form */}
        <Grid size={12}>
          <Button type="submit" variant="contained" color="primary">
            Create Asana
          </Button>
        </Grid>
      </form>
    </Box>
  )
}

// 3. Integration with Posture Detail Page
// Add to app/navigator/asanaPostures/[pose]/postureActivityDetail.tsx

export function PostureDetailWithImages({
  postureCardProp,
}: {
  postureCardProp: FullAsanaData
}) {
  return (
    <Paper sx={{ mt: '-2.2px', backgroundColor: 'navSplash.dark' }}>
      {/* Existing posture detail content */}

      {/* Add images section */}
      <Box sx={{ mt: 3, px: 2 }}>
        <ImageManagement
          title={`Images for ${postureCardProp.sort_english_name}`}
          variant="full"
        />
      </Box>

      {/* Rest of existing content */}
    </Paper>
  )
}

// 4. Standalone Upload Component Usage
// For quick uploads without full gallery

import ImageUpload, {
  PoseImageData,
} from '@app/clientComponents/imageUpload/ImageUpload'

export function QuickUploadExample() {
  const handleImageUploaded = (image: PoseImageData) => {
    console.log('New image uploaded:', image)
    // Handle the uploaded image (e.g., show success message)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add a pose image
      </Typography>
      <ImageUpload
        onImageUploaded={handleImageUploaded}
        variant="dropzone"
        maxFileSize={5} // 5MB limit
        acceptedTypes={['image/jpeg', 'image/png']}
      />
    </Box>
  )
}

// 5. Gallery-Only Component Usage
// For viewing existing images

import ImageGallery from '@app/clientComponents/imageUpload/ImageGallery'
import { FullAsanaData } from '@context/AsanaPostureContext'

import {
  Box,
  Typography,
  Grid2 as Grid,
  FormControl,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import { FormEvent, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export function GalleryOnlyExample() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        My Pose Images
      </Typography>
      <ImageGallery />
    </Box>
  )
}

// 6. Integration with Navigation
// Add to a navigation menu or header

export function NavWithImageUpload() {
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Other nav items */}

        <IconButton
          color="inherit"
          onClick={() => setUploadOpen(true)}
          title="Upload pose image"
        >
          {/*            eslint-disable-next-line react/jsx-no-undef            */}
          <CloudUploadIcon />
        </IconButton>

        <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)}>
          <DialogTitle>Upload Pose Image</DialogTitle>
          <DialogContent>
            <ImageUpload
              onImageUploaded={(image) => {
                console.log('Image uploaded:', image)
                setUploadOpen(false)
              }}
              variant="dropzone"
            />
          </DialogContent>
        </Dialog>
      </Toolbar>
    </AppBar>
  )
}
