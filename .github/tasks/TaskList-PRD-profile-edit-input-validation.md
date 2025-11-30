# Engineering Task Breakdown: Profile Edit Input Validation & Security

This task list breaks down the PRD for implementing comprehensive input validation, sanitization, and security measures for the user profile edit form. Tasks are organized in logical implementation order: dependencies first, then utilities, UI integration, API updates, and finally testing.

---

## Prerequisites

Before starting, ensure you have:

- Access to the Soar yoga application codebase
- Understanding of Zod validation library basics
- Familiarity with MUI TextField component props (`error`, `helperText`)
- Understanding of the existing `editUserDetails.tsx` component structure

---

### 1. Project Setup & Dependencies

_Install required packages and set up the validation utilities directory structure._

- [ ] **1.1** Add Zod to project dependencies by running `npm install zod` and verify it's added to `package.json`

- [ ] **1.2** Create the validation utilities directory structure:

  ```
  app/utils/validation/
  ├── profileValidation.ts
  ├── sanitize.ts
  ├── urlValidation.ts
  └── index.ts
  ```

- [ ] **1.3** Create a barrel export file at `app/utils/validation/index.ts` that exports all validation utilities

---

### 2. Create Validation Schema (`profileValidation.ts`)

_Implement the Zod validation schema for all profile form fields._

- [ ] **2.1** Create `app/utils/validation/profileValidation.ts` with the Zod schema `profileFormSchema` containing:

  - `firstName`: required, max 50 chars, trimmed
  - `lastName`: required, max 50 chars, trimmed
  - `pronouns`: optional, max 30 chars, trimmed
  - `headline`: optional, max 200 chars, trimmed
  - `bio`: optional, max 2000 chars, trimmed
  - `websiteURL`: optional, must be valid URL format or empty string
  - `location`: optional, max 200 chars, trimmed
  - `shareQuick`: optional, max 280 chars, trimmed
  - `yogaStyle`: optional, max 100 chars, trimmed
  - `yogaExperience`: optional, max 100 chars, trimmed
  - `company`: optional, max 100 chars, trimmed

- [ ] **2.2** Export the TypeScript type `ProfileFormData` inferred from the Zod schema using `z.infer<typeof profileFormSchema>`

- [ ] **2.3** Create a helper function `validateField(fieldName: string, value: string)` that validates a single field and returns an error message or `null`

- [ ] **2.4** Create a helper function `validateForm(formData: Record<string, string>)` that validates the entire form and returns an object with field-specific errors

- [ ] **2.5** Export constants for field max lengths (e.g., `FIELD_LIMITS = { firstName: 50, lastName: 50, bio: 2000, ... }`) for use in character counters

---

### 3. Create Sanitization Utilities (`sanitize.ts`)

_Implement text sanitization functions to prevent XSS and ensure data cleanliness._

- [ ] **3.1** Create `app/utils/validation/sanitize.ts` with the following functions:

- [ ] **3.2** Implement `sanitizeText(input: string): string` that:

  - Trims leading/trailing whitespace
  - Removes or escapes HTML tags (`<script>`, `<img>`, etc.)
  - Handles `null`/`undefined` inputs gracefully (return empty string)

- [ ] **3.3** Implement `escapeHtml(input: string): string` that escapes HTML special characters:

  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#039;`

- [ ] **3.4** Implement `sanitizeFormData(formData: Record<string, string>): Record<string, string>` that applies `sanitizeText` to all string fields in an object

---

### 4. Create URL Validation Utilities (`urlValidation.ts`)

_Implement URL-specific validation and sanitization._

- [ ] **4.1** Create `app/utils/validation/urlValidation.ts` with the following functions:

- [ ] **4.2** Implement `isValidUrl(url: string): boolean` that:

  - Returns `true` for valid http/https URLs
  - Returns `false` for empty strings (they're optional)
  - Returns `false` for malicious protocols (`javascript:`, `data:`, `vbscript:`)

- [ ] **4.3** Implement `sanitizeUrl(url: string): string` that:

  - Trims whitespace
  - Auto-prefixes `https://` if no protocol is present and URL looks valid
  - Returns empty string for invalid/dangerous URLs

- [ ] **4.4** Implement `normalizeUrl(url: string): string` that ensures consistent URL format for storage

- [ ] **4.5** Create a list of blocked URL protocols as a constant: `BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']`

---

### 5. Enhance TextInputField Component

_Add error and helperText prop support to the existing TextInputField component._

- [ ] **5.1** Open `app/clientComponents/inputComponents/TextInputField.tsx` and update the `TextInputFieldProps` interface to include:

  - `error?: boolean` - MUI error state
  - `helperText?: string` - Error message or helper text
  - `maxLength?: number` - Optional character limit
  - `showCharacterCount?: boolean` - Whether to display character counter

- [ ] **5.2** Pass the `error` prop through to the underlying MUI `TextField` component

- [ ] **5.3** Implement `helperText` display logic:

  - If `error` is true and `helperText` is provided, show error message in red
  - If `showCharacterCount` is true and `maxLength` is set, show character count (e.g., "45/200")
  - Combine character count with error message if both are needed

- [ ] **5.4** Add `aria-invalid={error}` attribute to the input for accessibility

- [ ] **5.5** Add `aria-describedby` linking to the helper text for screen reader support

---

### 6. Update editUserDetails.tsx - State Management

_Add validation state management to the profile edit form._

- [ ] **6.1** Open `app/navigator/profile/editUserDetails.tsx` and add new state variables:

  ```typescript
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {}
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  ```

- [ ] **6.2** Import the validation utilities:

  ```typescript
  import {
    validateField,
    validateForm,
    FIELD_LIMITS,
  } from '@/app/utils/validation'
  import { sanitizeFormData } from '@/app/utils/validation/sanitize'
  ```

- [ ] **6.3** Create a `hasValidationErrors` computed value that checks if any field in `fieldErrors` has an error message

- [ ] **6.4** Separate the existing `error` state into two distinct states:
  - Keep `error` for API/submission errors
  - Use new `successMessage` for success feedback

---

### 7. Update editUserDetails.tsx - Field Validation

_Implement real-time field validation on blur._

- [ ] **7.1** Create a `handleFieldBlur` function that:

  - Takes the field name and current value
  - Calls `validateField(fieldName, value)` from the validation utility
  - Updates `fieldErrors` state with the result
  - Clears the error if validation passes

- [ ] **7.2** Update all `TextInputField` components to include:

  - `onBlur` handler calling `handleFieldBlur`
  - `error={!!fieldErrors[fieldName]}`
  - `helperText={fieldErrors[fieldName] || ''}`
  - `maxLength={FIELD_LIMITS[fieldName]}` where applicable

- [ ] **7.3** Update the `firstName` field (currently uses inline handler) to use the consistent `handleChange` pattern like other fields

- [ ] **7.4** Add validation to the `Autocomplete` component for `yogaStyle` field on blur

- [ ] **7.5** Clear field error when user starts typing in that field (update `handleChange` to clear the specific field's error)

---

### 8. Update editUserDetails.tsx - Form Submission

_Update the form submission to include validation and proper state management._

- [ ] **8.1** Update the `handleSubmit` function to:

  - First, validate all fields using `validateForm(formData)`
  - If validation fails, update `fieldErrors` state and prevent submission
  - If validation passes, sanitize data using `sanitizeFormData(formData)`

- [ ] **8.2** Disable the save button when:

  - `loading` is true (already implemented)
  - `hasValidationErrors` is true (new condition)

- [ ] **8.3** Update the save button to show visual disabled state when validation errors exist:

  ```typescript
  disabled={loading || hasValidationErrors}
  ```

- [ ] **8.4** On successful save:

  - Set `successMessage` to "Profile saved successfully!"
  - Call `onSaveSuccess?.()` to trigger view transition to read-only mode
  - Clear any existing error messages

- [ ] **8.5** On failed save:

  - Set `error` state with the error message
  - Keep form in edit mode (do not call `onSaveSuccess`)
  - Re-enable the save button

- [ ] **8.6** Remove the hardcoded default value from the `headline` field:
  ```typescript
  // Change from:
  value={formData.headline || 'I am a Yoga instructor.'}
  // To:
  value={formData.headline}
  ```

---

### 9. Update editUserDetails.tsx - Success/Error Messaging

_Implement separated success and error message display._

- [ ] **9.1** Create a success message display component/section using MUI `Alert` or `Snackbar`:

  - Green background color consistent with theme (`theme.palette.success.main`)
  - Display `successMessage` when not null
  - Include a close button or auto-dismiss

- [ ] **9.2** Implement auto-dismiss for success messages:

  ```typescript
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])
  ```

- [ ] **9.3** Update the existing error display to only show API/submission errors (not validation errors, which are shown inline)

- [ ] **9.4** Add `aria-live="polite"` to success message container for screen reader announcement

- [ ] **9.5** Add `aria-live="assertive"` to error message container for immediate screen reader announcement

---

### 10. Update Server-Side API Validation

_Add validation to the updateUserData API endpoint._

- [ ] **10.1** Open `app/api/user/updateUserData/route.ts` and import the validation schema:

  ```typescript
  import { profileFormSchema } from '@/app/utils/validation/profileValidation'
  import { sanitizeFormData } from '@/app/utils/validation/sanitize'
  ```

- [ ] **10.2** Add validation at the start of the POST handler:

  - Parse request body
  - Validate using `profileFormSchema.safeParse()`
  - If validation fails, return 400 status with structured error response

- [ ] **10.3** Implement the validation error response format:

  ```typescript
  interface ValidationErrorResponse {
    success: false
    errors: { field: string; message: string }[]
  }
  ```

- [ ] **10.4** Sanitize all text fields before passing to Prisma:

  ```typescript
  const sanitizedData = sanitizeFormData(validatedData)
  ```

- [ ] **10.5** Update successful response to include `success: true`:

  ```typescript
  return Response.json({
    success: true,
    message: 'User Data saved',
    data: updatedUser,
  })
  ```

- [ ] **10.6** Add proper error handling for Prisma errors, returning appropriate status codes

---

### 11. Update editUserDetails.tsx - Handle API Validation Errors

_Handle server-side validation error responses in the frontend._

- [ ] **11.1** Update the `handleSubmit` function to handle the new API response format:

  - Check for `response.success === false`
  - If false, parse the `errors` array from response
  - Map server errors to `fieldErrors` state

- [ ] **11.2** Display server-side validation errors inline on the corresponding fields

- [ ] **11.3** Show a general error message if the server returns a non-field-specific error

---

### 12. Unit Tests - Validation Utilities

_Create comprehensive unit tests for all validation utilities._

- [ ] **12.1** Create `__test__/app/utils/validation/profileValidation.spec.ts`:

  - Test `profileFormSchema` with valid data
  - Test each field's required/optional status
  - Test max length constraints for each field
  - Test `firstName` and `lastName` are required
  - Test `websiteURL` accepts valid URLs and empty strings
  - Test `websiteURL` rejects invalid URL formats
  - Test trimming transformation works correctly

- [ ] **12.2** Create `__test__/app/utils/validation/sanitize.spec.ts`:

  - Test `sanitizeText` trims whitespace
  - Test `sanitizeText` removes/escapes HTML tags
  - Test `sanitizeText` handles null/undefined inputs
  - Test `escapeHtml` escapes all special characters
  - Test `sanitizeFormData` processes all fields in an object

- [ ] **12.3** Create `__test__/app/utils/validation/urlValidation.spec.ts`:
  - Test `isValidUrl` with valid http/https URLs
  - Test `isValidUrl` returns false for `javascript:` URLs
  - Test `isValidUrl` returns false for `data:` URLs
  - Test `sanitizeUrl` auto-prefixes https://
  - Test `sanitizeUrl` returns empty string for blocked protocols
  - Test edge cases: empty strings, whitespace-only, malformed URLs

---

### 13. Unit Tests - TextInputField Enhancement

_Test the enhanced TextInputField component._

- [ ] **13.1** Update or create `__test__/app/clientComponents/inputComponents/TextInputField.spec.tsx`:
  - Test component renders without errors
  - Test `error` prop applies error styling
  - Test `helperText` displays correctly
  - Test character counter displays when `showCharacterCount` and `maxLength` are set
  - Test `aria-invalid` attribute is set when `error` is true
  - Test accessibility attributes are properly linked

---

### 14. Unit Tests - editUserDetails Form Validation

_Test the form validation integration in editUserDetails._

- [ ] **14.1** Create or update `__test__/app/navigator/profile/editUserDetails.validation.spec.tsx`:

  - Test field validation triggers on blur
  - Test error messages display inline below fields
  - Test error clears when user corrects input
  - Test save button is disabled when validation errors exist
  - Test save button is disabled during loading state
  - Test form submission is prevented with validation errors

- [ ] **14.2** Test the save flow:
  - Test successful save calls `onSaveSuccess` callback
  - Test successful save transitions to read-only view
  - Test failed save keeps form in edit mode
  - Test failed save displays error message
  - Test success message appears and auto-dismisses after 5 seconds

---

### 15. Integration Tests - API Validation

_Test the API endpoint validation._

- [ ] **15.1** Create `__test__/api/user/updateUserData.validation.spec.ts`:
  - Test API returns 400 for missing required fields
  - Test API returns 400 for invalid URL format
  - Test API returns 400 for fields exceeding max length
  - Test API returns structured error response with field names
  - Test API returns 200 for valid data
  - Test API sanitizes data before storage
  - Test API rejects dangerous URL protocols

---

### 16. Accessibility Testing

_Verify accessibility requirements are met._

- [ ] **16.1** Test screen reader announces validation errors using `aria-live` regions

- [ ] **16.2** Test error messages are associated with fields via `aria-describedby`

- [ ] **16.3** Test keyboard navigation works correctly with validation states

- [ ] **16.4** Verify color contrast meets WCAG AA standards for error messages (red on white background)

---

### 17. Final Verification & Cleanup

_Final checks before considering the feature complete._

- [ ] **17.1** Run full test suite: `npm run test` and ensure all tests pass

- [ ] **17.2** Run linting: `npm run lint-fix` and fix any issues

- [ ] **17.3** Test manually on mobile device to ensure keyboard behavior is not affected

- [ ] **17.4** Test the complete user flow:

  1. Open profile edit view
  2. Enter invalid data in various fields
  3. Verify inline errors appear on blur
  4. Correct the errors
  5. Submit valid data
  6. Verify transition to read-only view
  7. Verify saved data displays correctly

- [ ] **17.5** Remove any `console.log` statements added during development

- [ ] **17.6** Update component documentation/comments as needed

---

## Task Summary

| Epic                          | Tasks | Priority |
| ----------------------------- | ----- | -------- |
| 1. Setup & Dependencies       | 3     | High     |
| 2. Validation Schema          | 5     | High     |
| 3. Sanitization Utilities     | 4     | High     |
| 4. URL Validation             | 5     | High     |
| 5. TextInputField Enhancement | 5     | High     |
| 6. State Management           | 4     | High     |
| 7. Field Validation           | 5     | High     |
| 8. Form Submission            | 6     | High     |
| 9. Success/Error Messaging    | 5     | Medium   |
| 10. API Validation            | 6     | High     |
| 11. API Error Handling        | 3     | Medium   |
| 12. Validation Tests          | 3     | High     |
| 13. TextInputField Tests      | 1     | Medium   |
| 14. Form Validation Tests     | 2     | Medium   |
| 15. API Integration Tests     | 1     | Medium   |
| 16. Accessibility Testing     | 4     | Medium   |
| 17. Final Verification        | 6     | High     |

**Total Tasks: 68**

---

## Notes for Implementation

1. **Start with utilities (Tasks 1-4)**: These are foundational and have no dependencies on other changes.

2. **Test as you go**: After completing each epic, run the related tests to catch issues early.

3. **Keep mobile in mind**: The existing `TextInputField` has mobile optimizations - ensure they're preserved.

4. **Share schema between client and server**: Use the same Zod schema in both `editUserDetails.tsx` and the API route to ensure consistency.

5. **Commit frequently**: Consider committing after each epic is complete with passing tests.
