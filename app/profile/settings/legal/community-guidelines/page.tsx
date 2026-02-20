import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import theme from '@styles/theme'

export const metadata = {
  title: 'Community Guidelines | Uvuyoga',
  description:
    'Community guidelines for respectful and mindful participation in the Uvuyoga community.',
}

const CommunityGuidelinesPage = () => (
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

      <Box>
        <Typography variant="h1" gutterBottom>
          Community Guidelines
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Last Updated: October 28, 2025</strong>
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Welcome to the Uvuyoga community! Our platform is dedicated to
          supporting your yoga practice and fostering a respectful, inclusive,
          and mindful environment. By participating in our community, you agree
          to follow these guidelines.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          1. Be Respectful and Kind
        </Typography>
        <Typography variant="body1" paragraph>
          Treat all community members with respect, compassion, and
          understanding. Harassment, bullying, hate speech, or discriminatory
          behavior of any kind will not be tolerated. Remember that yoga is
          about unity and peace—let that guide your interactions.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          2. Honor Individual Practice Journeys
        </Typography>
        <Typography variant="body1" paragraph>
          Everyone is at a different stage in their yoga journey. Avoid making
          judgmental comments about others&apos; abilities, body types, or
          practice choices. Offer encouragement and support instead of
          unsolicited advice.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          3. Share Mindfully
        </Typography>
        <Typography variant="body1" paragraph>
          When sharing content, ensure it is appropriate, authentic, and
          relevant to the yoga community. Do not post:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Spam, promotional content, or advertisements without permission
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Explicit, violent, or offensive material
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Misinformation about health, wellness, or yoga practices
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Content that violates intellectual property rights
            </Typography>
          </li>
        </ul>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          4. Respect Privacy and Safety
        </Typography>
        <Typography variant="body1" paragraph>
          Do not share personal information about yourself or others without
          consent. This includes addresses, phone numbers, or private messages.
          If you feel unsafe or witness inappropriate behavior, report it
          immediately.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          5. Practice Cultural Sensitivity
        </Typography>
        <Typography variant="body1" paragraph>
          Yoga has deep roots in ancient Indian philosophy and culture. Approach
          discussions about yoga&apos;s history, traditions, and practices with
          respect and cultural awareness. Avoid cultural appropriation and be
          open to learning.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          6. No Medical Advice
        </Typography>
        <Typography variant="body1" paragraph>
          While sharing personal experiences is welcome, do not provide medical
          diagnoses or treatment recommendations. Always encourage community
          members to consult qualified healthcare professionals for medical
          concerns.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          7. Keep Discussions Constructive
        </Typography>
        <Typography variant="body1" paragraph>
          Healthy debate and diverse perspectives are encouraged, but keep
          discussions respectful and focused. Avoid inflammatory language,
          personal attacks, or derailing conversations.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          8. Follow Platform Rules
        </Typography>
        <Typography variant="body1" paragraph>
          Comply with our Terms of Service and Privacy Policy. Do not attempt to
          hack, exploit, or misuse the platform. Report bugs or security issues
          responsibly.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          Consequences of Violations
        </Typography>
        <Typography variant="body1" paragraph>
          Violations of these guidelines may result in:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">Warning or content removal</Typography>
          </li>
          <li>
            <Typography variant="body1">
              Temporary or permanent account suspension
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Reporting to appropriate authorities if illegal activity is
              involved
            </Typography>
          </li>
        </ul>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          Reporting Issues
        </Typography>
        <Typography variant="body1" paragraph>
          If you encounter behavior that violates these guidelines, please
          report it through our feedback system or contact us at{' '}
          <a href="mailto:trewaters@hotmail.com">trewaters@hotmail.com</a>. We
          review all reports and take appropriate action.
        </Typography>

        <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
          Our Commitment
        </Typography>
        <Typography variant="body1" paragraph>
          We are committed to maintaining a safe, welcoming space for all
          practitioners. These guidelines may be updated as our community grows.
          Thank you for helping us create a positive and supportive environment.
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 4 }}>
          <em>Namaste</em> 🙏
        </Typography>
      </Box>
    </Stack>
  </Container>
)

export default CommunityGuidelinesPage
