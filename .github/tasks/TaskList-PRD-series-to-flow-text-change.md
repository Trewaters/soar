# Engineering Task Breakdown: "Series" to "Flow" Display Text Change

This task list implements the cosmetic text change from "Series" to "Flow" throughout the Soar yoga application. **Only display text is changed** - all function names, variable names, file names, API routes, and database schemas remain unchanged.

---

## 1. Navigation Menu Text Changes

Update the main navigation components to display "Flows" instead of "Series".

### 1.1 Header Navigation

- In `components/header.tsx`, locate the navigation links array (around line 102)
- Change `name: 'Series'` to `name: 'Flows'`
- Verify the `href` path remains unchanged (`/navigator/flows/practiceSeries`)

### 1.2 Landing Page Navigation

- In `app/clientComponents/landing-page.tsx`, locate the `links` array (around line 20)
- Change `name: 'Series'` to `name: 'Flows'`
- Verify the `href` path remains unchanged (`/navigator/flows/practiceSeries`)

---

## 2. Flows Main Page Text Changes

Update the flows hub page at `app/navigator/flows/page.tsx`.

### 2.1 Practice Series Button

- Locate the `SplashNavButton` for "Practice Series" (around line 97-103)
- Change `title="Practice Series"` to `title="Practice Flows"`
- Change `description="Series are made up of asana poses."` to `description="Flows are made up of asana poses."`

### 2.2 Create Series Button

- Locate the `SplashNavButton` for "Create Series" (around line 104-113)
- Change `title="Create Series"` to `title="Create Flow"`
- Change `description="Create your own Series of asana poses."` to `description="Create your own Flow of asana poses."`

---

## 3. Practice Series Page Text Changes

Update the practice series page at `app/navigator/flows/practiceSeries/page.tsx`.

### 3.1 Splash Header (if applicable)

- Search for any `SplashHeader` component with "Practice Series" title
- If found, change `title="Practice Series"` to `title="Practice Flows"`
- Update any `alt` text from "Practice Series" to "Practice Flows"

### 3.2 Autocomplete Search Component

- Locate the `Autocomplete` component (around line 515-675)
- Change `loadingText="Loading series..."` to `loadingText="Loading flows..."`
- Change `noOptionsText` from `'No series found'` to `'No flows found'`
- In the `renderInput` prop, change `placeholder="Search for a Series"` to `placeholder="Search for a Flow"`

### 3.3 Edit Button Accessibility

- Locate the `IconButton` with `aria-label="Edit series"` (around line 713)
- Change `aria-label="Edit series"` to `aria-label="Edit flow"`

### 3.4 Drawer Text

- Locate the `Drawer` component at the bottom of the file (around line 823)
- Change the `Typography` text from `"Pick a Series to practice."` to `"Pick a Flow to practice."`

---

## 4. Create Series Page Text Changes

Update the create series page at `app/navigator/flows/createSeries/page.tsx`.

### 4.1 Splash Header

- Locate the `SplashHeader` component (around line 263-266)
- Change `alt={'Create Series'}` to `alt={'Create Flow'}`
- Change `title="Create Series"` to `title="Create Flow"`

### 4.2 Autocomplete Placeholder

- Locate the `AutocompleteComponent` (around line 275-295)
- Change `placeholder="Add a pose to your series"` to `placeholder="Add a pose to your flow"`

### 4.3 Series Name Field

- Locate the `TextField` for series name (around line 312)
- Change `placeholder="Give your Series a name..."` to `placeholder="Give your Flow a name..."`

---

## 5. Edit Series Dialog Text Changes

Update the edit series dialog at `app/navigator/flows/editSeries/EditSeriesDialog.tsx`.

### 5.1 Unauthorized Message

- Locate the unauthorized access messages (around lines 68-89)
- Change `"You do not have permission to edit this series."` to `"You do not have permission to edit this flow."`
- This appears in both inline and modal variants

---

## 6. Series Editor Form Text Changes

Update the series editor form at `app/navigator/flows/editSeries/SeriesEditorForm.tsx`.

### 6.1 Form Title

- Locate the `Typography` with the form title (around line 113-115)
- Change `'Create Series'` to `'Create Flow'`
- Change `'Edit Series'` to `'Edit Flow'`

### 6.2 Form Aria Label

- Locate the `<form>` element (around line 118)
- Change `aria-label="Series Form"` to `aria-label="Flow Form"`

### 6.3 Form Field Label

- Locate the series name `TextField` (around line 126-133)
- Change `label="Series Name *"` to `label="Flow Name *"`

---

## 7. Weekly Activity Viewer Text Changes

Update the weekly activity viewer at `app/clientComponents/WeeklyActivityViewer.tsx`.

### 7.1 Entity Type Label Function

- Locate the `getEntityTypeLabel` function (around line 160-170)
- Change the `'series'` case to return `'Flow'` instead of `'Series'`

### 7.2 Activity List Label Function

- Locate the `getActivityListLabel` function (around line 186-196)
- Change the `'series'` case to return `'All Flow Practice This Week'` instead of `'All Series Practice This Week'`

---

## 8. Profile Library Page Text Changes

Update the profile library page at `app/navigator/profile/library/page.tsx`.

### 8.1 Tab Label

- Locate the `Tab` component for series (around line 239)
- Change `label={\`Series (\${series.length})\`}`to`label={\`Flows (\${series.length})\`}`

### 8.2 Error Message

- Locate the error message for loading series (around line 131)
- Change `'Failed to load your series'` to `'Failed to load your flows'`

---

## 9. Freemium Notification Text Changes

Update the freemium notification at `app/clientComponents/freemiumNotification/FreemiumNotification.tsx`.

### 9.1 Feature Description

- Locate the feature descriptions object (around line 46)
- Change `createSeries: 'custom series'` to `createSeries: 'custom flows'`

---

## 10. Notification Service Text Changes

Update the notification service at `app/lib/notificationService.ts`.

### 10.1 Milestone Message

- Locate the series milestone message (around line 719)
- Change the fallback text from `'series'` to `'flow'` in the template literal
- The line should change from `\`First \${firstSeries.seriesName || 'series'} completed\``to`\`First \${firstSeries.seriesName || 'flow'} completed\``

---

## 11. Unit Test Assertion Updates

Update test files to reflect the new display text. **Only change string assertions, not test structure or describe blocks.**

### 11.1 Header Test

- In `__test__/components/header.spec.tsx` (around line 210)
- Change `expect(screen.getByText('Series')).toBeInTheDocument()` to `expect(screen.getByText('Flows')).toBeInTheDocument()`

### 11.2 Practice Series Page Tests

- In `__test__/app/navigator/flows/practiceSeries/page.spec.tsx`
- Update assertions checking for "Practice Series" text to "Practice Flows"
- Update assertions checking for "Search for a Series" to "Search for a Flow"
- Update any assertions checking for "Loading series..." to "Loading flows..."
- Update any assertions checking for "No series found" to "No flows found"

### 11.3 Tab Header Test

- In `__test__/app/clientComponents/tab-header.spec.tsx` (around line 153)
- Change assertion from `'Series'` to `'Flows'` if applicable

### 11.4 Freemium Notification Tests

- In `__test__/app/clientComponents/freemiumNotification/FreemiumNotification.spec.tsx`
- Update any assertions checking for `'custom series'` to `'custom flows'`

### 11.5 Weekly Activity Viewer Tests (if applicable)

- In `__test__/app/clientComponents/WeeklyActivityViewer.spec.tsx`
- Update any assertions checking for `'Series'` label to `'Flow'`

---

## 12. Verification and Final Testing

### 12.1 Run Unit Tests

- Execute `npm run test` to verify all tests pass after changes
- Pay special attention to tests that may have implicit "Series" text assertions

### 12.2 Manual UI Verification

- Navigate through the app to verify all visible "series" text now shows "flow":
  - [ ] Header navigation menu
  - [ ] Landing page navigation buttons
  - [ ] Flows main page buttons and descriptions
  - [ ] Practice flows page (search, loading states, drawer)
  - [ ] Create flow page (title, placeholders)
  - [ ] Edit flow dialog (title, form labels)
  - [ ] Profile library tabs
  - [ ] Weekly activity viewer labels

### 12.3 Accessibility Verification

- Use screen reader or browser dev tools to verify:
  - [ ] `aria-label` attributes use "flow" terminology
  - [ ] Alt text uses "flow" terminology
  - [ ] Form labels are updated correctly

---

## Summary Checklist

| Task      | File                                                                 | Status |
| --------- | -------------------------------------------------------------------- | ------ |
| 1.1       | `components/header.tsx`                                              | ⬜     |
| 1.2       | `app/clientComponents/landing-page.tsx`                              | ✅     |
| 2.1       | `app/navigator/flows/page.tsx`                                       | ✅     |
| 2.2       | `app/navigator/flows/page.tsx`                                       | ✅     |
| 3.1-3.4   | `app/navigator/flows/practiceSeries/page.tsx`                        | ✅     |
| 4.1-4.3   | `app/navigator/flows/createSeries/page.tsx`                          | ✅     |
| 5.1       | `app/navigator/flows/editSeries/EditSeriesDialog.tsx`                | ✅     |
| 6.1-6.3   | `app/navigator/flows/editSeries/SeriesEditorForm.tsx`                | ✅     |
| 7.1-7.2   | `app/clientComponents/WeeklyActivityViewer.tsx`                      | ✅     |
| 8.1-8.2   | `app/navigator/profile/library/page.tsx`                             | ✅     |
| 9.1       | `app/clientComponents/freemiumNotification/FreemiumNotification.tsx` | ✅     |
| 10.1      | `app/lib/notificationService.ts`                                     | ✅     |
| 10.2      | `app/navigator/profile/dashboard/page.tsx` (additional)              | ✅     |
| 11.1-11.5 | Test files                                                           | ✅     |
| 12.1-12.3 | Verification                                                         | ✅     |

---

## Important Reminders

⚠️ **DO NOT CHANGE:**

- Function names (e.g., `getAllSeries`, `fetchUserSeries`)
- Variable names (e.g., `series`, `seriesData`)
- File names or directory names
- URL paths (e.g., `/navigator/flows/practiceSeries`)
- API routes (e.g., `/api/series`)
- TypeScript interface/type names
- Context names (e.g., `AsanaSeriesContext`)
- Database/Prisma model names

✅ **ONLY CHANGE:**

- User-visible display text strings
- Placeholder text
- Button labels and descriptions
- Error messages shown to users
- Accessibility labels (aria-label, alt text)
- Test assertions that verify display text
