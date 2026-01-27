# Style Guide Documentation

## Overview

The Style Guide page (`/styleGuide`) serves as a comprehensive template and reference for the design system used throughout the Soar yoga application. It showcases all typography, theme values, color palettes, and MUI components with primary theme styling.

## Features

### 🎨 **Typography Showcase**

- All heading variants (H1-H6) with dynamic font sizes from theme
- Body text variants (body1, body2)
- Subtitle variants (subtitle1, subtitle2, subtitle3)
- Special variants: caption, overline, label, splashTitle
- Each variant shows:
  - Live example with actual font size
  - Usage context description
  - Font size value from theme configuration

### ⚙️ **Theme Configuration Display**

- **Breakpoints**: Shows all responsive breakpoints (xs, sm, md, lg, xl)
- **Spacing Scale**: Displays the spacing system used throughout the app
- **Font Family**: Shows the primary font family configuration

### 🌈 **Dynamic Color Palette**

- **No Hardcoded Values**: All colors are pulled directly from the theme
- **Complete Palette**: Primary, Secondary, Error, Warning, Info, Success, NavSplash, Text, Background
- **All Color Variants**: Automatically displays all color properties (main, light, dark, contrastText, etc.)
- **Visual Color Swatches**: Interactive color blocks with hex values
- **Smart Text Contrast**: Automatically calculates optimal text color (black/white) based on background luminance using WCAG 2.0 guidelines

### 🧩 **MUI Components Library**

All components currently used in the app are showcased with **exactly one example per component** to maintain clarity and avoid redundancy.

#### Form Controls

- `TextField` - Outlined variant with helper text
- `Autocomplete` - Custom styled with pose search example
- `Checkbox` - With FormControlLabel in FormGroup
- `FormControl`, `FormGroup`, `FormHelperText` - Form structure components

#### Buttons & Actions

- `Button` - Variants: contained, outlined, text, disabled
- `IconButton` - With Favorite icon example
- `ButtonGroup` - Contained variant with three buttons

#### Cards & Content

- `Card` - Complete card with header, media, content, and actions
- `CardHeader` - With title, subtitle, and action icon
- `CardMedia` - Placeholder media area
- `CardContent` - Body content area
- `CardActions` - Action buttons at card bottom
- `Collapse` - Expandable content example

#### Navigation

- `Tabs` - Three-tab example with state management
- `AppBar` - Static position with menu and profile icons
- `List`, `ListItem`, `ListItemButton` - Interactive list with icons
- `ListItemIcon`, `ListItemText` - List item components

#### Layout Components

- `Container` - MaxWidth lg wrapper for all content
- `Paper` - Elevation 3 sections and outlined variants
- `Grid2` - Responsive grid layout for theme values and colors
- `Stack` - Directional layout with spacing (horizontal example)
- `Box` - Flexible container with custom styling
- `Divider` - Simple horizontal divider

#### Feedback & Display

- `Alert` - All severities: success, info, warning, error
- `CircularProgress` - Primary color loading indicator
- `Avatar` - Single example with primary background

#### Help Drawer System (Custom Components)

- `HelpButton` - Green help icon button
- `HelpDrawer` - Bottom drawer with markdown support
- Usage examples with navigation patterns
- Code snippets for implementation
- Feature list and best practices
- Live demonstration with actual markdown content

## Usage as a Template

### 1. **Use Theme Values Dynamically**

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

### 2. **Component Constants**

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

### Help Drawer Pattern

```tsx
// State management
const [helpOpen, setHelpOpen] = useState(false)

// Button trigger
<HelpButton onClick={() => setHelpOpen(true)} />

// Drawer with markdown content
<HelpDrawer
  open={helpOpen}
  onClose={() => setHelpOpen(false)}
  content={`# Help Content\n\nYour markdown content here...`}
/>
```

**Features:**

- Auto-detects markdown files vs plain text
- Supports headings, lists, bold, italic formatting
- Mobile-friendly bottom drawer
- Keyboard accessible with focus management

## Benefits

1. **Consistency**: Ensures all components follow the same design patterns with single canonical examples
2. **Maintainability**: Theme changes automatically propagate throughout the app
3. **Documentation**: Visual reference for developers and designers
4. **Template Library**: Ready-to-use component patterns - one clear example per component
5. **Accessibility**: Consistent focus states, color contrasts, and WCAG-compliant text colors
6. **Help System**: Demonstrates the app's contextual help pattern
7. **Simplicity**: One example per component reduces cognitive load and maintains clarity

## Files Structure

```
/app/styleGuide/
├── page.tsx                    # Main style guide page component
├── README.md                   # This documentation file
└── constants/
    └── Strings.ts             # Theme constants and color definitions
```

## Design Principles

1. **One Example Per Component**: Each MUI component has exactly one clear example to avoid redundancy
2. **Theme-Driven**: All values dynamically pulled from theme configuration
3. **Accessible by Default**: WCAG 2.0 compliant color contrasts and focus management
4. **Mobile-First**: Responsive layouts that work on all screen sizes
5. **Real-World Usage**: Examples reflect actual app patterns and styling

## Navigation

Access the style guide at `/styleGuide` in your application to see all components and theme values in action.
