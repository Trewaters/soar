// components/Footer.tsx
import { Box, Stack, Typography } from '@mui/material'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      {/*  
    //           <Link href="/contact">
    //             <a>Contact Us</a>
    //           </Link>
   
    //   */}
      <Stack
        display={'flex'}
        textAlign={'center'}
        sx={{ position: 'absolute', bottom: 2, width: '100%' }}
      >
        <Stack>
          <Typography variant="body2">
            © copyright 2023 - {new Date().getFullYear()} Happy Yoga Soar App.
            All rights reserved.
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
            View our By using this site, you agree to our&nbsp;
            <Link href="/terms">Terms of Service</Link>&nbsp; for more details
            on how we protect your information.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="body2">
            View our <Link href="/privacy">Privacy Policy</Link>&nbsp; for more
            details on how we protect your information.
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="body2">
            <Link href="/contact">Contact Me</Link>
          </Typography>
        </Stack>
      </Stack>
    </footer>
  )
}
