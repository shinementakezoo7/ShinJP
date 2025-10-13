import { expect, test } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')

  // Check if the title is present
  await expect(page).toHaveTitle(/Shinmen Takezo/)

  // Check if main heading is visible
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
})

test('navigation works', async ({ page }) => {
  await page.goto('/')

  // Click on a navigation link (adjust selector based on your app)
  await page.click('a[href="/dashboard"]')

  // Wait for navigation
  await page.waitForURL('**/dashboard')

  // Verify we're on the dashboard page
  await expect(page).toHaveURL(/dashboard/)
})

test('textbook generation page loads', async ({ page }) => {
  await page.goto('/textbooks/generate-ssw')

  // Check if form is visible
  const titleInput = page.getByLabel(/title/i)
  await expect(titleInput).toBeVisible()
})
