import { CSSProperties } from 'react'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: CSSProperties
    splashTitle: CSSProperties
    subtitle3: CSSProperties
  }

  interface TypographyVariantsOptions {
    label?: CSSProperties
    splashTitle?: CSSProperties
    subtitle3?: CSSProperties
  }

  interface TypeBackground {
    helper: string
  }

  interface PaletteOptions {
    navSplash: PaletteOptions['primary']
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true
    splashTitle: true
    subtitle3: true
  }
}

/**
 * The `mode` property in the palette configuration determines the theme's color scheme.
 *
 * In Material-UI (MUI), `mode` can be set to either:
 * - `'light'`: Applies a light color scheme with dark text on light backgrounds
 * - `'dark'`: Applies a dark color scheme with light text on dark backgrounds
 *
 * This setting affects default colors throughout the application, including:
 * - Component backgrounds
 * - Text colors
 * - Border colors
 * - Shadow intensities
 *
 * When `mode` is changed, MUI automatically adjusts component colors to maintain
 * proper contrast and readability according to Material Design specifications.
 *
 * @see https://mui.com/material-ui/customization/dark-mode/
 */
export const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 384, md: 768, lg: 1024, xl: 1920 } },
  spacing: 4, // Use a simple number multiplier - 4px base unit
  palette: {
    mode: 'light',
    primary: {
      main: '#F6893D',
      light: '#FFBA6F',
      dark: '#C3581A',
      contrastText: '#000000',
    },
    secondary: {
      main: '#F6B93D',
      light: '#FFD970',
      dark: '#C38B1A',
      contrastText: '#07020D',
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
      dark: '#9A0007',
      contrastText: '#d32f2f',
    },
    warning: {
      main: '#FFA726',
      light: '#FFD95B',
      dark: '#C77800',
      contrastText: '#000000',
    },
    info: {
      // #5DB7DE suggested for Flow info icon
      main: '#1976D2',
      light: '#63A4FF',
      dark: '#004BA0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#FFFFFF',
    },
    navSplash: {
      // color for the splash header body text
      main: '#185A77',
      // used for the background of the splash header titles, '#F8F4F2' is 'rgba(248, 244, 242, 0.5)'
      light: 'rgba(248, 244, 242, 0.5)',
      dark: '#F8F4F2',
      contrastText: '#07020D',
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
      helper: '#fef5e7',
    },
  },
  typography: {
    fontFamily: ['Lato', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
    },
    /*  
    Read more about fonts here:
    https://css-tricks.com/understanding-web-fonts-getting/

    Typography videos:
    https://youtu.be/klXyJWlIzuY?si=tLj2PmYvdjCQwxzu
    */
    h1: {
      fontSize: '2rem',
      fontWeight: '900',
      letterSpacing: '0.1rem',
      wordSpacing: '0.1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: '700',
      letterSpacing: '0.05rem',
      wordSpacing: '0.05rem',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: '700',
      letterSpacing: '0.001rem',
      wordSpacing: '0.001rem',
    },
    h4: {
      fontSize: '1.6rem',
      fontWeight: '700',
    },
    h5: {
      fontSize: '1.4rem',
      fontWeight: '700',
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: '700',
    },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '.8rem' },
    subtitle1: { fontSize: '1.2rem' },
    subtitle2: { fontSize: '1.05rem' },
    subtitle3: { fontSize: '1.5rem', fontWeight: 600 },
    overline: { fontSize: '0.9rem' },
    caption: { fontSize: '0.9rem' },
    label: { fontSize: '1.8rem' },
    splashTitle: {
      fontSize: '3rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
      wordSpacing: '0.1rem',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        // No more ripple, on the whole application 💣!
        disableRipple: true,
      },
    },
  },
})

export default theme
