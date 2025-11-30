# Library Page List View Buttons - File Guide

## Primary File (Main Control)

**File:** `app/navigator/profile/library/page.tsx`

This single file controls ALL the list view buttons and functionality for the library page at https://www.happyyoga.app/navigator/profile/library

---

## Key Components in `library/page.tsx`

### 1. **AsanasLibrary Component** (lines ~290-407)

Controls the view toggle for the Asanas tab

- **State:** `const [viewMode, setViewMode] = useState<'card' | 'list'>('card')` (line 300)
- **Card View Button:** Lines 344-359
  - Icon: `<ViewModuleIcon />`
  - onClick: `setViewMode('card')`
- **List View Button:** Lines 363-378
  - Icon: `<FormatListBulletedIcon />`
  - onClick: `setViewMode('list')`

### 2. **SeriesLibrary Component** (lines ~410-525)

Controls the view toggle for the Series tab

- **State:** `const [viewMode, setViewMode] = useState<'card' | 'list'>('card')` (line 418)
- **Card View Button:** Lines 461-476
  - Icon: `<ViewModuleIcon />`
  - onClick: `setViewMode('card')`
- **List View Button:** Lines 480-495
  - Icon: `<FormatListBulletedIcon />`
  - onClick: `setViewMode('list')`

### 3. **SequencesLibrary Component** (lines ~530-645)

Controls the view toggle for the Sequences tab

- **State:** `const [viewMode, setViewMode] = useState<'card' | 'list'>('card')` (line 538)
- **Card View Button:** Lines 581-596
  - Icon: `<ViewModuleIcon />`
  - onClick: `setViewMode('card')`
- **List View Button:** Lines 600-615
  - Icon: `<FormatListBulletedIcon />`
  - onClick: `setViewMode('list')`

---

## View Rendering Logic

Each component has two view modes:

### **Card View** (Grid Layout)

```tsx
{
  viewMode === 'card' && (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <CardComponent item={item} />
        </Grid>
      ))}
    </Grid>
  )
}
```

### **List View** (Stacked Layout)

```tsx
{
  viewMode === 'list' && (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item) => (
        <ListItemComponent key={item.id} item={item} />
      ))}
    </Box>
  )
}
```

---

## List Item Components (Rendered in List View)

### 1. **AsanaListItem** (lines 651-847)

- Displays asana information in a horizontal Paper component
- Shows thumbnail image (80x80px)
- Includes asana name and description
- Has Edit and Delete action buttons

### 2. **SeriesListItem** (lines 848-992)

- Displays series information in a horizontal Paper component
- Shows series details
- Includes asana count
- Has Edit and Delete action buttons

### 3. **SequenceListItem** (lines 993-1137)

- Displays sequence information in a horizontal Paper component
- Shows sequence details
- Includes step count
- Has Edit and Delete action buttons

---

## MUI Icons Used

The view toggle buttons use Material-UI icons:

- **Card View Icon:** `ViewModuleIcon` (grid icon)
- **List View Icon:** `FormatListBulletedIcon` (bullet list icon)

Both imported from `@mui/icons-material`

---

## Button Styling Pattern

Each toggle button uses this consistent pattern:

```tsx
<IconButton
  onClick={() => setViewMode('mode')}
  disabled={viewMode === 'mode'} // Disabled when active
  aria-label="accessibility label"
  sx={{
    color: 'primary.main',
    p: 1,
    minWidth: 0,
    opacity: viewMode === 'mode' ? 0.5 : 1, // 50% opacity when active
  }}
  title="tooltip text"
>
  <IconComponent />
</IconButton>
```

---

## Test File

**File:** `__test__/app/navigator/profile/library/page.spec.tsx`

Contains comprehensive tests for view toggle functionality:

- Line 1173: Test suite "LibraryPage - Asanas View Toggle Feature"
- Tests verify button rendering, toggling, and list view interactions

---

## Summary

**ONE FILE controls everything:** `app/navigator/profile/library/page.tsx`

The file contains:

- 3 main library components (Asanas, Series, Sequences)
- Each has its own independent `viewMode` state
- Each has identical view toggle button implementations
- 3 list item components for rendering in list view
- All styling and logic in a single 1,628-line file
