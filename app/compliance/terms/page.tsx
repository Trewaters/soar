import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

const TermsOfService: React.FC = () => {
  return (
    <Box style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Stack spacing={'64px'}>
        <Stack>
          <Typography variant="h1">Terms of Service</Typography>
          <Typography variant="body1">Last updated: [Date]</Typography>
          <Typography variant="body1">
            Welcome to Happy Yoga Soar. These terms and conditions outline the
            rules and regulations for the use of Happy Yoga Soar&apos;s Website,
            located at [Your Website URL].
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">1. Terms</Typography>
          <Typography variant="body1">
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use Happy Yoga Soar if you do not
            agree to take all of the terms and conditions stated on this page.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">2. Cookies</Typography>
          <Typography variant="body1">
            We employ the use of cookies. By accessing Happy Yoga Soar, you
            agreed to use cookies in agreement with the Happy Yoga Soar&apos;s
            Privacy Policy.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">3. License</Typography>
          <Typography variant="body1">
            Unless otherwise stated, Happy Yoga Soar and/or its licensors own
            the intellectual property rights for all material on Happy Yoga
            Soar. All intellectual property rights are reserved. You may access
            this from Happy Yoga Soar for your own personal use subjected to
            restrictions set in these terms and conditions.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">4. User Comments</Typography>
          <Typography variant="body1">
            Certain parts of this website offer the opportunity for users to
            post and exchange opinions and information in certain areas of the
            website. Happy Yoga Soar does not filter, edit, publish or review
            Comments prior to their presence on the website. Comments do not
            reflect the views and opinions of Happy Yoga Soar, its agents and/or
            affiliates. Comments reflect the views and opinions of the person
            who post their views and opinions.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">5. Hyperlinking to our Content</Typography>
          <Typography variant="body1">
            The following organizations may link to our Website without prior
            written approval: Government agencies; Search engines; News
            organizations; Online directory distributors may link to our Website
            in the same manner as they hyperlink to the Websites of other listed
            businesses; and System wide Accredited Businesses except soliciting
            non-profit organizations, charity shopping malls, and charity
            fundraising groups which may not hyperlink to our Web site.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">6. iFrames</Typography>
          <Typography variant="body1">
            Without prior approval and written permission, you may not create
            frames around our Webpages that alter in any way the visual
            presentation or appearance of our Website.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">7. Content Liability</Typography>
          <Typography variant="body1">
            We shall not be hold responsible for any content that appears on
            your Website. You agree to protect and defend us against all claims
            that is rising on your Website. No link(s) should appear on any
            Website that may be interpreted as libelous, obscene or criminal, or
            which infringes, otherwise violates, or advocates the infringement
            or other violation of, any third party rights.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">8. Your Privacy</Typography>
          <Typography variant="body1">Please read Privacy Policy</Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">9. Reservation of Rights</Typography>
          <Typography variant="body1">
            We reserve the right to request that you remove all links or any
            particular link to our Website. You approve to immediately remove
            all links to our Website upon request. We also reserve the right to
            amen these terms and conditions and it&apos;s linking policy at any
            time. By continuously linking to our Website, you agree to be bound
            to and follow these linking terms and conditions.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">
            10. Removal of links from our website
          </Typography>
          <Typography variant="body1">
            If you find any link on our Website that is offensive for any
            reason, you are free to contact and inform us any moment. We will
            consider requests to remove links but we are not obligated to or so
            or to respond to you directly.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h2">11. Disclaimer</Typography>
          <Typography variant="body1">
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties and conditions relating to our website
            and the use of this website. Nothing in this disclaimer will:
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
