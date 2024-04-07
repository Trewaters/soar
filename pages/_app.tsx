import RootLayout from '@/app/layout'
import { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}
