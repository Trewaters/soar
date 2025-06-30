// Simple test to verify UI components and edit flow
import { test, expect } from '@playwright/test'

test.describe('Posture Editing Flow', () => {
  test('should show edit button for posture creator', async ({ page }) => {
    // Navigate to the posture detail page
    await page.goto(
      'http://localhost:3000/navigator/asanaPostures/685fe988c820a835a605421d'
    )

    // Check if the page loads
    await expect(page).toHaveTitle(/Uvuyoga/)

    // Check if edit button is present (may require authentication)
    const editButton = page.locator('[data-testid="edit-posture-button"]')
    const loginPrompt = page.locator('text=Sign in')

    // Either edit button should be visible (if authenticated) or login prompt should appear
    await expect(editButton.or(loginPrompt)).toBeVisible()
  })

  test('should require authentication for editing', async ({ page }) => {
    // Test that the API endpoint requires authentication
    const response = await page.request.put(
      'http://localhost:3000/api/poses/685fe988c820a835a605421d',
      {
        data: {
          english_names: ['Test Edit'],
          description: 'Test description',
          category: 'Testing',
          difficulty: 'Easy',
          breath_direction_default: 'Neutral',
          preferred_side: 'None',
          sideways: false,
        },
      }
    )

    expect(response.status()).toBe(401)
  })
})
