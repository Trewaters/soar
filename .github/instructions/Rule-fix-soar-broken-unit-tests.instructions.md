---
description: Guide for identifying and fixing broken unit tests in the Soar yoga application workspace using npm test scripts and Soar-specific patterns.
applyTo: 'soar/**'
---

# Rule: Fixing Broken Unit Tests in Soar Yoga Application

## Goal

To guide an AI assistant in identifying, analyzing, and fixing broken unit tests in the Soar yoga application codebase. The assistant should leverage the existing test scripts to identify failures, understand Soar-specific patterns, and apply yoga application best practices while making necessary corrections.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/.github/testing-reports/`
- **Filename:** `fix-broken-tests-[date]-[component].md`

## Persona

Act as a senior software engineer mentoring a junior engineer working on the Soar yoga application. Your tone should be professional, clear, and educational. You are responsible for helping the engineer understand why tests are failing in the context of yoga features, authentication flows, and MUI components, and how to fix them using Soar-specific patterns.

## Soar Application Context

### Key Testing Dependencies

- **Jest + React Testing Library** with Next.js integration
- **MUI v6** components with emotion styling
- **NextAuth.js v5** authentication system
- **MongoDB + Prisma ORM** for data persistence
- **Yoga-specific contexts**: `AsanaPostureContext`, `AsanaSeriesContext`, `UserStateContext`
- **Custom test timeout**: 30 seconds to handle MongoDB operations

### Test Script Arsenal

```bash
npm run test                    # Full test suite with coverage
npm run test:failures          # Verbose output for failed tests only
npm run test:debug             # Verbose, no cache, full debugging
npm run test:watch             # Watch mode for development
npm run test:clean             # Clear cache and run fresh
npm run test:minimal           # Silent run with minimal output
```

## Steps

1. **Verify Test Status Using Soar Scripts:**

   ```bash
   # Start with failures-only to identify broken tests
   npm run test:failures

   # If no clear output, try debug mode for more details
   npm run test:debug

   # For cache-related issues, try clean run
   npm run test:clean
   ```

   - **Always run test scripts first** to confirm actual failure state
   - Use `test:failures` script specifically designed for identifying broken tests
   - Only proceed with fixes if tests are demonstrably failing

2. **Analyze Soar-Specific Failure Patterns:**

   **Authentication Failures:**

   - Missing `SessionProvider` wrapper in test setup
   - Incomplete `useSession` mock from `next-auth/react`
   - NextAuth v5 session structure mismatches

   **Context Provider Issues:**

   - Missing yoga context providers in test wrapper
   - Incomplete mock of `AsanaPostureContext` or `AsanaSeriesContext`
   - Wrong provider hierarchy order (Session → Theme → User → Yoga contexts)

   **MUI v6 Integration Problems:**

   - Missing `ThemeProvider` wrapper causing style errors
   - Emotion styling conflicts in test environment
   - Material-UI component prop validation errors

   **MongoDB/Prisma Errors:**

   - Prisma client not properly mocked
   - Database connection timeouts in test environment
   - Missing environment variables for test database

3. **Apply Soar Test Patterns:**

   **Standard Test Wrapper for Soar Components:**

   ```typescript
   const SoarTestWrapper = ({ children }: { children: ReactNode }) => (
     <SessionProvider session={mockSession}>
       <ThemeProvider theme={theme}>
         <CssBaseline />
         <UserStateProvider>
           <AsanaPostureProvider>
             <AsanaSeriesProvider>
               {children}
             </AsanaSeriesProvider>
           </AsanaPostureProvider>
         </UserStateProvider>
       </ThemeProvider>
     </SessionProvider>
   )
   ```

   **Essential Soar Mocks:**

   ```typescript
   // NextAuth v5 session mock
   const mockSession = {
     user: {
       id: 'test-user-id',
       email: 'test@uvuyoga.com',
       name: 'Test Yogi',
     },
     expires: '2025-12-31T23:59:59.999Z',
   }

   // Yoga context mocks
   const mockAsanaContext = {
     asanas: [],
     selectedAsana: null,
     setSelectedAsana: jest.fn(),
     addAsana: jest.fn(),
     // Include ALL properties used by components
   }
   ```

4. **Fix Yoga-Specific Issues:**

   **Asana/Pose Related Tests:**

   - Mock yoga pose data with proper Sanskrit names
   - Include difficulty levels, body parts, and pose categories
   - Test both English and Sanskrit name rendering

   **Series and Sequence Tests:**

   - Mock yoga sequence data with proper flow structures
   - Test dynamic sequence generation and customization
   - Verify pose timing and transition logic

   **User Preferences:**

   - Mock user yoga preferences (difficulty, style, duration)
   - Test personalization features and saved sequences
   - Verify accessibility features for different user needs

5. **Handle Soar Database Patterns:**

   ```typescript
   // Mock Prisma client for Soar yoga data
   jest.mock('@prisma/client', () => ({
     PrismaClient: jest.fn().mockImplementation(() => ({
       asana: {
         findMany: jest.fn(),
         create: jest.fn(),
         update: jest.fn(),
       },
       asanaSeries: {
         findMany: jest.fn(),
         create: jest.fn(),
       },
       userData: {
         findUnique: jest.fn(),
         upsert: jest.fn(),
       },
     })),
   }))
   ```

6. **Run Soar Test Validation:**

   ```bash
   # Verify specific test file
   npm run test -- __test__/path/to/component.spec.tsx

   # Check for cascading failures
   npm run test:failures

   # Validate coverage impact
   npm run test:coverage
   ```

7. **Validate Test File Length and Structure:**

   - **Check test file length**: Count only `describe` and `it` blocks (excluding imports, mocks, setup functions)
   - **Maximum 1000 lines**: If test file exceeds 1000 lines of actual test code, split into smaller files
   - **Split large test files**: Break down by feature, component method, or logical test groupings
   - **Maintain test coverage**: Ensure all test scenarios are preserved during refactoring

8. **Document Soar-Specific Fixes:**
   - Explain the yoga domain context for the fix
   - Reference Soar architectural patterns used
   - Note any authentication or context provider changes
   - Suggest yoga-related edge cases to test
   - Document any test file splits and new file organization

## Soar-Specific Error Patterns & Solutions

### Error: "Cannot find module '@/app/context/AsanaPostureContext'"

- **Root Cause:** Missing alias mapping or incorrect import path
- **Solution:** Use `@context/AsanaPostureContext` or verify path aliases in jest.config.ts
- **Prevention:** Follow Soar import conventions consistently

### Error: "useSession() hook error" with NextAuth

- **Root Cause:** NextAuth v5 session structure or missing SessionProvider
- **Solution:**
  ```typescript
  jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: mockSession, status: 'authenticated' }),
    SessionProvider: ({ children }) => children,
  }))
  ```

### Error: MUI theme-related failures

- **Root Cause:** Missing ThemeProvider or theme import issues
- **Solution:** Import theme from `@/app/styles/theme` and wrap components properly
- **Prevention:** Always include theme in test wrapper for MUI components

### Error: "TypeError: Cannot destructure property 'asanas' of undefined"

- **Root Cause:** Incomplete AsanaPostureContext mock
- **Solution:** Provide complete context mock with all properties used by components
- **Prevention:** Research actual context interface before mocking

### Error: Prisma client connection issues

- **Root Cause:** Real database connection in test environment
- **Solution:** Mock Prisma client completely and provide yoga-specific mock data
- **Prevention:** Always mock external dependencies in unit tests

## Soar Debugging Strategies

### Progressive Test Isolation

1. **Start with component isolation**: Test single components with minimal props
2. **Add context layer by layer**: Add providers one at a time to identify issues
3. **Integrate authentication**: Add session provider last
4. **Test yoga workflows**: Verify complete user journeys

### Test File Length Management

1. **Count test lines only**: Only count `describe` and `it` blocks toward the 1000-line limit
2. **Exclude from count**: Imports, mocks, setup functions, interface definitions, and utility functions
3. **Split strategies**: Organize by feature areas, component methods, or user interaction flows
4. **File naming**: Use descriptive names like `ComponentName.rendering.spec.tsx`, `ComponentName.interactions.spec.tsx`
5. **Shared utilities**: Extract common test utilities to separate files in `__test__/utils/`

### Yoga Domain Validation

1. **Sanskrit name handling**: Test proper rendering and pronunciation guides
2. **Pose difficulty scaling**: Verify beginner to advanced progression
3. **Sequence flow logic**: Test pose transitions and timing
4. **User customization**: Test personal preferences and saved practices

### Performance Considerations

- **Large pose databases**: Test with realistic amounts of yoga data
- **Image loading**: Mock pose images and test lazy loading
- **Sequence generation**: Test performance with complex sequences
- **User data**: Test with realistic user profiles and history

## Quality Checklist for Soar Tests

Before completing test fixes, verify:

- [ ] All yoga contexts are properly mocked with complete interfaces
- [ ] NextAuth v5 session structure matches application patterns
- [ ] MUI components render without theme errors
- [ ] Prisma operations are mocked and don't hit real database
- [ ] Sanskrit terminology is handled correctly in tests
- [ ] Yoga sequences and pose data use realistic test fixtures
- [ ] Authentication flows work for both authenticated and guest users
- [ ] Responsive design works for mobile yoga practitioners
- [ ] Accessibility features are tested (screen readers, keyboard nav)
- [ ] Tests run successfully with `npm run test:failures`
- [ ] **Test file length under 1000 lines** (describe and it blocks only)
- [ ] **Large test files split appropriately** with descriptive naming
- [ ] **All test scenarios preserved** during refactoring and splitting

## Soar-Specific Test Patterns

### Authentication Test Pattern

```typescript
describe('Authenticated Yoga Component', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated'
    })
  })

  it('should show personalized yoga content for authenticated users', () => {
    render(<YogaComponent />, { wrapper: SoarTestWrapper })
    expect(screen.getByText('Your Practice')).toBeInTheDocument()
  })
})
```

### Yoga Context Test Pattern

```typescript
describe('AsanaCard Component', () => {
  const mockAsana = {
    id: 'test-asana-id',
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    difficulty: 'beginner',
    category: 'standing',
    description: 'A powerful standing pose...',
  }

  beforeEach(() => {
    mockUseAsanaContext.mockReturnValue({
      selectedAsana: mockAsana,
      setSelectedAsana: jest.fn(),
      // Include all required context properties
    })
  })
})
```

### Sequence Flow Test Pattern

```typescript
describe('YogaSequence Flow', () => {
  it('should progress through poses in correct order', async () => {
    const mockSequence = [mockWarriorI, mockDownwardDog, mockChildsPose]

    render(<SequencePlayer sequence={mockSequence} />, { wrapper: SoarTestWrapper })

    expect(screen.getByText('Warrior I')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next Pose' }))
    expect(screen.getByText('Downward Dog')).toBeInTheDocument()
  })
})
```

## Constraints

- **Verify Before Acting:** Always use `npm run test:failures` first to confirm test status
- **Soar Patterns Only:** Use established Soar application patterns and conventions
- **Yoga Domain Awareness:** Understand yoga terminology and user workflows
- **No Application Logic Changes:** Focus only on test fixes, not feature implementation
- **Real Environment Validation:** Always verify fixes with npm test scripts
- **Context Provider Order:** Maintain proper provider hierarchy for Soar contexts
- **Authentication Integration:** Ensure NextAuth v5 compatibility in all tests
- **Test File Size Management:** Split test files exceeding 1000 lines into focused, well-organized smaller files
- **Preserve Test Coverage:** Ensure no test scenarios are lost during file refactoring
