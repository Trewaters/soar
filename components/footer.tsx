import { Box, Stack, Typography } from '@mui/material'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <Box
        sx={{
          width: '100%',
          p: '2rem',
          color: 'text.secondary',
        }}
        // sx={{ position: 'absolue', bottom: 0, marginTop: '240px' }}
        textAlign={'center'}
      >
        <Stack display={'flex'} justifyContent={'space-between'} flex={'wrap'}>
          <Stack>
            <Typography variant="body2">
              © copyright 2023 - {new Date().getFullYear()} Happy Yoga Soar
              App. All rights reserved.
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="body2">
              All content, trademarks, and materials on this site, including but
              not limited to logos, text, graphics, images, and videos, are the
              intellectual property of Happy Yoga Soar App and are protected by
              international copyright and trademark laws. Unauthorized use is
              prohibited.
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="body2">
              View our&nbsp;{' '}
              <Link href="/compliance/terms">Terms of Service</Link>
              .&nbsp;By using this website and mobile application, you agree to
              comply with and be bound by the following terms and conditions.
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="body2">
              View our <Link href="/privacy">Privacy Policy</Link>&nbsp; for
              more details on how we protect your information.
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="body2">
              <Link href="/contact">Contact Me</Link>
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </footer>
  )
}
