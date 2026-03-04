import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Footer from '../../components/footer'
import '@testing-library/jest-dom'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const theme = createTheme()

describe('Footer Component', () => {
  beforeEach(() => {
    // Mock Date to ensure consistent year testing
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-12-01')) // Set to December 2024 to ensure full year
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
  }

  it('renders as a footer element with proper semantic structure', () => {
    renderWithTheme(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('displays correct copyright information with current year', () => {
    renderWithTheme(<Footer />)

    const copyrightText = screen.getByText(
      /© copyright 2023 - 2024 Uvuyoga Soar App/i
    )
    expect(copyrightText).toBeInTheDocument()
    expect(copyrightText).toHaveTextContent(
      '© copyright 2023 - 2024 Uvuyoga Soar App. All rights reserved.'
    )
  })

  it('displays intellectual property notice', () => {
    renderWithTheme(<Footer />)

    const ipNotice = screen.getByText(/All content, trademarks, and materials/i)
    expect(ipNotice).toBeInTheDocument()
    expect(ipNotice).toHaveTextContent(
      /intellectual property of Uvuyoga Soar App/
    )
    expect(ipNotice).toHaveTextContent(
      /protected by international copyright and trademark laws/
    )
  })

  it('renders all required navigation links', () => {
    renderWithTheme(<Footer />)

    const termsLink = screen.getByRole('link', { name: /terms of service/i })
    expect(termsLink).toBeInTheDocument()
    expect(termsLink).toHaveAttribute('href', '/compliance/terms')

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink).toHaveAttribute('href', '/privacy')

    const contactLink = screen.getByRole('link', { name: /contact me/i })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('includes terms of service agreement text', () => {
    renderWithTheme(<Footer />)

    const termsText = screen.getByText(
      /By using this website and mobile application/i
    )
    expect(termsText).toBeInTheDocument()
    expect(termsText).toHaveTextContent(
      /you agree to comply with and be bound by/
    )
  })

  it('includes privacy policy reference text', () => {
    renderWithTheme(<Footer />)

    const privacyText = screen.getByText(
      /for more details on how we protect your information/i
    )
    expect(privacyText).toBeInTheDocument()
  })

  it('has proper link accessibility', () => {
    renderWithTheme(<Footer />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)

    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
      expect(link.getAttribute('href')).not.toBe('')
    })
  })

  it('displays content in proper hierarchical order', () => {
    renderWithTheme(<Footer />)

    const footer = screen.getByRole('contentinfo')
    const textElements = footer.querySelectorAll('p')

    // Should have 5 text sections as per the component structure
    expect(textElements).toHaveLength(5)

    // Verify the order by checking content
    expect(textElements[0]).toHaveTextContent(/© copyright/)
    expect(textElements[1]).toHaveTextContent(/All content, trademarks/)
    expect(textElements[2]).toHaveTextContent(/Terms of Service/)
    expect(textElements[3]).toHaveTextContent(/Privacy Policy/)
    expect(textElements[4]).toHaveTextContent(/Contact Me/)
  })

  it('uses appropriate typography variants', () => {
    renderWithTheme(<Footer />)

    const footer = screen.getByRole('contentinfo')
    const typographyElements = footer.querySelectorAll(
      '[class*="MuiTypography"]'
    )

    // All text should be body2 variant (which is the default for footer content)
    typographyElements.forEach((element) => {
      expect(element.className).toMatch(/MuiTypography/)
    })
  })

  it('maintains responsive layout structure', () => {
    renderWithTheme(<Footer />)

    const footer = screen.getByRole('contentinfo')

    // Check that the footer has the expected layout classes/structure
    expect(footer.firstChild).toHaveStyle({
      position: 'absolute',
      bottom: '0',
      width: '100%',
      textAlign: 'center',
    })
  })

  describe('link navigation', () => {
    it('terms of service link points to correct path', () => {
      renderWithTheme(<Footer />)

      const termsLink = screen.getByRole('link', { name: /terms of service/i })
      expect(termsLink).toHaveAttribute('href', '/compliance/terms')
    })

    it('privacy policy link points to correct path', () => {
      renderWithTheme(<Footer />)

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
      expect(privacyLink).toHaveAttribute('href', '/privacy')
    })

    it('contact link points to correct path', () => {
      renderWithTheme(<Footer />)

      const contactLink = screen.getByRole('link', { name: /contact me/i })
      expect(contactLink).toHaveAttribute('href', '/contact')
    })
  })

  describe('content accuracy', () => {
    it('includes complete copyright notice', () => {
      renderWithTheme(<Footer />)

      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
    })

    it('includes unauthorized use warning', () => {
      renderWithTheme(<Footer />)

      expect(
        screen.getByText(/Unauthorized use is prohibited/i)
      ).toBeInTheDocument()
    })

    it('uses consistent branding name', () => {
      renderWithTheme(<Footer />)

      const brandingElements = screen.getAllByText(/Uvuyoga Soar App/i)
      expect(brandingElements.length).toBeGreaterThan(0)
    })
  })
})
