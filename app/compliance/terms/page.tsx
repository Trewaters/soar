import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { TermsService } from './constants/Strings'

const TermsOfService: React.FC = () => {
  return (
    <Box style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Stack spacing={'64px'}>
        <Stack>
          <Typography variant="h1">{TermsService.TITLE}</Typography>
          <Typography variant="body1">{TermsService.EFFECTIVE_DATE}</Typography>
          <Typography variant="body1">{TermsService.INTRO}</Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.ACCEPTANCE_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.ACCEPTANCE_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.ELIGIBILITY_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.ELIGIBILITY_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.USE_OF_APP_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.USE_OF_APP_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.ACCOUNT_REGISTRATION_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.ACCOUNT_REGISTRATION_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.USER_CONDUCT_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.USER_CONDUCT_DETAILS}
          </Typography>
          <ul>
            <li>{TermsService.USER_CONDUCT_ITEM_1}</li>
            <li>{TermsService.USER_CONDUCT_ITEM_2}</li>
            <li>{TermsService.USER_CONDUCT_ITEM_3}</li>
          </ul>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.INTELLECTUAL_PROPERTY_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.INTELLECTUAL_PROPERTY_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.TERMINATION_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.TERMINATION_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.LIMITATION_LIABILITY_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.LIMITATION_LIABILITY_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.MODIFICATIONS_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.MODIFICATIONS_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.GOVERNING_LAW_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.GOVERNING_LAW_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">
            {TermsService.USER_DATA_POLICY_HEADING}
          </Typography>
          <Typography variant="body1">
            {TermsService.USER_DATA_POLICY_DETAILS}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h2">{TermsService.CONTACT_HEADING}</Typography>
          <Typography variant="body1">
            {TermsService.CONTACT_DETAILS}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default TermsOfService
