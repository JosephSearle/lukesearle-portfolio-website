import { expect, test } from '@playwright/test';

test('homepage renders the hero and work grid', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Luke Searle');
  await expect(page.locator('article')).toHaveCount(8);
});

test('work page filters by category', async ({ page }) => {
  await page.goto('/work?filter=short');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Shorts');
  await expect(page.locator('article')).toHaveCount(3);
});

test('project page shows details and navigates to the next project', async ({ page }) => {
  await page.goto('/work/p2');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Quiet Hours');
  await expect(page.getByText('94 min')).toBeVisible();
  await page.getByRole('link', { name: /→$/ }).click();
  await expect(page).toHaveURL(/\/work\/p\d/);
});

test('bio and contact pages render', async ({ page }) => {
  await page.goto('/bio');
  await expect(page.getByRole('heading', { level: 1, name: 'Bio' })).toBeVisible();
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: 'hello@lukesearle.com' }).first()).toBeVisible();
});
