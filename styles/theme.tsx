import { CSSProperties } from 'react'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: CSSProperties
  }

  interface TypographyVariantsOptions {
    label?: CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true
  }
}

export const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
  spacing: [0, 4, 8, 16, 32, 40, 48, 64],
  palette: {
    // mode: 'light',
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
      contrastText: '#000000',
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
      dark: '#9A0007',
      contrastText: '#000000',
    },
    warning: {
      main: '#FFA726',
      light: '#FFD95B',
      dark: '#C77800',
      contrastText: '#000000',
    },
    info: {
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
    // text: {
    //   primary: '#000000',
    //   // used by CardHeader.subheader
    //   secondary: '#C08926',
    // },
    // background: {
    //   default: '#ffffff',
    //   paper: '#ffffff',
    // },
    // action: {
    //   active: '#ffffff',
    //   hover: '#ffffff',
    //   selected: '#ffffff',
    //   disabled: '#ffffff',
    //   disabledBackground: '#ffffff',
    // },
    // divider: '#ffffff',
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
      fontSize: '3rem',
      fontWeight: '900',
      letterSpacing: '0.1rem',
      wordSpacing: '1rem',
      // display: 'block',
      // marginTop: '0.67rem',
      // marginBottom: '0.67rem',
      // marginLeft: 0,
      // marginRight: 0,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: '700',
      letterSpacing: '0.05rem',
      wordSpacing: '0.05rem',
      // display: 'block',
      // marginTop: '0.57rem',
      // marginBottom: '0.57rem',
      // marginLeft: 0,
      // marginRight: 0,
    },
    h3: {
      fontSize: '1.5rrem',
      fontWeight: '700',
      letterSpacing: '0.001rem',
      wordSpacing: '0.01rem',
      // display: 'block',
      // marginTop: '0.47rem',
      // marginBottom: '0.47rem',
      // marginLeft: 0,
      // marginRight: 0,s
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: '700',
      // display: 'block',
      // marginTop: '0.37rem',
      // marginBottom: '0.47rem',
      // marginLeft: 0,
      // marginRight: 0,
    },
    h5: {
      fontSize: '1.6rem',
      fontWeight: '700',
      // display: 'block',
      // marginTop: '0.37rem',
      // marginBottom: '0.37rem',
      // marginLeft: 0,
      // marginRight: 0,
    },
    h6: {
      fontSize: '1.4rem',
      fontWeight: '700',
      // display: 'block',
      // marginTop: '0.37rem',
      // marginBottom: '0.37rem',
      // marginLeft: 0,
      // marginRight: 0,
    },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '.8rem' },
    subtitle1: { fontSize: '1.2rem' },
    subtitle2: { fontSize: '1.05rem' },
    overline: { fontSize: '0.9rem' },
    caption: { fontSize: '0.9rem' },
    label: { fontSize: '1.8rem', fontFamily: ['Lato', 'sans-serif'].join(',') },
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
