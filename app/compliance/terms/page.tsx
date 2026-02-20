import { Box, Stack, Typography, Container } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import { TermsService } from './constants/Strings'
import { prisma } from '@lib/prismaClient'
import theme from '@styles/theme'

export default async function TermsOfService({
  searchParams,
}: {
  searchParams: Promise<{ versionId?: string }>
}) {
  const params = await searchParams
  const requestedVersionIdRaw = params?.versionId
  const requestedVersionId = Array.isArray(requestedVersionIdRaw)
    ? requestedVersionIdRaw[0]
    : requestedVersionIdRaw

  // Access the TosVersion model via the prisma client; use bracket access to
  // avoid TS errors if the generated client types are out-of-sync.
  // Try to load the active version; if none exists, fall back to the most
  // recently created version so the page still shows an id for staging/dev.
  const client: any = prisma
  let active =
    typeof requestedVersionId === 'string' && requestedVersionId.length > 0
      ? await client['tosVersion']?.findUnique({
          where: { id: requestedVersionId },
          select: { id: true, title: true, effectiveAt: true },
        })
      : null

  if (!active) {
    active = await client['tosVersion']?.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, effectiveAt: true },
    })
  }

  if (!active) {
    active = await client['tosVersion']?.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, effectiveAt: true },
    })
  }

  // Remove debug logging and JSON output for production clarity

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Back Button */}
        <Link
          href="/profile/settings/legal"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: theme.palette.primary.main,
            width: 'fit-content',
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Back to Legal</Typography>
        </Link>

        <Box style={{ maxWidth: '800px' }}>
          <Stack spacing={'64px'}>
            <Stack>
              <Typography variant="h1">{TermsService.TITLE}</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1">
                  {active?.effectiveAt
                    ? `Effective: ${new Date(active.effectiveAt).toLocaleDateString()}`
                    : TermsService.EFFECTIVE_DATE}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Version: {active?.id ?? 'none'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Title: {active?.title ?? 'none'}
                </Typography>
              </Stack>
              <Typography variant="body1">{TermsService.INTRO}</Typography>
            </Stack>

            {/* Debug output removed */}

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
              <Typography variant="h2">
                {TermsService.CONTACT_HEADING}
              </Typography>
              <Typography variant="body1">
                {TermsService.CONTACT_DETAILS}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
