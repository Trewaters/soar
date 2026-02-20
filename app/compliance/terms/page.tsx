import { Box, Stack, Typography, Container } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import { prisma } from '@lib/prismaClient'
import theme from '@styles/theme'
import { readTosMarkdown } from './server/tosFileRegistry'

type MarkdownBlock =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() })
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() })
      index += 1
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() })
      index += 1
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2).trim())
        index += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    blocks.push({ type: 'p', text: line })
    index += 1
  }

  return blocks
}

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
          select: {
            id: true,
            title: true,
            summary: true,
            effectiveAt: true,
            externalUrl: true,
          },
        })
      : null

  if (!active) {
    active = await client['tosVersion']?.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        effectiveAt: true,
        externalUrl: true,
      },
    })
  }

  if (!active) {
    active = await client['tosVersion']?.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        effectiveAt: true,
        externalUrl: true,
      },
    })
  }
  const markdown = readTosMarkdown(active?.externalUrl)
  const blocks = markdown ? parseMarkdownBlocks(markdown) : []

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
          <Stack spacing={4}>
            <Stack>
              <Typography variant="h1">
                {active?.title || 'Terms of Service'}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1">
                  {active?.effectiveAt
                    ? `Effective: ${new Date(active.effectiveAt).toLocaleDateString()}`
                    : 'Effective date unavailable'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Version: {active?.id ?? 'none'}
                </Typography>
              </Stack>
              {active?.summary ? (
                <Typography variant="body1">{active.summary}</Typography>
              ) : null}
            </Stack>
            {blocks.length > 0 ? (
              blocks.map((block, blockIndex) => {
                if (block.type === 'h1') {
                  return (
                    <Typography key={blockIndex} variant="h2">
                      {block.text}
                    </Typography>
                  )
                }
                if (block.type === 'h2') {
                  return (
                    <Typography key={blockIndex} variant="h3">
                      {block.text}
                    </Typography>
                  )
                }
                if (block.type === 'h3') {
                  return (
                    <Typography key={blockIndex} variant="h4">
                      {block.text}
                    </Typography>
                  )
                }
                if (block.type === 'ul') {
                  return (
                    <Box key={blockIndex} component="ul" sx={{ pl: 3, m: 0 }}>
                      {block.items.map((item, itemIndex) => (
                        <li key={`${blockIndex}-${itemIndex}`}>
                          <Typography variant="body1">{item}</Typography>
                        </li>
                      ))}
                    </Box>
                  )
                }

                return (
                  <Typography key={blockIndex} variant="body1">
                    {block.text}
                  </Typography>
                )
              })
            ) : (
              <Typography variant="body1" color="text.secondary">
                No Terms of Service markdown content found. Add a markdown file
                under app/compliance/terms/content and publish a TOS version
                that points to it.
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
