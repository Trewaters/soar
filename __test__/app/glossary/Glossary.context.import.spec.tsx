import '@testing-library/jest-dom'
import { GlossaryProvider } from '../../../app/glossary/GlossaryContext'

test('can import GlossaryProvider only', () => {
  expect(typeof GlossaryProvider).toBe('function')
})
