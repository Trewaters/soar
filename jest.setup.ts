import '@testing-library/jest-dom'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import type { JestAxeConfigureOptions } from 'jest-axe'

// Configure axe-core for accessibility testing
const axeConfig: JestAxeConfigureOptions = {
  rules: {
    // Disable rules that may conflict with test environment
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    // Enable important accessibility rules
    'color-contrast': { enabled: true },
  },
}

const axe = configureAxe(axeConfig)

// Add custom Jest matchers for accessibility testing
expect.extend(toHaveNoViolations)

// Make axe available globally for tests
;(globalThis as any).axe = axe

// Extend global types for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var axe: ReturnType<typeof configureAxe>

  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}

// Export to ensure this file is treated as a module
export {}
