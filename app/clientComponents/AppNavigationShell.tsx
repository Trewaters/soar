'use client'

import { Box } from '@mui/material'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@serverComponents/header'
import NavBottom from '@serverComponents/navBottom'
import OfflineBadge from '@clientComponents/OfflineBadge'
import { COLORS } from '../../styles/theme'

export default function AppNavigationShell({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  const handleMenuToggle = () => {
    const event = new CustomEvent('openHeaderDrawer')
    window.dispatchEvent(event)
  }

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          backgroundColor: COLORS.primaryOrange,
          color: COLORS.textInverse,
          padding: '8px 16px',
          zIndex: 1000,
          textDecoration: 'none',
          transform: 'translateY(-100%)',
          transition: 'transform 0.3s',
        }}
        onFocus={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        onBlur={(e) => (e.currentTarget.style.transform = 'translateY(-100%)')}
      >
        Skip to main content
      </a>
      <Header />
      <Box
        id="main-content"
        role="main"
        sx={{
          minHeight: 'calc(100vh - 69px - 66px)',
          pb: '74px',
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
      <NavBottom subRoute={pathname} onMenuToggle={handleMenuToggle} />
      <OfflineBadge />
    </>
  )
}
