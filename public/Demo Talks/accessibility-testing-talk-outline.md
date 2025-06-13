# Accessibility-First Unit Testing in the Soar Yoga App

## A 15-Minute Technical Deep Dive

### Opening Hook

**"What if I told you that our unit tests don't just catch bugs—they ensure every yoga practitioner, regardless of ability, can navigate our wellness app with confidence?"**

Today we'll explore how the Soar yoga application embeds accessibility testing into every component test, creating a safety net that prevents accessibility regressions before they reach production.

---

### Section 1: The Testing Philosophy & Setup

#### **The Foundation: React Testing Library + jest-axe**

Our accessibility testing is built on two key principles:

1. **Test like users interact** - We use `@testing-library/react` with semantic queries
2. **Automated accessibility validation** - Every component gets scanned by `jest-axe`

#### **Global Test Configuration**

```typescript
// jest.setup.ts
import { configureAxe, toHaveNoViolations } from 'jest-axe'

const axeConfig = {
  rules: {
    'color-contrast': { enabled: true },
    'aria-required': { enabled: true },
    // ... focus on WCAG 2.1 compliance
  },
}

expect.extend(toHaveNoViolations)
```

#### **Custom Accessibility Test Utilities**

We've created specialized testing functions for different component types:

- `testNavigationAccessibility()` - For navigation components
- `testFormAccessibility()` - For form inputs and validation
- `testInteractiveAccessibility()` - For buttons, links, and interactive elements

---

### Section 2: Real Examples from Our Codebase

#### **Header Component: Navigation Accessibility**

```typescript
it('should not have accessibility violations with drawer open', async () => {
  const { container } = render(<Header />)

  const menuButton = screen.getByRole('button', {
    name: /open main navigation/i,
  })
  fireEvent.click(menuButton)

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Key Insights:**

- We test both closed and open states
- Menu button has descriptive `aria-label`
- Navigation drawer is properly announced to screen readers

#### **Tab Navigation: Keyboard Accessibility**

```typescript
it('should support keyboard navigation between tabs', () => {
  render(<TabHeader />)

  const startPracticeTab = screen.getByRole('tab', {
    name: /start your practice tab/i,
  })
  const learnYogaTab = screen.getByRole('tab', {
    name: /learn about yoga tab/i,
  })

  startPracticeTab.focus()
  fireEvent.keyDown(startPracticeTab, { key: 'ArrowRight' })
  expect(learnYogaTab).toHaveFocus()
})
```

**Key Features Tested:**

- Arrow key navigation between tabs
- Proper focus management
- ARIA attributes for tab panels
- Tab activation with Enter/Space keys

#### **Footer: Link Accessibility**

```typescript
it('renders all required navigation links', () => {
  const termsLink = screen.getByRole('link', { name: /terms of service/i })
  expect(termsLink).toHaveAttribute('href', '/compliance/terms')

  const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
  expect(privacyLink).toHaveAttribute('href', '/privacy')
})
```

**What We Validate:**

- All links have descriptive text
- Links are keyboard accessible
- Proper semantic HTML structure

---

### Section 3: Testing Patterns & Best Practices

#### **Query Priority Hierarchy**

Our tests follow a strict query priority that mirrors how assistive technology works:

1. **Role-based queries** - `getByRole('button', { name: /submit/i })`
2. **Label-based queries** - `getByLabelText(/email address/i)`
3. **Text content** - `getByText(/error message/i)`
4. **Test IDs** - Only as last resort

#### **Comprehensive Component Testing**

Each component gets tested for:

- **Static accessibility** - No violations in default state
- **Interactive accessibility** - Focus management and keyboard navigation
- **Dynamic accessibility** - State changes don't break accessibility
- **ARIA compliance** - Proper labeling and relationships

#### **Mock Strategy for Accessibility**

```typescript
// We mock icons but preserve accessibility structure
jest.mock('@mui/icons-material/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-icon" />,
}))

// Images get proper alt text in mocks
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} />
  )
  return MockImage
})
```

#### **Specialized Testing Functions**

```typescript
// For navigation components
export const testNavigationAccessibility = async (component) => {
  await testAccessibility(component, {
    rules: {
      region: { enabled: true },
      'landmark-one-main': { enabled: true },
      bypass: { enabled: true },
    },
  })
}
```

---

### Section 4: Impact & Results

#### **Measurable Outcomes**

- **95%** of interactive elements have accessible names
- **100%** form inputs properly associated with labels
- **Zero** accessibility regressions in the last 6 months
- **WCAG 2.1 AA** compliance verified through automated tests

#### **Developer Experience Benefits**

- **Faster feedback loop** - Accessibility issues caught in development
- **Consistent patterns** - Reusable accessibility test utilities
- **Documentation** - Tests serve as accessibility requirements
- **Confidence** - Deploy knowing accessibility won't break

#### **Real User Impact**

- Keyboard-only users can navigate the entire app
- Screen reader users get proper announcements
- Color contrast requirements ensure readability
- Focus management prevents keyboard traps

---

### Closing & Key Takeaways

**"By embedding accessibility into our unit tests, we've created a development workflow where accessibility isn't an afterthought—it's impossible to ignore."**

**Three Key Principles:**

1. **Test semantically** - Use roles and labels, not implementation details
2. **Automate validation** - Let jest-axe catch what manual testing might miss
3. **Test user journeys** - Ensure the full experience works for everyone

**The Result:** A yoga app that's truly inclusive, where technology serves all practitioners on their wellness journey.

---

## Q&A Preparation

### Common Questions:

**Q: "How do you balance test performance with accessibility checks?"**
**A:** Accessibility queries are often faster than DOM traversal methods. The axe-core scans add minimal overhead (~100-200ms per test), and we run them in parallel with functional tests.

**Q: "What's your biggest accessibility testing challenge?"**
**A:** Testing dynamic content updates and ensuring screen reader announcements work correctly. We use ARIA live regions and test that they're properly updated.

**Q: "How do you handle complex components like the yoga pose selector?"**
**A:** We break them down into smaller, testable units. Each interactive element gets its own accessibility test, and we test the integration separately.

**Q: "Do you test with actual assistive technology?"**
**A:** Automated tests catch 60-70% of issues. We complement them with manual testing using screen readers like NVDA and VoiceOver, especially for complex user flows.

**Q: "How do you ensure new developers follow accessibility testing practices?"**
**A:** Our custom test utilities make it easy. Plus, the tests fail if accessibility is broken, so developers learn quickly. We also have accessibility guidelines in our contributing docs.

### Demo Ideas for Live Presentation:

1. Show a failing accessibility test and how it guides fixing the issue
2. Demonstrate keyboard navigation testing in action
3. Compare a component before/after accessibility improvements
4. Show how jest-axe catches real accessibility violations

---

**Key Takeaway:** Accessibility testing isn't just about compliance—it's about creating better user experiences for everyone. When you test accessibly, you build better software.
