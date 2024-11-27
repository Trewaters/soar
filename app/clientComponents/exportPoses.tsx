import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'

interface PostureShareButtonProps {
  postureData?: FullAsanaData | null
  seriesData?: FlowSeriesData | null
}

const PostureShareButton: React.FC<PostureShareButtonProps> = ({
  postureData = null,
  seriesData = null,
}) => {
  const shareAsanaData = postureData
    ? {
        title: postureData.sort_english_name + ',\n ',
        text: postureData.description + '\n',
        url: window.location.href,
      }
    : seriesData
      ? {
          title: seriesData.seriesName + '\n',
          text: seriesData.seriesPostures
            .map((posture) => posture.replace(';', ','))
            .join('\n'),
          url: 'https://www.happyyoga.app/navigator/flows/practiceSeries',
        }
      : null

  const handleShare = async () => {
    if (!shareAsanaData) return

    if (navigator.share) {
      try {
        await navigator.share(shareAsanaData)
        console.log('Data shared successfully!')
      } catch (error) {
        console.error('Error sharing data:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      const shareText = `${shareAsanaData.title}\n${shareAsanaData.text}\n${shareAsanaData.url}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert(
          'Sharing is not supported in your browser. The link has been copied to your clipboard.'
        )
      })
    }
  }

  return (
    <Box>
      {shareAsanaData ? (
        <>
          {/* <Typography variant="h2">
            {postureData
              ? postureData.english_names.join(', ')
              : seriesData?.seriesName}
          </Typography> */}
          {/* <Typography variant="body1">
            {postureData ? postureData.description : seriesData?.description}
          </Typography> */}
          <Button endIcon={<IosShareIcon />} onClick={handleShare}>
            Share this {postureData ? 'Posture' : 'Series'}
          </Button>
        </>
      ) : (
        <Typography variant="body1">No data available to share.</Typography>
      )}
    </Box>
  )
}

export default PostureShareButton
