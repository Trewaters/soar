import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ReactElement } from 'react'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

/**
 * Test accessibility violations for a rendered component
 * @param component - The React component to test
 * @param options - Additional axe configuration options
 */
export const testAccessibility = async (
  component: ReactElement,
  options?: any
): Promise<void> => {
  const { container } = render(component)
  const results = await axe(container, {
    rules: {
      // Focus on key accessibility rules for yoga app
      'color-contrast': { enabled: true },
      'aria-required': { enabled: true },
      'button-name': { enabled: true },
      'form-field-multiple-labels': { enabled: true },
      'image-alt': { enabled: true },
      label: { enabled: true },
      'link-name': { enabled: true },
      ...options?.rules,
    },
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    ...options,
  })

  expect(results).toHaveNoViolations()
}

/**
 * Test accessibility for navigation components
 */
export const testNavigationAccessibility = async (
  component: ReactElement
): Promise<void> => {
  await testAccessibility(component, {
    rules: {
      region: { enabled: true },
      'landmark-one-main': { enabled: true },
      bypass: { enabled: true },
    },
  })
}

/**
 * Test accessibility for form components
 */
export const testFormAccessibility = async (
  component: ReactElement
): Promise<void> => {
  await testAccessibility(component, {
    rules: {
      label: { enabled: true },
      'form-field-multiple-labels': { enabled: true },
      'aria-required': { enabled: true },
      'aria-invalid': { enabled: true },
    },
  })
}

/**
 * Test accessibility for interactive components
 */
export const testInteractiveAccessibility = async (
  component: ReactElement
): Promise<void> => {
  await testAccessibility(component, {
    rules: {
      'button-name': { enabled: true },
      'link-name': { enabled: true },
      'focus-order-semantics': { enabled: true },
    },
  })
}
