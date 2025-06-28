# Style Guide Component Test

This test file validates the Style Guide component (`/app/styleGuide/page.tsx`) which serves as a comprehensive design system reference for the Soar yoga application.

## Test Coverage

### Overall Structure

- Verifies the main style guide container renders correctly
- Ensures all main sections are present and properly structured

### Typography Section

- Tests all typography variants (H1-H6, subtitles, body text, caption, overline, label, splash title)
- Validates font size information is displayed correctly
- Confirms custom typography variants are rendered

### Theme Configuration Section

- Verifies breakpoints information is displayed
- Tests spacing scale information rendering
- Confirms font family information is shown

### Color Palette Section

- Tests that the color palette section renders correctly
- Validates the structure of color information display

### MUI Components Testing

#### Button Components

- All button variants: contained, outlined, text, disabled
- Icon buttons with Material icons
- Button groups
- App-specific button styling

#### Form Control Components

- TextField with helper text and app-specific styling
- Autocomplete with sample data
- Checkbox components with form groups
- Form labels and helper text

#### Card Components

- Card with header, media, content, and actions
- Expandable cards with collapse functionality
- Interactive card behavior

#### Navigation Components

- Tabs with interactive switching capability
- AppBar with navigation elements
- Lists with navigation items and icons
- Proper icon rendering and counts

#### Feedback Components

- All Alert variants (success, info, warning, error)
- CircularProgress loading indicator
- Feedback component structure

#### Layout Components

- Divider variants (full width, middle, standard)
- Avatar components with theme colors
- Proper layout structure

### Interactive Functionality

- Autocomplete interaction testing
- Checkbox interaction validation
- State management across multiple interactions
- Tab switching functionality

### Accessibility

- Semantic HTML structure validation
- Proper form labels and controls
- Button accessibility attributes
- Heading hierarchy verification

### Theme Integration

- Dynamic theme value usage (no hardcoded values)
- Theme information display accuracy
- Theme-based color and typography rendering

### Performance

- Render performance validation
- Efficient state update handling
- Multiple interaction performance

## Key Components Tested

The test validates all MUI components currently used in the Soar application:

- Alert, AppBar, Autocomplete, Avatar, Box, Button, ButtonGroup
- Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox
- CircularProgress, Collapse, Container, Divider, FormControl
- FormControlLabel, FormGroup, FormHelperText, Grid, IconButton
- List, ListItem, ListItemButton, ListItemIcon, ListItemText
- Paper, Stack, Tab, Tabs, TextField, Typography

## Material Icons Tested

The test includes mocks for all Material Icons used in the style guide:

- ExpandMore, Favorite, Home, Menu, Person, Search, Settings

## Test Configuration

- Uses ThemeProvider with the actual app theme configuration
- Includes proper TypeScript types for theme extensions
- Supports all app-specific palette colors (navSplash, etc.)
- Handles custom typography variants (label, splashTitle)

## Running the Tests

```bash
npm test -- "__test__/app/styleGuide/styleGuide.spec.tsx"
```

## Test Structure

The tests are organized into logical groups:

1. **Overall Structure** - Basic rendering validation
2. **Section-specific tests** - Typography, Theme, Colors, Components
3. **Interactive functionality** - User interactions and state
4. **Accessibility** - ARIA attributes and semantic structure
5. **Theme Integration** - Dynamic theme usage
6. **Performance** - Rendering and interaction performance

This comprehensive test suite ensures that the Style Guide component serves as a reliable reference for the application's design system and that all components are properly rendered and functional.
