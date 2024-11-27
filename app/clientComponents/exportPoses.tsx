import { Box, Button, Typography } from '@node_modules/@mui/material'
import React from 'react'

interface PostureShareProps {
  postureName: string
  description: string
  url: string
}

const PostureShareButton: React.FC<PostureShareProps> = ({
  postureName,
  description,
  url,
}) => {
  const shareData = {
    title: postureName,
    text: description,
    url: url,
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        console.log('Posture shared successfully!')
      } catch (error) {
        console.error('Error sharing posture:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      const shareText = `${postureName}\n${description}\n${url}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert(
          'Sharing is not supported in your browser. The link has been copied to your clipboard.'
        )
      })
    }
  }

  return (
    <Box>
      <Typography variant="h2">{postureName}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Button onClick={handleShare}>Share this Posture</Button>
    </Box>
  )
}

export default PostureShareButton
