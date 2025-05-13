'use client'
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
      </a>

      <header>
        <Header />
      </header>
      <main id="main-content" role="main">
        {children}
      </main>
    </>
  )
}
