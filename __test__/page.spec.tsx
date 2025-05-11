import { describe, expect, jest, test } from '@jest/globals'
import Home from '../app/page'
import { redirect } from 'next/navigation'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('Home page', () => {
  test('redirects to /navigator', () => {
    // Render the component
    Home()

    // Check if redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith('/navigator')
  })
})
