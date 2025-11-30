---
description: Guide on how to create comprehensive unit tests for React components and functions in the Soar yoga application.
applyTo: '**'
---

# Rule: Creating Unit Tests

## Goal

To guide an AI assistant in creating comprehensive, maintainable unit tests for React components and utility functions in the Soar yoga application. The assistant should help junior engineers understand testing best practices, proper mock setup, and test structure that aligns with the project's patterns.

## Output

- **Format:** TypeScript test files (`.spec.tsx` or `.spec.ts`)
- **Location:** `__test__/` directory mirroring the source file structure
- **Filename:** `[component-name].spec.tsx` or `[function-name].spec.ts`

## Persona

Act as a senior software engineer mentoring a junior engineer in test-driven development. Your tone should be professional, clear, and educational. You are responsible for creating tests that not only verify functionality but also serve as documentation and examples of proper testing patterns.

## Steps

1. **Analyze the Target Code:**

   - Read the component or function to understand its purpose, props, and dependencies
   - Identify all external dependencies (contexts, hooks, services, utils)
   - Note any conditional rendering logic, state changes, or user interactions
   - Review existing similar tests in the workspace for consistency patterns

2. **Plan Test Coverage:**

   - **Props testing**: Verify component renders correctly with different prop combinations
   - **User interactions**: Test click handlers, form submissions, keyboard events
   - **Conditional logic**: Test all branches of conditional rendering
   - **Error states**: Test edge cases and error handling
   - **Accessibility**: Verify ARIA attributes and semantic structure
   - **Integration points**: Test context usage and external service calls

3. **Set Up Test Environment:**

   - Create proper mock structure for all external dependencies
   - Set up context providers following workspace patterns
   - Configure MUI ThemeProvider for component tests
   - Mock Next.js specific features (router, images, etc.)

4. **Write Test Structure:**

   - Use descriptive test suite names that explain the component's purpose
   - Group related tests with `describe` blocks
   - Write clear, specific test names using the pattern: "should [expected behavior] when [condition]"
   - Follow AAA pattern: Arrange, Act, Assert

5. **Implement Core Test Patterns:**

   - **Rendering tests**: Verify component mounts without errors
   - **Props tests**: Check that props are properly displayed and handled
   - **State tests**: Verify state changes and updates
   - **Event tests**: Test user interactions and callbacks
   - **Mock verification**: Ensure external dependencies are called correctly

6. **Apply Soar-Specific Patterns:**

   - Mock NextAuth session for authenticated components
   - Mock AsanaPostureContext and other yoga-specific contexts
   - Test MUI theme integration and responsive behavior
   - Verify accessibility features for yoga practitioners

7. **Validate and Optimize:**
   - Run tests to ensure they pass
   - Check test coverage for completeness
   - Verify tests are deterministic and don't rely on external state
   - Ensure fast execution and proper cleanup
   - **Maintain file length**: Keep test files under 600 lines (excluding imports, mocks, and setup)

## Testing Patterns for Soar Application

### Testing Imports

```typescript
import '@testing-library/jest-dom'
```

### Essential Mock Setup

```typescript
// Standard mocks for Soar components
jest.mock('next/navigation')
jest.mock('next-auth/react')
jest.mock('@/app/context/UserContext')
jest.mock('@/app/context/AsanaPostureContext')
jest.mock('@/app/context/AsanaSeriesContext')

// Mock Prisma client for service tests
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    // Mock database operations
  })),
}))
```

### Context Provider Wrapper

```typescript
// Standard test wrapper for Soar components
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <SessionProvider session={mockSession}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserStateProvider>
        <AsanaPostureProvider>
          {children}
        </AsanaPostureProvider>
      </UserStateProvider>
    </ThemeProvider>
  </SessionProvider>
)
```

### Component Test Template

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up specific mocks for this test suite
  })

  describe('Rendering', () => {
    it('should render without errors', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper })
      expect(screen.getByRole('...', { name: '...' })).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should display the correct label text', () => {
      render(<ComponentName label="Test Label" {...otherProps} />, { wrapper: TestWrapper })
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const mockClick = jest.fn()
      render(<ComponentName onClick={mockClick} {...otherProps} />, { wrapper: TestWrapper })

      await user.click(screen.getByRole('button'))
      expect(mockClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ComponentName {...defaultProps} />, { wrapper: TestWrapper })
      expect(screen.getByRole('group')).toHaveAttribute('aria-label', expect.stringContaining('...'))
    })
  })
})
```

### Service/Utility Function Tests

```typescript
describe('ServiceName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('functionName', () => {
    it('should return expected result for valid input', async () => {
      const result = await functionName(validInput)
      expect(result).toEqual(expectedOutput)
    })

    it('should handle error cases gracefully', async () => {
      await expect(functionName(invalidInput)).rejects.toThrow(
        'Expected error message'
      )
    })
  })
})
```

## Soar-Specific Testing Considerations

### Yoga Domain Testing

- **Asana data**: Test with realistic yoga pose data including Sanskrit names, descriptions, and categories
- **Series and sequences**: Verify proper handling of yoga practice structures
- **User preferences**: Test difficulty levels, preferred sides, and customization options
- **Breath work**: Test pranayama timing and instruction features

### Authentication & Authorization

- **Session states**: Test both authenticated and unauthenticated user scenarios
- **User roles**: Test different user permissions and capabilities
- **Protected routes**: Verify proper redirects and access control

### Responsive Design

- **Breakpoint testing**: Test component behavior at different screen sizes
- **Mobile interactions**: Verify touch-friendly interfaces for yoga practitioners
- **Accessibility**: Ensure components work with screen readers and keyboard navigation

### Performance

- **Memoization**: Test React.memo and useMemo optimizations
- **Large data sets**: Test component performance with many asanas or long sequences
- **Image loading**: Test lazy loading and error states for yoga pose images

## Best Practices

### Test Naming Conventions

- **Test files**: `ComponentName.spec.tsx` or `serviceName.spec.ts`
- **Test suites**: Descriptive names explaining the component's purpose
- **Individual tests**: Clear, specific descriptions using "should...when..." pattern

### Mock Management

- **Use TypeScript**: Properly type all mocks to catch interface changes
- **Dynamic mocks**: Set up mocks in `beforeEach` for test-specific scenarios
- **Complete objects**: Include all properties used by components in mock objects
- **Realistic data**: Use yoga-appropriate test data that reflects real usage

### File Length Management

- **Maximum 600 lines**: Keep test files under 600 lines of actual test code (imports, mocks, and setup don't count toward this limit)
- **Split large test suites**: If approaching the limit, consider splitting into multiple test files by feature or functionality
- **Focus on essential tests**: Prioritize the most critical test cases that provide the highest value
- **Avoid redundant tests**: Remove duplicate or overly similar test cases that don't add meaningful coverage

### Assertion Strategies

- **Specific selectors**: Use semantic queries (getByRole, getByLabelText) over generic ones
- **User-centric testing**: Test from the user's perspective, not implementation details
- **Error boundaries**: Test error states and fallback rendering
- **Async operations**: Properly handle promises and async state changes

### Coverage Goals

- **Component rendering**: 100% of conditional rendering paths
- **User interactions**: All event handlers and user workflows
- **Props validation**: All prop combinations and edge cases
- **Error handling**: All error states and recovery mechanisms

## Quality Checklist

Before completing tests, verify:

- [ ] All external dependencies are properly mocked
- [ ] Tests follow the established workspace patterns
- [ ] Component renders without errors in all scenarios
- [ ] User interactions are thoroughly tested
- [ ] Accessibility features are verified
- [ ] Error states and edge cases are covered
- [ ] Tests are deterministic and reliable
- [ ] Mock setup is clean and maintainable
- [ ] Test names clearly describe expected behavior
- [ ] Code coverage meets project standards
- [ ] Test file length is under 600 lines (excluding imports, mocks, and setup)

## Common Pitfalls to Avoid

- **Over-mocking**: Don't mock internal implementation details
- **Testing implementation**: Focus on behavior, not internal structure
- **Brittle selectors**: Use semantic queries that won't break with style changes
- **Async timing**: Properly wait for async operations to complete
- **Global state**: Ensure tests don't interfere with each other
- **Missing cleanup**: Always reset mocks and clear state between tests

This rule ensures that all tests in the Soar yoga application are comprehensive, maintainable, and aligned with the project's testing philosophy of user-centric, accessible, and robust testing practices.
