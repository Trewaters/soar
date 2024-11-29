import React from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import { FlowSeriesData } from '@app/context/AsanaSeriesContext'

interface PostureShareButtonProps {
  postureData?: FullAsanaData | null
  seriesData?: FlowSeriesData | null
  showDetails?: boolean
}

/**
 * A React functional component that renders a button for sharing yoga posture or series data.
 *
 * @component
 * @param {PostureShareButtonProps} props - The properties for the component.
 * @param {object|null} props.postureData - The data for a single yoga posture. Default is null.
 * @param {object|null} props.seriesData - The data for a series of yoga postures. Default is null.
 * @param {boolean} props.showDetails - Flag to indicate whether to show detailed information. Default is false.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Example usage:
 * <PostureShareButton
 *   postureData={postureData}
 *   seriesData={seriesData}
 *   showDetails={true}
 * />
 */
const PostureShareButton: React.FC<PostureShareButtonProps> = ({
  postureData = null,
  seriesData = null,
  showDetails = false,
}) => {
  const shareAsanaData = postureData
    ? {
        title:
          'The yoga posture "' +
          postureData.sort_english_name +
          '" was shared with you. Below is the description:' +
          '\n ',
        text:
          postureData.description +
          '\n' +
          '\n' +
          '\n' +
          'Practice with us at Uvuyoga!' +
          '\n',
        url: window.location.href,
      }
    : seriesData
      ? {
          title:
            'The yoga series "' +
            seriesData.seriesName +
            '" was shared with you. Below are the postures:' +
            '\n',
          text:
            seriesData.seriesPostures
              .map((posture) => posture.replace(';', ','))
              .join('\n') +
            '\n' +
            '\n' +
            'Practice with us at Uvuyoga!' +
            '\n',
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
          {showDetails && (
            <>
              <Typography variant="h2">
                {postureData
                  ? postureData.english_names.join(', ')
                  : seriesData?.seriesName}
              </Typography>
              <Typography variant="body1">
                {postureData
                  ? postureData.description
                  : seriesData?.description}
              </Typography>
            </>
          )}
          <IconButton
            disableRipple
            sx={{ color: 'primary.contrastText' }}
            onClick={handleShare}
            aria-label={`Share this ${postureData ? 'Posture' : 'Series'}`}
          >
            <IosShareIcon />
            {/* Share this {postureData ? 'Posture' : 'Series'} */}
          </IconButton>
        </>
      ) : (
        <Typography variant="body1">No data available to share.</Typography>
      )}
    </Box>
  )
}

export default PostureShareButton
