'use client'
import { Box } from '@mui/material'
import Header from '@serverComponents/header'
import NavBottom from '@serverComponents/navBottom'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigatorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const handleMenuToggle = () => {
    // Trigger the header menu by dispatching a custom event
    const event = new CustomEvent('openHeaderDrawer')
    window.dispatchEvent(event)
  }

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          backgroundColor: '#f6893d',
          color: '#fff',
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
      </a>{' '}
      <Header />
      <Box
        id="main-content"
        role="main"
        sx={{
          minHeight: 'calc(100vh - 69px - 66px)', // Account for header height (69px) and bottom nav height (66px)
          pb: '74px', // Bottom padding: 66px (nav height) + 8px (additional spacing)
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
      {/* Bottom Navigation - appears on all navigator pages */}
      <NavBottom subRoute={pathname} onMenuToggle={handleMenuToggle} />
    </>
  )
}
