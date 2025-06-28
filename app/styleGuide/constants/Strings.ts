export abstract class StyleGuideText {
  public static readonly PRIMARY = 'primary'
  public static readonly SECONDARY = 'secondary'
  public static readonly ERROR = 'error'
  public static readonly WARNING = 'warning'
  public static readonly INFO = 'info'
  public static readonly SUCCESS = 'success'
}

export abstract class ThemeConstants {
  // Typography variants used in the app
  public static readonly TYPOGRAPHY_VARIANTS = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'overline',
    'label',
    'splashTitle', // Custom variants
  ] as const

  // Color palette keys
  public static readonly COLOR_PALETTE_KEYS = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
  ] as const

  // Color variants for each palette key
  public static readonly COLOR_VARIANTS = [
    'main',
    'light',
    'dark',
    'contrastText',
  ] as const

  // Common component sizes
  public static readonly COMPONENT_SIZES = ['small', 'medium', 'large'] as const

  // Common component variants
  public static readonly BUTTON_VARIANTS = [
    'contained',
    'outlined',
    'text',
  ] as const
}
