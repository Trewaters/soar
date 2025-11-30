# PRD: Bottom Navigation Improvement

## Overview

Improve the bottom navigation user experience by replacing the confusing hamburger menu icon with a more intuitive back button that provides users with a clear way to navigate back to the previous page they were viewing.

## Problem Statement

The current bottom navigation uses a hamburger icon as the third navigation item, which creates user confusion because users expect hamburger icons to open side navigation menus. In the current implementation, this hamburger icon navigates to a `subRoute` rather than opening a menu, creating a mismatch between user expectations and actual functionality. Users need a clear and intuitive way to navigate backward in their yoga practice journey.

## Target Users

- **Primary**: Authenticated yoga practitioners navigating through different sections of the Soar app
- **Secondary**: Guest users exploring public yoga content
- **Tertiary**: Mobile users who rely heavily on touch navigation during yoga sessions

## Scope

### In-Scope

- Replace the hamburger menu icon (`MenuIcon`) with a back button icon (`ArrowBackIcon`)
- Implement back navigation functionality that takes users to their previously viewed page
- Update the icon's aria-label and accessibility attributes to reflect the new back button functionality
- Maintain existing responsive design and mobile-first approach
- Preserve authentication-aware styling and behavior
- Update unit tests to reflect the new back button functionality
- Ensure the back button works with the existing `useNavigationWithLoading` hook

### Out-of-Scope

- Creating a new side navigation menu to replace hamburger functionality
- Modifying the home icon or profile icon in the bottom navigation
- Changing the overall layout or styling of the bottom navigation bar
- Adding additional navigation items to the bottom bar
- Implementing forward navigation functionality
- Creating a navigation history management system beyond basic back functionality

## Functional Requirements

### Core Functionality

1. **Icon Replacement**: Replace `MenuIcon` with `ArrowBackIcon` from Material-UI icons
2. **Back Navigation Logic**: Implement browser-based back navigation using the router's back() method
3. **Accessibility Updates**: Update aria-label from "Open navigation menu" to "Navigate back to previous page"
4. **Visual Consistency**: Maintain the same color scheme and styling as the current menu icon
5. **Loading State Integration**: Ensure back navigation works with the existing navigation loading context

### User Interface Requirements

- Back button icon should use the same color scheme as the current menu icon (`primary.contrastText`)
- Icon should maintain the same size and positioning as the current hamburger icon
- Touch target should remain 48px minimum for mobile accessibility
- Icon should display appropriate hover and focus states
- Loading state should be consistent with other navigation elements

### Integration Requirements

- Integrate with existing `useNavigationWithLoading` hook for consistent loading feedback
- Maintain compatibility with NextAuth.js session management
- Work within the existing MUI theme and styling system
- Preserve the current responsive design for mobile and desktop views
- Maintain compatibility with the existing `NavBottom` component props interface

## User Stories

### Primary User Stories

**As a** yoga practitioner navigating through the Soar app
**I want** to easily go back to the previous page I was viewing
**So that** I can maintain my flow while exploring different yoga content and return to where I left off

**Acceptance Criteria:**

- [ ] The bottom navigation displays a back arrow icon instead of a hamburger menu icon
- [ ] Clicking the back button takes me to the previously viewed page in my browser history
- [ ] The back button provides immediate visual feedback when tapped (loading state)
- [ ] The back button has clear accessibility labels for screen readers
- [ ] The back button maintains the same visual styling as the previous menu icon
- [ ] The back button works consistently across all pages that display the bottom navigation

### Secondary User Stories

**As a** mobile user practicing yoga
**I want** intuitive navigation controls that match my expectations
**So that** I can focus on my practice without confusion about navigation elements

**Acceptance Criteria:**

- [ ] The back button icon clearly indicates backward navigation functionality
- [ ] The touch target is appropriately sized for mobile interaction
- [ ] The button provides haptic feedback consistent with other navigation elements
- [ ] The button works reliably during yoga session flows

**As a** screen reader user
**I want** clear audio descriptions of navigation elements
**So that** I can navigate the app effectively during my yoga practice

**Acceptance Criteria:**

- [ ] The back button has an appropriate aria-label that describes its function
- [ ] Screen readers announce the button's purpose clearly
- [ ] The button maintains proper focus management
- [ ] The button integrates properly with assistive technology

## Technical Requirements

### Frontend Requirements

- Update `NavBottom` component in `components/navBottom.tsx`
- Replace `MenuIcon` import with `ArrowBackIcon` from `@mui/icons-material`
- Modify the menu navigation item configuration to use back navigation
- Update aria-label from "Open navigation menu" to "Navigate back to previous page"
- Integrate with `router.back()` method from `useNavigationWithLoading` hook

### Backend Requirements

- No backend changes required for this feature
- Existing API endpoints and data layer remain unchanged

### Data Requirements

- No new data models or database changes required
- Navigation history managed by browser's built-in history API
- Existing session and authentication data flow unchanged

## Success Criteria

### User Experience Metrics

- Users can successfully navigate backward using the bottom navigation back button
- Navigation confusion incidents related to hamburger menu expectations are eliminated
- User flow completion rates improve due to clearer navigation options
- Mobile navigation satisfaction increases during yoga practice sessions

### Technical Metrics

- Back navigation functionality works on 100% of supported browsers
- Loading state feedback appears within 100ms of button interaction
- No accessibility violations introduced by the navigation change
- Existing unit test coverage maintains 90%+ after updates

## Dependencies

### Internal Dependencies

- `useNavigationWithLoading` hook for consistent navigation behavior
- MUI theme system for consistent icon styling
- NextAuth.js session management for authentication-aware features
- Existing `NavBottom` component architecture

### External Dependencies

- Material-UI `ArrowBackIcon` component
- Next.js router back() navigation method
- Browser history API support

## Risks and Considerations

### Technical Risks

- Browser back navigation may not work as expected if users land directly on a page
- Back navigation could interfere with yoga sequence flows where forward progression is important
- Navigation loading states need to handle back navigation appropriately

### User Experience Risks

- Users may expect back navigation to work within yoga sequences rather than page navigation
- Some users may be accustomed to the current hamburger menu behavior
- Back button may be disabled on pages where no previous history exists

### Mitigation Strategies

- Implement graceful handling when no browser history is available
- Maintain clear visual feedback for all navigation states
- Consider user education through onboarding or tooltips if needed

## Implementation Notes

### File Structure Impact

- **Modified files**: `components/navBottom.tsx`
- **Modified test files**: `__test__/components/navBottom.spec.tsx`
- **No new files required**

### Navigation Integration

The back button should integrate with the existing navigation patterns:

```typescript
// Updated navigation item configuration
{
  id: 'back',
  label: 'Navigate back to previous page',
  icon: <ArrowBackIcon />,
  path: 'back', // Special identifier for back navigation
  getColor: (_isAuthenticated: boolean) => 'primary.contrastText',
}
```

### Testing Strategy

- **Unit Testing**: Update existing NavBottom component tests to verify back button functionality
- **Integration Testing**: Test back navigation flow across different page combinations
- **Accessibility Testing**: Verify screen reader compatibility and ARIA compliance
- **Mobile Testing**: Ensure touch targets and responsive behavior work correctly

### Accessibility Considerations

- Update aria-label to clearly describe back navigation functionality
- Ensure proper focus management when navigating backward
- Maintain keyboard navigation support
- Test with screen readers to verify clear audio descriptions

## Future Considerations

- **Navigation History Management**: Consider implementing a more sophisticated navigation history system for yoga-specific flows
- **Contextual Navigation**: Explore context-aware back navigation that understands yoga practice sequences
- **Navigation Analytics**: Track back navigation usage patterns to optimize user flows
- **Gesture Support**: Consider adding swipe gestures for back navigation on mobile devices

## Quality Checklist

- [ ] Back button icon clearly indicates backward navigation function
- [ ] Navigation integrates properly with existing `useNavigationWithLoading` hook
- [ ] Accessibility attributes are updated to reflect new functionality
- [ ] Visual styling maintains consistency with existing design system
- [ ] Mobile touch targets meet accessibility guidelines
- [ ] Unit tests cover new back navigation functionality
- [ ] Browser compatibility verified across supported platforms
- [ ] Loading states provide appropriate user feedback
- [ ] No regressions in existing navigation features
