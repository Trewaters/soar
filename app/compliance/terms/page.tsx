import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { TermsService } from './constants/Strings'

const TermsOfService: React.FC = () => {
  return (
    <Box style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Stack spacing={'64px'}>
        <Stack>
          <Typography variant="h1">{TermsService.TITLE}</Typography>
          <Typography variant="body1">
            {TermsService.LAST_UPDATED} [Date]
          </Typography>
          <Typography variant="body1">
            Welcome to Happy Yoga Soar. These terms and conditions outline the
            rules and regulations for the use of Happy Yoga Soar&apos;s Website,
            located at [Your Website URL].
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">{TermsService.TERMS_HEADING}</Typography>
          <Typography variant="body1">{TermsService.TERMS_DETAILS}</Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">{TermsService.COOKIES_HEADING}</Typography>
          <Typography variant="body1">
            {TermsService.COOKIES_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">{TermsService.LICENSE_HEADING}</Typography>
          <Typography variant="body1">
            {TermsService.LICENSE_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">
            {TermsService.USER_COMMENTS_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.USER_COMMENTS_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">{TermsService.HYPERLINK_HEADING}</Typography>
          <Typography variant="body1">
            {TermsService.HYPERLINK_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">{TermsService.IFRAMES_HEADING}</Typography>
          <Typography variant="body1">
            {TermsService.IFRAMES_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">
            {TermsService.CONTENT_LIABILITY_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.CONTENT_LIABILITY_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">{TermsService.PRIVACY_HEADING}</Typography>
          <Typography variant="body1">
            {TermsService.PRIVACY_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">
            {TermsService.RESERVATION_RIGHTS_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.RESERVATION_RIGHTS_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">
            {TermsService.LINK_REMOVAL_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.LINK_REMOVAL_DETAILS}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">
            {TermsService.DISCLAIMER_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.DISCLAIMER_DETAILS}
          </Typography>
          <ul>
            <li>
              limit or exclude our or your liability for death or personal
              injury;
            </li>
            <li>
              limit or exclude our or your liability for fraud or fraudulent
              misrepresentation;
            </li>
            <li>
              limit any of our or your liabilities in any way that is not
              permitted under applicable law; or
            </li>
            <li>
              exclude any of our or your liabilities that may not be excluded
              under applicable law.
            </li>
          </ul>
          <Typography variant="body1">
            The limitations and prohibitions of liability set in this Section
            and elsewhere in this disclaimer: (a) are subject to the preceding
            paragraph; and (b) govern all liabilities arising under the
            disclaimer, including liabilities arising in contract, in tort and
            for breach of statutory duty.
          </Typography>
          <Typography variant="body1">
            As long as the website and the information and services on the
            website are provided free of charge, we will not be liable for any
            loss or damage of any nature.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default TermsOfService
