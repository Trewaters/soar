import { CSSProperties } from 'react'
import { createTheme } from '@mui/material/styles'

// Color constants - define once, use everywhere
const COLORS = {
  // Primary colors
  primaryOrange: '#F6893D',
  primaryOrangeLight: '#FFBA6F',
  primaryOrangeDark: '#C3581A',

  // Secondary colors
  secondaryYellow: '#F6B93D',
  secondaryYellowLight: '#FFD970',
  secondaryYellowDark: '#C38B1A',

  // Text colors
  textPrimary: '#07020D',
  textDisabled: '#6c757d',
  textInverse: '#ffffff',
  textBlack: '#000000',
  textDark: '#333333',
  textGray: '#666666',
  textGrayLight: '#757575',

  // Background colors
  backgroundDefault: '#f0f0f0',
  backgroundPaper: '#ffffff',
  backgroundHelper: '#fef5e7',
  backgroundLight: '#f5f5f5',

  // Error palette
  errorMain: '#D32F2F',
  errorLight: '#E57373',
  errorDark: '#9A0007',

  // Warning palette
  warningMain: '#C2410C',
  warningLight: '#FB923C',
  warningDark: '#7C2D12',

  // Info palette
  infoMain: '#1976D2',
  infoLight: '#63A4FF',
  infoDark: '#004BA0',

  // Success palette
  successMain: '#2E7D32',
  successLight: '#60AD5E',
  successDark: '#005005',

  // Navigation/Splash
  navSplashMain: '#185A77',
  navSplashDark: '#F8F4F2',
  navSplashLight: 'rgba(248, 244, 242, 0.5)',

  // Chart and borders
  chartAxisStroke: '#888888',
  borderDivider: '#e0e0e0',
  shadowGray: '#CBCBCB',

  // RGB format for dynamic opacity (used in rgba() format)
  primaryOrangeRGB: '246, 137, 61',

  // Dark overlay opacity variants (for modals, overlays, semi-transparent backgrounds)
  overlayDarkLightest: 'rgba(0, 0, 0, 0.1)',
  overlayDarkLight: 'rgba(0, 0, 0, 0.15)',
  overlayDarkMedium: 'rgba(0, 0, 0, 0.2)',
  overlayDarkStrong: 'rgba(0, 0, 0, 0.25)',
  overlayDarkFull: 'rgba(0, 0, 0, 0.5)',
  overlayDarkFuller: 'rgba(0, 0, 0, 0.6)',
  overlayDarkFullest: 'rgba(0, 0, 0, 0.7)',
  overlayDarkDarkest: 'rgba(0, 0, 0, 0.8)',

  // White overlay opacity variants (for light overlays, frosted glass effects)
  overlayWhiteSoft: 'rgba(255, 255, 255, 0.1)',
  overlayWhiteLight: 'rgba(255, 255, 255, 0.2)',
  overlayWhiteMedium: 'rgba(255, 255, 255, 0.3)',
  overlayWhiteStrong: 'rgba(255, 255, 255, 0.5)',
  overlayWhiteVeryStrong: 'rgba(255, 255, 255, 0.6)',
  overlayWhiteExtraStrong: 'rgba(255, 255, 255, 0.8)',
  overlayWhiteStrongest: 'rgba(255, 255, 255, 0.9)',

  // Email/Special colors
  emailPurple: '#5e35b1',
  emailGradientLight1: '#ff9a9e',
  emailGradientLight2: '#fecfef',
  emailGradientDark1: '#a18cd1',
  emailGradientDark2: '#fbc2eb',
} as const

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      cta: string
      floatingControl: string
    }
  }

  interface ThemeOptions {
    customShadows?: {
      cta?: string
      floatingControl?: string
    }
  }

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
    text: string
    surfaceSubtle: string
    surfaceHover: string
    overlayDark: string
    overlayDarkStrong: string
    overlayLightSoft: string
    overlayLightMedium: string
    overlayLightStrong: string
  }

  interface PaletteOptions {
    navSplash: PaletteOptions['primary']
  }

  interface TypeText {
    tertiary?: string
    hint?: string
    inverse?: string
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
      main: COLORS.primaryOrange,
      light: COLORS.primaryOrangeLight,
      dark: COLORS.primaryOrangeDark,
      contrastText: COLORS.textPrimary,
    },
    secondary: {
      main: COLORS.secondaryYellow,
      light: COLORS.secondaryYellowLight,
      dark: COLORS.secondaryYellowDark,
      contrastText: COLORS.textPrimary,
    },
    error: {
      main: COLORS.errorMain,
      light: COLORS.errorLight,
      dark: COLORS.errorDark,
      contrastText: COLORS.textInverse,
    },
    warning: {
      main: COLORS.warningMain,
      light: COLORS.warningLight,
      dark: COLORS.warningDark,
      contrastText: COLORS.textInverse,
    },
    info: {
      // #5DB7DE suggested for Flow info icon
      main: COLORS.infoMain,
      light: COLORS.infoLight,
      dark: COLORS.infoDark,
      contrastText: COLORS.textInverse,
    },
    success: {
      main: COLORS.successMain,
      light: COLORS.successLight,
      dark: COLORS.successDark,
      contrastText: COLORS.textInverse,
    },
    navSplash: {
      main: COLORS.navSplashMain,
      light: COLORS.navSplashLight,
      dark: COLORS.navSplashDark,
      contrastText: COLORS.textPrimary,
    },
    background: {
      default: COLORS.backgroundDefault,
      paper: COLORS.backgroundPaper,
      helper: COLORS.backgroundHelper,
      text: COLORS.textDisabled,
      surfaceSubtle: 'rgba(0, 0, 0, 0.02)',
      surfaceHover: 'rgba(0, 0, 0, 0.04)',
      overlayDark: 'rgba(0, 0, 0, 0.7)',
      overlayDarkStrong: 'rgba(0, 0, 0, 0.8)',
      overlayLightSoft: 'rgba(255, 255, 255, 0.2)',
      overlayLightMedium: 'rgba(255, 255, 255, 0.3)',
      overlayLightStrong: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.primaryOrange,
      tertiary: COLORS.secondaryYellow,
      disabled: COLORS.textDisabled,
      hint: COLORS.primaryOrangeDark,
      inverse: COLORS.textInverse,
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
      // Top level page text
      fontSize: '2rem',
      fontWeight: '900',
      letterSpacing: '0.1rem',
      wordSpacing: '0.1rem',
    },
    h2: {
      // Top level page subheading for h1
      fontSize: '1.8rem',
      fontWeight: '700',
      letterSpacing: '0.05rem',
      wordSpacing: '0.05rem',
    },
    h3: {
      // Page level Section headings if h1 and h2 are taken
      fontSize: '1.6rem',
      fontWeight: '700',
      letterSpacing: '0.001rem',
      wordSpacing: '0.001rem',
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: '700',
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: '700',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: '700',
    },
    body1: { fontSize: '1rem' }, // default body text
    body2: { fontSize: '.8rem' },
    subtitle1: { fontSize: '1.2rem' }, // used for component titles
    subtitle2: { fontSize: '1.05rem' }, // used for table headings
    subtitle3: { fontSize: '1.5rem', fontWeight: 600 },
    overline: { fontSize: '0.9rem' },
    caption: { fontSize: '0.9rem' },
    label: { fontSize: '1.8rem' },
    splashTitle: {
      fontSize: 'clamp(1rem, 6vw, 2.5rem)', // Responsive sizing that scales with viewport
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
      wordSpacing: '0.1rem',
      textAlign: 'center',
      lineHeight: 1.2,
    },
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: ({ theme }) => ({
          color: theme.palette.primary.contrastText,
          '&::placeholder': {
            color: theme.palette.background.text,
            opacity: 0.65,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '12px',
            borderColor: theme.palette.primary.main,
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState, theme }: any) => ({
          ...(ownerState?.variant &&
            [
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'subtitle1',
              'subtitle2',
              'subtitle3',
            ].includes(ownerState.variant) && {
              color: theme.palette.text.secondary,
            }),
          ...(ownerState?.variant &&
            ['body1', 'body2'].includes(ownerState.variant) && {
              color: theme.palette.text.primary,
            }),
        }),
      },
    },
  },
  customShadows: {
    cta: '0 4px 8px rgba(0, 0, 0, 0.2)',
    floatingControl: '0 2px 4px rgba(0,0,0,0.3)',
  },
})

export { COLORS }
export default theme
