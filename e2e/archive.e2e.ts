import { expect, test } from '@playwright/test'

test('home route renders the living archive', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /there is no/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /characters/i })).toBeVisible()
})

test('character explorer is directly routable', async ({ page }) => {
  await page.goto('/characters?q=rick&status=all')
  await expect(page.getByRole('heading', { name: /find the/i })).toBeVisible()
})
