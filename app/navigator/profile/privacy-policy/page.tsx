import { Container, Stack, Typography, Link } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import NextLink from 'next/link'
import theme from '@styles/theme'

export const metadata = {
  title: 'Privacy Policy | Uvuyoga',
  description:
    'Read the Uvuyoga privacy policy to learn how we protect your data and respect your privacy.',
}

const PrivacyPolicyPage = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Stack spacing={3}>
      {/* Back Button */}
      <NextLink
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
      </NextLink>

      <Typography variant="h1" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Last Updated: July 30th, 2025
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        At Uvuyoga, your privacy is important to us. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information
        when you use our mobile application and website (collectively, the
        &ldquo;App&rdquo;). Please read this policy carefully to understand your
        rights and our practices.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        1. Information We Collect
      </Typography>
      <Typography variant="h3" gutterBottom sx={{ mt: 3 }}>
        a. Personal Data
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
        <Typography component="li" variant="body1">
          Name, email address, and any other information you provide when you
          register or contact us. When using social logins like Google or Github
          we can collect any of the data shared with them through their
          permissions.
        </Typography>
        <Typography component="li" variant="body1">
          Optional data, such as profile photo or preferences if you choose to
          enter them.
        </Typography>
      </Stack>

      <Typography variant="h3" gutterBottom sx={{ mt: 3 }}>
        b. Usage Data
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
        <Typography component="li" variant="body1">
          App activity, session logs, device information (e.g., model, OS,
          browser type).
        </Typography>
        <Typography component="li" variant="body1">
          IP address and approximate location.
        </Typography>
      </Stack>

      <Typography variant="h3" gutterBottom sx={{ mt: 3 }}>
        c. Cookies and Tracking
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
        <Typography component="li" variant="body1">
          We use cookies and similar technologies to improve the app experience,
          provide analytics, and personalize content.
        </Typography>
      </Stack>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        2. How We Use Your Information
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
        <Typography component="li" variant="body1">
          Provide and maintain the app.
        </Typography>
        <Typography component="li" variant="body1">
          Customize your experience and track your practice progress.
        </Typography>
        <Typography component="li" variant="body1">
          Communicate with you about updates or support.
        </Typography>
        <Typography component="li" variant="body1">
          Analyze usage to improve the app.
        </Typography>
        <Typography component="li" variant="body1">
          Comply with legal obligations.
        </Typography>
      </Stack>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        3. Sharing Your Information
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
        <Typography component="li" variant="body1">
          We do not sell your personal information. We may share it with:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            Service providers (e.g., email delivery, hosting, analytics).
          </Typography>
          <Typography component="li" variant="body1">
            Legal authorities if required by law.
          </Typography>
          <Typography component="li" variant="body1">
            With your consent.
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        4. Data Retention
      </Typography>
      <Typography variant="body1">
        We keep your information only as long as necessary to fulfill the
        purposes stated in this policy, or as required by law.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        5. Security
      </Typography>
      <Typography variant="body1">
        We implement appropriate technical and organizational measures to
        protect your data, including encryption, secure servers, and access
        controls.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        6. Your Rights
      </Typography>
      <Typography variant="body1">
        If you are in the European Union or the UK, you have rights under the
        General Data Protection Regulation (GDPR):
      </Typography>
      <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
        <Typography component="li" variant="body1">
          Right to Access – You can request a copy of your data.
        </Typography>
        <Typography component="li" variant="body1">
          Right to Rectify – You can update incorrect or incomplete information.
        </Typography>
        <Typography component="li" variant="body1">
          Right to Erasure – You can ask us to delete your data.
        </Typography>
        <Typography component="li" variant="body1">
          Right to Restrict Processing – You may limit how we use your data.
        </Typography>
        <Typography component="li" variant="body1">
          Right to Data Portability – You can ask to receive your data in a
          structured format.
        </Typography>
        <Typography component="li" variant="body1">
          Right to Object – You can object to how your data is used.
        </Typography>
      </Stack>

      <Typography variant="body1">
        To exercise these rights, contact us at:{' '}
        <Link href="mailto:trewaters@hotmail.com">trewaters@hotmail.com</Link>
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        7. International Users
      </Typography>
      <Typography variant="body1">
        If you are accessing the app from outside the United States, your data
        may be transferred to, stored, and processed in the U.S. By using the
        app, you consent to such transfer and processing.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        8. Children&apos;s Privacy
      </Typography>
      <Typography variant="body1">
        We do not knowingly collect personal data from children under the age of
        13 (or under 16 in the EU) without parental consent.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        9. Changes to This Policy
      </Typography>
      <Typography variant="body1">
        We may update this policy from time to time. You will be notified of any
        material changes through the app or by email.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        10. Contact Us
      </Typography>
      <Typography variant="body1">
        For privacy-related questions or requests, please contact:
        <br />
        Uvuyoga Support
        <br />
        Email:{' '}
        <Link href="mailto:trewaters@hotmail.com">trewaters@hotmail.com</Link>
        <br />
        Address: TBD
      </Typography>
    </Stack>
  </Container>
)

export default PrivacyPolicyPage
