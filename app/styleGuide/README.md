# Style Guide Documentation

## Overview

The Style Guide page (`/styleGuide`) serves as a comprehensive template and reference for the design system used throughout the Soar yoga application. It showcases all typography, theme values, color palettes, and MUI components with primary theme styling.

## Features

### 🎨 **Typography Showcase**

- All heading variants (H1-H6) with font sizes from theme
- Body text variants (body1, body2)
- Subtitle variants
- Caption, overline, and custom variants (label, splashTitle)
- Dynamic font size display from theme configuration

### ⚙️ **Theme Configuration Display**

- **Breakpoints**: Shows all responsive breakpoints (xs, sm, md, lg, xl)
- **Spacing Scale**: Displays the spacing system used throughout the app
- **Font Family**: Shows the primary font family configuration

### 🌈 **Dynamic Color Palette**

- **No Hardcoded Values**: All colors are pulled directly from the theme
- **Complete Palette**: Primary, Secondary, Error, Warning, Info, Success
- **Color Variants**: Main, Light, Dark, and ContrastText for each palette
- **Visual Color Swatches**: Interactive color blocks with hex values

### 🧩 **MUI Components Library**

All components currently used in the app are showcased:

#### Form Controls

- `TextField` with app-specific styling
- `Autocomplete` with sample data
- `Checkbox` with form groups
- `FormControlLabel` and `FormHelperText`

#### Buttons & Actions

- `Button` variants (contained, outlined, text)
- `IconButton` with Material icons
- `ButtonGroup` combinations
- App-specific button styles from navigator components

#### Layout & Navigation

- `Card`, `CardHeader`, `CardContent`, `CardActions`
- `AppBar` with navigation items
- `Tabs` with interactive switching
- `List`, `ListItem`, `ListItemButton` with icons

#### Feedback & Display

- `Alert` components (success, info, warning, error)
- `CircularProgress` loading indicator
- `Collapse` expandable content
- `Avatar` with theme colors
- `Divider` variants

## Usage as a Template

### 1. **Extract Individual Components**

Use the `ComponentTemplate.tsx` example to see how to extract specific component patterns:

```tsx
// Example: App-specific button style
<Button
  variant="outlined"
  sx={{
    borderRadius: '14px',
    boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.25)',
    // ... other app-specific styles
  }}
>
  Your Button Text
</Button>
```

### 2. **Use Theme Values Dynamically**

Always reference theme values instead of hardcoding:

```tsx
const theme = useTheme()

// ✅ Good: Dynamic theme values
<Box sx={{ color: 'primary.main' }}>
<Typography variant="h1">{theme.typography.h1.fontSize}</Typography>

// ❌ Bad: Hardcoded values
<Box sx={{ color: '#F6893D' }}>
<Typography style={{ fontSize: '3rem' }}>
```

### 3. **Component Constants**

Use the constants from `constants/Strings.ts`:

```tsx
import { ThemeConstants } from '@app/styleGuide/constants/Strings'

// Access predefined theme values
ThemeConstants.COLOR_PALETTE_KEYS // ['primary', 'secondary', ...]
ThemeConstants.TYPOGRAPHY_VARIANTS // ['h1', 'h2', ...]
ThemeConstants.BUTTON_VARIANTS // ['contained', 'outlined', 'text']
```

## App-Specific Styles

### Navigation Button Pattern

```tsx
sx={{
  borderRadius: '14px',
  boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.25)',
  textTransform: 'uppercase',
  padding: '12px 16px',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0px 6px 8px -1px rgba(0, 0, 0, 0.25)',
  },
  '&:focus': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: '2px',
  },
}}
```

### Form Field Pattern

```tsx
sx={{
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '12px',
    borderColor: 'primary.main',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.light',
  },
}}
```

## Benefits

1. **Consistency**: Ensures all components follow the same design patterns
2. **Maintainability**: Theme changes automatically propagate throughout the app
3. **Documentation**: Visual reference for developers and designers
4. **Template Library**: Ready-to-use component patterns
5. **Accessibility**: Consistent focus states and color contrasts

## Files Structure

```
/app/styleGuide/
├── page.tsx                    # Main style guide page
├── constants/
│   └── Strings.ts             # Theme constants and color definitions
└── components/
    └── ComponentTemplate.tsx   # Example of extracting components
```

## Navigation

Access the style guide at `/styleGuide` in your application to see all components and theme values in action.
