# Engineering Task Breakdown: Connected Accounts Feature Fixes

**Source:** Connected Accounts Analysis (`.github/analysis/connected-accounts-analysis.md`)

**Overview:** Fix critical security issues, missing UI elements, and API limitations in the Connected Accounts feature to properly display and manage all authentication methods including credentials (email/password).

---

## 1. 🚨 CRITICAL SECURITY: Fix Password Verification in Credentials Provider

**Priority:** P0 - Critical Security Issue

### Tasks:

- **1.1** Locate the credentials authorize function in `auth.ts` (around lines 118-125) where existing user login is handled
- **1.2** Add database query to fetch the user's `ProviderAccount` where `provider: 'credentials'`
- **1.3** Extract the `credentials_password` field from the provider account
- **1.4** Import and use `comparePassword` utility from `@app/utils/password` to verify the provided password against the stored hash
- **1.5** Return `null` (authentication failure) if:
  - No credentials provider account is found for the user
  - The `credentials_password` field is missing/null
  - The password comparison fails
- **1.6** Only return the user object (`id`, `name`, `email`) if password verification succeeds
- **1.7** Add appropriate console logging for debugging password verification failures

**Acceptance Criteria:**

- Users with credentials accounts can only log in with the correct password
- Invalid passwords are rejected and return null
- Proper error logging distinguishes between "user not found", "no credentials provider", and "invalid password"
- No breaking changes to OAuth provider authentication flows

---

## 2. Add Credentials Provider to UI Metadata

**Priority:** P1 - High (Feature Visibility)

### Tasks:

- **2.1** Open `app/navigator/profile/settings/connected-accounts/page.tsx`
- **2.2** Locate the `PROVIDER_METADATA` constant (around line 27)
- **2.3** Add a new `credentials` entry to `PROVIDER_METADATA` object with:
  - `name`: 'Email & Password'
  - `icon`: '/icons/profile/auth-credentials.svg'
  - `available`: true
- **2.4** Position the credentials entry first in the object (before google) for logical ordering
- **2.5** Create an SVG icon for credentials at `public/icons/profile/auth-credentials.svg` (email/lock icon)
- **2.6** Verify the icon displays correctly at 32x32 pixels in the UI
- **2.7** Test that credentials provider appears in the Connected Accounts list when a user has credentials authentication

**Acceptance Criteria:**

- Credentials provider appears in the Connected Accounts UI
- Icon displays correctly alongside other providers
- Shows "Connected" status for users with email/password authentication
- Shows "Not Connected" for users without credentials
- Visual consistency with other provider cards (Google, GitHub)

---

## 3. Update API to Support Credentials Disconnection

**Priority:** P1 - High (Feature Completeness)

### Tasks:

- **3.1** Open `app/api/user/connected-accounts/route.ts`
- **3.2** Locate the DELETE endpoint's provider validation logic (around line 78)
- **3.3** Update the validation array to include `'credentials'`: `['google', 'github', 'credentials']`
- **3.4** Update the error message to include credentials: `'Invalid provider. Must be "google", "github", or "credentials"'`
- **3.5** Verify the existing safety check (preventing deletion of the only authentication method) works for credentials
- **3.6** Test disconnecting credentials when multiple authentication methods exist
- **3.7** Test that attempting to disconnect the only credentials method is properly rejected

**Acceptance Criteria:**

- DELETE endpoint accepts "credentials" as a valid provider parameter
- Credentials provider accounts can be successfully deleted from the database
- Safety check prevents deleting credentials if it's the only authentication method
- Error messages accurately reflect the accepted providers
- API returns appropriate success/error responses for credentials operations

---

## 4. Create Credentials Provider Icon

**Priority:** P1 - High (Required for Task 2)

### Tasks:

- **4.1** Design or source an SVG icon representing email/password authentication (e.g., envelope + lock, key + @symbol)
- **4.2** Ensure the icon is:
  - SVG format for scalability
  - 32x32 pixels viewBox
  - Monochrome or simple color scheme matching Soar's design system
  - Accessible (proper title/desc elements if needed)
- **4.3** Save the icon as `public/icons/profile/auth-credentials.svg`
- **4.4** Test the icon rendering in the Connected Accounts UI at various screen sizes
- **4.5** Verify accessibility with screen readers

**Acceptance Criteria:**

- Icon file exists at correct path
- Icon is visually clear at 32x32 display size
- Icon style matches other authentication provider icons (Google, GitHub)
- Icon loads without errors in the UI
- Proper alt text/accessibility attributes present

---

## 5. Enhance API Response with Provider Type Information

**Priority:** P2 - Medium (Nice to Have)

### Tasks:

- **5.1** Update the GET endpoint in `app/api/user/connected-accounts/route.ts`
- **5.2** Include the `type` field from `ProviderAccount` in the response transformation (around line 35)
- **5.3** Add `type` to the `ConnectedAccount` interface in the frontend component
- **5.4** Consider adding `hasPassword` boolean for credentials provider (indicates if password is set)
- **5.5** Update frontend to display provider type information if useful for users

**Acceptance Criteria:**

- API response includes provider type ('oauth', 'credentials', etc.)
- Frontend interface properly typed with new fields
- No breaking changes to existing API consumers
- Type information can be used for future UI enhancements

---

## 6. Add UI Distinction for Credentials Provider

**Priority:** P2 - Medium (User Experience)

### Tasks:

- **6.1** In the Connected Accounts UI component, detect when rendering the credentials provider
- **6.2** Add special handling for credentials provider to show additional context:
  - "Change Password" button (links to password change flow)
  - Last password change date (if available)
  - Password strength indicator (if stored in metadata)
- **6.3** Style credentials provider card slightly differently to indicate it's password-based (not OAuth)
- **6.4** Add helpful text explaining that credentials = email/password login
- **6.5** Consider adding inline password change functionality

**Acceptance Criteria:**

- Credentials provider visually distinguishable from OAuth providers
- Users understand that credentials = email/password method
- Additional password management actions available for credentials
- UI remains clean and not cluttered with too much information

---

## 7. Implement "Add Login Method" Functionality

**Priority:** P2 - Medium (Feature Enhancement)

### Tasks:

- **7.1** Create a modal/dialog component for adding new login methods (`AddLoginMethodDialog.tsx`)
- **7.2** Display available providers (Google, GitHub, Credentials) in the modal
- **7.3** For OAuth providers (Google, GitHub):
  - Redirect to NextAuth sign-in with `callbackUrl` back to connected accounts page
  - Handle account linking flow in NextAuth callbacks
  - Show success/error messages after OAuth flow completes
- **7.4** For Credentials provider:
  - Show password setup form if user doesn't have credentials yet
  - Create API endpoint `POST /api/user/connected-accounts/add-password`
  - Hash and store password in new ProviderAccount record
  - Validate password strength before accepting
- **7.5** Replace the alert in `handleAddAccount` with dialog open logic
- **7.6** Refresh connected accounts list after successfully adding new method
- **7.7** Handle error cases (provider already connected, OAuth denied, weak password, etc.)

**Acceptance Criteria:**

- "Add Login Method" button opens functional modal
- Users can successfully link Google OAuth to existing account
- Users can successfully link GitHub OAuth to existing account
- Users can set a password if they don't have credentials yet
- Cannot add duplicate providers (proper validation)
- Success messages confirm new login method added
- Errors are handled gracefully with helpful messages
- Connected accounts list refreshes automatically after adding method

---

## 8. Add Confirmation Modal for Provider Disconnection

**Priority:** P3 - Low (User Experience Polish)

### Tasks:

- **8.1** Replace browser `confirm()` dialog with custom MUI confirmation dialog
- **8.2** Create reusable `ConfirmationDialog` component with:
  - Title: "Disconnect [Provider Name]?"
  - Description: Explain consequences of disconnecting
  - Warning if only 2 providers remain (will be down to 1)
  - Cancel and Confirm buttons
- **8.3** Update `handleDisconnect` to use the new dialog
- **8.4** Style confirmation dialog to match Soar's design system
- **8.5** Add appropriate ARIA labels for accessibility

**Acceptance Criteria:**

- Custom styled confirmation dialog replaces browser default
- Dialog clearly explains what disconnecting means
- Warning shown when removing second-to-last authentication method
- Dialog is accessible via keyboard and screen readers
- Consistent visual design with rest of Soar application

---

## 9. Testing - Unit Tests for Connected Accounts Feature

**Priority:** P1 - High (Required)

### Tasks:

- **9.1** Create `__test__/app/api/user/connected-accounts/route.spec.ts` for API tests:
  - Test GET endpoint with authenticated user
  - Test GET endpoint with unauthenticated user (401)
  - Test DELETE endpoint with valid provider
  - Test DELETE endpoint preventing last method deletion
  - Test DELETE endpoint with invalid provider
  - Mock Prisma client appropriately
- **9.2** Create `__test__/app/navigator/profile/settings/connected-accounts/page.spec.tsx` for UI tests:
  - Test component renders with connected accounts
  - Test loading state displays correctly
  - Test error state displays correctly
  - Test disconnect button functionality
  - Test safety check for single authentication method
  - Mock fetch API calls and NextAuth session
- **9.3** Update `__test__/auth.spec.ts` (or create if missing) for credentials provider:
  - Test new account creation with credentials
  - Test existing user login with correct password
  - Test existing user login with incorrect password (should fail)
  - Test user login with no credentials provider (should fail)
  - Mock Prisma queries and password utilities
- **9.4** Ensure all test files follow Soar testing patterns (max 600 lines per file)
- **9.5** Verify test coverage meets project standards (>80%)

**Acceptance Criteria:**

- All new code has corresponding unit tests
- Tests follow Soar's established testing patterns
- Proper mocking of NextAuth, Prisma, and context providers
- Tests pass successfully: `npm run test`
- Code coverage maintained or improved
- No broken tests after implementation
- Tests document expected behavior clearly

---

## 10. Documentation - Update User-Facing Help

**Priority:** P3 - Low (User Documentation)

### Tasks:

- **10.1** Create or update help documentation explaining Connected Accounts feature
- **10.2** Document each authentication provider type:
  - Google OAuth: What it does, how to connect/disconnect
  - GitHub OAuth: What it does, how to connect/disconnect
  - Email & Password: What it does, how to set/change password
- **10.3** Explain the safety requirement (must have at least one login method)
- **10.4** Add FAQ section for common questions:
  - "What happens if I disconnect Google?"
  - "Can I use multiple login methods?"
  - "How do I change my password?"
  - "What if I forget my password?"
- **10.5** Consider adding in-app tooltips or help icons on the Connected Accounts page

**Acceptance Criteria:**

- User documentation clearly explains all authentication options
- Common questions are answered in FAQ
- Documentation is accessible from the Connected Accounts page
- Screenshots/visuals included where helpful
- Documentation matches actual feature behavior

---

## Implementation Order Recommendation

1. **Task 1** (Critical Security Fix) - Must be done first
2. **Task 4** (Create Icon) - Prerequisite for Task 2
3. **Task 2** (Add UI Metadata) - High priority, user-visible
4. **Task 3** (Update API) - High priority, enables full functionality
5. **Task 9** (Testing) - Should be done alongside Tasks 1-3
6. **Task 5** (Enhance API Response) - Medium priority enhancement
7. **Task 6** (UI Distinction) - Medium priority UX improvement
8. **Task 7** (Add Login Method) - Medium priority feature addition
9. **Task 8** (Confirmation Modal) - Low priority polish
10. **Task 10** (Documentation) - Final task after features complete

---

## Definition of Done

For each task to be considered complete:

- [ ] Code implemented following Soar architecture patterns
- [ ] Unit tests written and passing (Task 9)
- [ ] Manual testing completed on local environment
- [ ] No new ESLint errors or warnings
- [ ] Code reviewed for security considerations
- [ ] Accessibility verified (ARIA labels, keyboard navigation)
- [ ] Mobile responsive design tested
- [ ] Integration with existing Soar contexts verified
- [ ] Documentation updated (inline comments + Task 10)
- [ ] Git commit with descriptive message following Soar conventions

---

## Risk Considerations

### Technical Risks

- **Password verification fix (Task 1)**: Ensure backward compatibility with existing user sessions
- **API changes (Task 3)**: Verify no breaking changes for any other API consumers
- **OAuth flow (Task 7)**: Handle edge cases in NextAuth callback routing

### User Experience Risks

- **Disconnection flow**: Ensure users don't accidentally lock themselves out
- **Multiple providers**: Clear communication about what each provider does
- **Password management**: Provide clear password requirements and validation

### Security Considerations

- **Password hashing**: Continue using bcrypt with proper salt rounds
- **Session management**: Ensure disconnecting providers properly invalidates relevant sessions
- **OAuth tokens**: Verify tokens are properly cleaned up when disconnecting OAuth providers
- **Rate limiting**: Consider adding rate limiting to password verification attempts

---

## Success Metrics

- ✅ Zero instances of successful login with incorrect password
- ✅ Credentials provider visible for 100% of users with email/password accounts
- ✅ Users can successfully disconnect credentials when alternate login methods exist
- ✅ All unit tests passing with >80% code coverage
- ✅ Zero accessibility violations in Connected Accounts UI
- ✅ Mobile layout works correctly on devices 320px width and up
- ✅ Feature works correctly with all combinations of providers (credentials only, OAuth only, mixed)
