import React from 'react'
import type { Metadata } from 'next'
import '@styles/globals.css'
import AppHeader from './app-header'

export const metadata: Metadata = {
  title: 'Happy Yoga',
  description: 'Soar like a leaf on the wind!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
