import React from 'react'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  // interface TypographyVariants {
  //   cardTitle: React.CSSProperties
  // }

  interface TypographyVariantsOptions {
    cardTitle?: React.CSSProperties
  }
}

// declare module '@mui/material/Typography' {
//   interface TypographyPropsVariantOverrides {
//     cardTitle: true
//   }
// }

export const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
  spacing: [0, 4, 8, 16, 32, 40, 48, 64],
  palette: {
    mode: 'light',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#0000ff',
    },
    error: {
      main: '#ff0000',
    },
    warning: {
      main: '#ff0000',
    },
    info: {
      main: '#ff0000',
    },
    success: {
      main: '#ff0000',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    action: {
      active: '#ffffff',
      hover: '#ffffff',
      selected: '#ffffff',
      disabled: '#ffffff',
      disabledBackground: '#ffffff',
    },
    divider: '#ffffff',
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
    },
    h1: { fontSize: '6rem' },
    h2: { fontSize: '3.75rem' },
    h3: { fontSize: '3rem' },
    h4: { fontSize: '2.125rem' },
    h5: { fontSize: '1.5rem' },
    h6: { fontSize: '1.25rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    subtitle1: { fontSize: '1rem' },
    subtitle2: { fontSize: '0.875rem' },
    overline: { fontSize: '0.75rem' },
    caption: { fontSize: '0.75rem' },
    cardTitle: { fontSize: '1.25rem' },
  },
})

export default theme
