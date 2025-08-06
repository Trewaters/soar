'use client'
import { Box } from '@mui/material'
import Header from '@serverComponents/header'
import { ReactNode } from 'react'

export default function NavigatorLayout({ children }: { children: ReactNode }) {
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
          minHeight: 'calc(100vh - 69px)', // Account for header height
          pb: 20, // 20 * 4 = 80px bottom padding
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </>
  )
}
