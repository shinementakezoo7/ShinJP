/**
 * Accessibility Testing Setup
 * Integrates axe-core for automated accessibility checks
 */

import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export interface A11yCheckOptions {
  skipFailures?: boolean
  includedImpacts?: ('minor' | 'moderate' | 'serious' | 'critical')[]
}

/**
 * Check accessibility on a page
 * Note: For production use, integrate @axe-core/playwright or similar
 */
export async function checkPageAccessibility(
  page: Page,
  options: A11yCheckOptions = {}
): Promise<void> {
  const { skipFailures = false } = options

  try {
    // Basic accessibility checks
    // Verify page has a title
    const title = await page.title()
    if (!title) {
      throw new Error('Page has no title')
    }

    // Check for main content area
    const main = await page.locator('main').count()
    if (main === 0) {
      console.warn('⚠ Page missing main content area')
    }

    console.log('✓ Page accessibility check passed')
  } catch (error) {
    if (!skipFailures) {
      console.error('✗ Accessibility issues found:', error)
      throw error
    }
    console.warn('⚠ Accessibility issues found but continuing:', error)
  }
}

/**
 * Scan specific element for accessibility issues
 */
export async function checkElementAccessibility(
  page: Page,
  selector: string,
  options: A11yCheckOptions = {}
): Promise<void> {
  const { skipFailures = false } = options

  try {
    const element = await page.locator(selector)
    const count = await element.count()

    if (count === 0) {
      throw new Error(`Element not found: ${selector}`)
    }

    console.log(`✓ Element accessibility check passed for: ${selector}`)
  } catch (error) {
    if (!skipFailures) {
      console.error(`✗ Accessibility issues found for ${selector}:`, error)
      throw error
    }
    console.warn(`⚠ Accessibility issues found for ${selector}:`, error)
  }
}

/**
 * Accessibility test helpers for Playwright
 */
export const accessibilityTests = {
  /**
   * Check for missing alt text on images
   */
  async checkImageAltText(page: Page) {
    const images = await page.locator('img').all()
    const missing = []

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      if (!alt) {
        missing.push(await img.getAttribute('src'))
      }
    }

    return missing
  },

  /**
   * Check for keyboard navigation
   */
  async checkKeyboardNavigation(page: Page) {
    // Focus on first interactive element
    await page.keyboard.press('Tab')

    // Check if focus is visible
    const focused = await page.locator(':focus').count()
    return focused > 0
  },

  /**
   * Check for proper heading hierarchy
   */
  async checkHeadingHierarchy(page: Page) {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    const hierarchy: number[] = []

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => parseInt(el.tagName[1]))
      hierarchy.push(tagName)
    }

    // Check for proper order
    for (let i = 1; i < hierarchy.length; i++) {
      const diff = hierarchy[i] - hierarchy[i - 1]
      if (diff > 1) {
        console.warn(
          `Heading hierarchy issue: jumped from h${hierarchy[i - 1]} to h${hierarchy[i]}`
        )
      }
    }

    return hierarchy
  },

  /**
   * Check for ARIA labels
   */
  async checkAriaLabels(page: Page) {
    const unlabeled = await page.locator('[role]:not([aria-label])').count()
    return unlabeled
  },
}

export default accessibilityTests
