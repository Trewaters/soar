import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Recovery | Uvuyoga',
  description: 'Reset your Uvuyoga account password to regain access.',
}

export default function PasswordRecoveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
