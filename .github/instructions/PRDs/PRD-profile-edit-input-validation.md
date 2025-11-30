# PRD: Profile Edit Input Validation & Security

## Overview

Implement comprehensive input validation, sanitization, and security measures for the user profile edit form in the Soar yoga application. This enhancement will protect against malicious input, improve user experience with real-time validation feedback, and ensure data integrity across the client and server layers.

## Problem Statement

The current profile edit view (`editUserDetails.tsx`) lacks proper input validation and sanitization, creating multiple issues:

1. **Security vulnerabilities**: User input is stored directly in the database without sanitization, creating potential XSS attack vectors
2. **Poor user experience**: No real-time validation feedback when users enter invalid data
3. **Data integrity issues**: No enforcement of field constraints (length limits, format requirements)
4. **Inconsistent error handling**: Error states are overloaded for both success and failure messages
5. **Missing server-side validation**: The API endpoint accepts and stores any data without validation

These issues affect yoga practitioners who may inadvertently enter invalid data or malicious actors who could exploit the lack of input validation.

## Target Users

- **Yoga Practitioners**: Users editing their profile information (name, bio, website, location, yoga preferences)
- **Yoga Instructors**: Users with extended profile information who share their profiles publicly
- **System Administrators**: Users who need assurance that stored data is safe and consistent

## Scope

### In-Scope

- Client-side input validation with real-time feedback for `editUserDetails.tsx`
- Server-side validation for the `updateUserData` API endpoint
- Input sanitization to prevent XSS and injection attacks
- Field-level error states and helper text on form fields
- URL format validation for `websiteURL` field
- Character length constraints for text fields
- Whitespace trimming before submission
- Separate success and error message handling
- Consistent change handler implementation across all fields
- Validation schema using Zod library

### Out-of-Scope

- Rate limiting implementation (separate security feature)
- CAPTCHA or bot protection
- Two-factor authentication for profile changes
- Email verification for profile updates
- Profile image validation (handled separately by ProfileImageManager)
- Location validation beyond basic sanitization (LocationPicker handles this)
- Changes to the Prisma schema or database structure
- Internationalization of validation error messages

## Functional Requirements

### Core Functionality

1. **Client-Side Validation Schema**

   - Create a Zod validation schema for all profile form fields
   - Define field constraints: required fields, max lengths, format patterns
   - Provide clear, yoga-friendly error messages

2. **Real-Time Field Validation**

   - Validate fields on blur (when user leaves the field)
   - Display inline error messages below invalid fields
   - Show visual error state (red border) on invalid fields
   - Clear error state when user corrects the input

3. **Form Submission Validation**

   - Validate entire form before API submission
   - Prevent submission if validation fails
   - Show summary of validation errors if multiple fields fail
   - Sanitize all text inputs (trim whitespace, escape HTML entities)

4. **Server-Side Validation**

   - Validate all incoming data in the API endpoint
   - Return structured error responses with field-specific messages
   - Sanitize data before database storage
   - Reject requests with invalid data formats

5. **URL Validation**

   - Validate `websiteURL` field for proper URL format
   - Accept URLs with or without protocol (auto-prefix https://)
   - Reject malicious URL patterns (javascript:, data:, etc.)

6. **Improved Error/Success Messaging**

   - Separate error and success message states
   - Use appropriate visual styling (red for errors, green for success)
   - Auto-dismiss success messages after 5 seconds
   - Persist error messages until user action

7. **Save Button State Management**

   - Disable save button immediately when clicked to prevent double-submission
   - Show loading spinner (CircularProgress) on button during API request
   - Keep button disabled while `loading` state is true
   - Disable save button when validation errors are present in `fieldErrors` state
   - On successful save: call `onSaveSuccess` callback to transition to read-only view
   - On failed save: re-enable button and display error message

8. **Post-Save View Transition**
   - After successful API response, trigger `onSaveSuccess` callback prop
   - Parent component (`ClientWrapper` in `page.tsx`) handles switching from `EditUserDetails` to `UserDetails`
   - User sees their updated profile in read-only display mode
   - Edit button remains available for future edits
   - Auto-dismiss success messages after 5 seconds
   - Persist error messages until user action

### User Interface Requirements

- **Field-Level Error Display**: Use MUI TextField's `error` and `helperText` props for inline validation feedback
- **Error Message Styling**: Red text (#f44336) for errors, consistent with MUI error palette
- **Success Message Styling**: Green snackbar or alert for successful save operations
- **Save Button States**:
  - **Default**: Enabled with "Save Changes" text and SaveIcon
  - **Validation Errors Present**: Disabled with visual indication (grayed out)
  - **Submitting**: Disabled with CircularProgress spinner replacing text
  - **Success**: Triggers `onSaveSuccess` callback to transition to read-only view
- **Post-Save Transition**: After successful save, automatically switch from `EditUserDetails` to `UserDetails` (read-only view)
- **Accessibility**: Error messages must be announced to screen readers using `aria-live` regions

### Integration Requirements

- **TextInputField Component**: Extend to support `error` and `helperText` props pass-through
- **UserContext**: No changes required, validation happens before context update
- **API Endpoint**: Update `/api/user/updateUserData` to include validation middleware
- **Prisma Client**: No schema changes, validation happens before Prisma operations

## User Stories

### Primary User Stories

**US-1: Real-Time Validation Feedback**

**As a** yoga practitioner editing my profile
**I want** to see immediate feedback when I enter invalid data
**So that** I can correct errors before attempting to save

**Acceptance Criteria:**

- [ ] When I leave a required field empty and blur, I see an error message
- [ ] When I enter a URL in invalid format, I see a specific URL format error
- [ ] When I exceed character limits, I see how many characters over the limit I am
- [ ] Error messages are clear and tell me how to fix the issue
- [ ] Error styling (red border) is visible and accessible

**US-2: Successful Form Submission with View Mode Transition**

**As a** yoga practitioner saving my profile changes
**I want** to see clear confirmation that my changes were saved and then view my updated profile
**So that** I have confidence my profile is updated and can review the changes

**Acceptance Criteria:**

- [ ] When I click "Save Changes", the button is immediately disabled to prevent double-submission
- [ ] A loading spinner appears on the save button while the save is in progress
- [ ] When save completes successfully, the view automatically transitions to the read-only profile view (UserDetails)
- [ ] The read-only profile view displays my newly saved data
- [ ] A success message/toast is briefly shown to confirm the save was successful
- [ ] If save fails, the form remains in edit mode with error message displayed
- [ ] The user can click the edit button again to return to edit mode if needed

**US-3: Protected Against Invalid Data**

**As a** yoga practitioner
**I want** the system to prevent me from saving invalid or malicious data
**So that** my profile remains safe and displays correctly

**Acceptance Criteria:**

- [ ] Leading/trailing whitespace is automatically trimmed from inputs
- [ ] HTML tags in text fields are escaped or removed
- [ ] Invalid URLs are rejected with helpful error messages
- [ ] The save button is disabled while validation errors exist

### Secondary User Stories

**US-4: Server-Side Protection**

**As a** system administrator
**I want** the server to validate all incoming profile data
**So that** the database is protected even if client-side validation is bypassed

**Acceptance Criteria:**

- [ ] API returns 400 status with validation errors for invalid data
- [ ] Error response includes field-specific error messages
- [ ] Server sanitizes all text inputs before storage
- [ ] Malicious URL patterns are rejected server-side

## Technical Requirements

### Frontend Requirements

#### New Validation Utility (`app/utils/validation/profileValidation.ts`)

```typescript
// Zod schema for profile form validation
import { z } from 'zod'

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .transform((val) => val.trim()),
  pronouns: z
    .string()
    .max(30, 'Pronouns must be 30 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  headline: z
    .string()
    .max(200, 'Headline must be 200 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  bio: z
    .string()
    .max(2000, 'Bio must be 2000 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  websiteURL: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(200, 'Location must be 200 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  shareQuick: z
    .string()
    .max(280, 'Quick share must be 280 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  yogaStyle: z
    .string()
    .max(100, 'Yoga style must be 100 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  yogaExperience: z
    .string()
    .max(100, 'Yoga experience must be 100 characters or less')
    .optional()
    .transform((val) => val?.trim()),
  company: z
    .string()
    .max(100, 'Company must be 100 characters or less')
    .optional()
    .transform((val) => val?.trim()),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
```

#### Sanitization Utility (`app/utils/validation/sanitize.ts`)

```typescript
// Text sanitization functions
export function sanitizeText(input: string): string
export function sanitizeURL(input: string): string
export function escapeHtml(input: string): string
```

#### TextInputField Enhancement

- Add support for `error` and `helperText` props pass-through
- Add optional `maxLength` prop with character counter display
- Maintain existing mobile optimization features

#### Form State Management

- Add `fieldErrors` state object to track per-field validation errors
- Add `successMessage` state separate from `error` state
- Add `validateField` function for on-blur validation
- Add `validateForm` function for pre-submission validation

### Backend Requirements

#### API Validation (`app/api/user/updateUserData/route.ts`)

- Import and use the same Zod schema from shared location
- Return structured validation errors in response
- Sanitize all text fields before Prisma update
- Return appropriate HTTP status codes (400 for validation errors)

#### Error Response Format

```typescript
interface ValidationErrorResponse {
  success: false
  errors: {
    field: string
    message: string
  }[]
}

interface SuccessResponse {
  success: true
  message: string
  data: UserData
}
```

### Data Requirements

#### Field Constraints

| Field          | Required | Max Length | Format | Notes                          |
| -------------- | -------- | ---------- | ------ | ------------------------------ |
| firstName      | Yes      | 50         | Text   | Trimmed                        |
| lastName       | Yes      | 50         | Text   | Trimmed                        |
| pronouns       | No       | 30         | Text   | Trimmed                        |
| headline       | No       | 200        | Text   | Trimmed                        |
| bio            | No       | 2000       | Text   | Trimmed, multiline             |
| websiteURL     | No       | 500        | URL    | Must be valid URL format       |
| location       | No       | 200        | Text   | Trimmed                        |
| shareQuick     | No       | 280        | Text   | Trimmed, like Twitter post     |
| yogaStyle      | No       | 100        | Text   | From predefined list or custom |
| yogaExperience | No       | 100        | Text   | Trimmed                        |
| company        | No       | 100        | Text   | Trimmed                        |

#### Sanitization Rules

- Trim leading/trailing whitespace from all text fields
- Remove or escape HTML tags from text fields
- Reject URLs with dangerous protocols (javascript:, data:, vbscript:)
- Normalize URL format (ensure https:// prefix if missing)

## Success Criteria

### User Experience Metrics

- Users see validation feedback within 100ms of field blur
- 100% of validation errors include actionable correction guidance
- Success messages are clearly distinguishable from error messages
- Form remains accessible with screen readers during validation states

### Technical Metrics

- All form fields have corresponding validation rules
- Server-side validation covers 100% of client-side rules
- Unit test coverage > 90% for validation utilities
- Integration test coverage for API validation endpoints
- No unhandled validation edge cases in error logs

## Dependencies

### Internal Dependencies

- `TextInputField` component (`app/clientComponents/inputComponents/TextInputField.tsx`)
- `editUserDetails` component (`app/navigator/profile/editUserDetails.tsx`)
- `updateUserData` API route (`app/api/user/updateUserData/route.ts`)
- UserContext (`app/context/UserContext.tsx`)
- MUI theme (`app/styles/theme.ts`)

### External Dependencies

- **Zod** (^3.22.0): Schema validation library - needs to be added to package.json
- **DOMPurify** (^3.0.0): HTML sanitization library - optional, for advanced XSS protection

## Risks and Considerations

### Technical Risks

| Risk                               | Impact | Mitigation                                          |
| ---------------------------------- | ------ | --------------------------------------------------- |
| Bundle size increase from Zod      | Medium | Zod is tree-shakeable, only import needed functions |
| Performance impact from validation | Low    | Debounce validation, use memoization                |
| Breaking existing form behavior    | High   | Comprehensive testing, feature flag for rollout     |
| Validation mismatch client/server  | Medium | Share Zod schema between frontend and API           |

### User Experience Risks

| Risk                                         | Impact | Mitigation                                                   |
| -------------------------------------------- | ------ | ------------------------------------------------------------ |
| Over-aggressive validation frustrating users | Medium | Allow flexible input formats, validate on blur not keystroke |
| Error messages unclear                       | Medium | User test error message copy                                 |
| Character limits too restrictive             | Low    | Research typical yoga bio lengths                            |

### Security Considerations

- Server-side validation is the security boundary; client-side is for UX only
- Sanitization must prevent stored XSS attacks
- URL validation must block dangerous protocols
- Consider Content Security Policy headers for additional protection

## Implementation Notes

### File Structure Impact

#### New Files to Create

```
app/utils/validation/
├── profileValidation.ts      # Zod schemas for profile form
├── sanitize.ts               # Text sanitization utilities
├── urlValidation.ts          # URL format validation
└── index.ts                  # Barrel export

__test__/app/utils/validation/
├── profileValidation.spec.ts # Schema validation tests
├── sanitize.spec.ts          # Sanitization tests
└── urlValidation.spec.ts     # URL validation tests
```

#### Files to Modify

```
app/navigator/profile/editUserDetails.tsx    # Add validation integration
app/clientComponents/inputComponents/TextInputField.tsx  # Add error/helperText support
app/api/user/updateUserData/route.ts         # Add server validation
package.json                                  # Add Zod dependency
```

### Testing Strategy

#### Unit Tests

- Test all Zod schema validation rules with valid and invalid inputs
- Test sanitization functions with malicious input patterns
- Test URL validation with various URL formats
- Test field-level error state management

#### Integration Tests

- Test form submission with invalid data (should fail)
- Test form submission with valid data (should succeed)
- Test API response format for validation errors
- Test error message display in UI

#### User Acceptance Testing

- Verify error messages are helpful and actionable
- Verify success messages appear and dismiss correctly
- Verify mobile keyboard behavior is not affected
- Verify screen reader announces validation errors

## Future Considerations

- **Password field validation**: If password change is added to profile
- **Email validation**: If email change is permitted in future
- **Real-time availability checking**: Username/email uniqueness validation
- **Progressive validation**: Show validation status as user types (with debounce)
- **Validation analytics**: Track common validation errors to improve UX
- **Internationalization**: Translate validation messages for global yoga community
