import { expect, test } from '@playwright/test';

test('homepage renders the hero and the work grid with real images', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Luke Searle');
  await expect(page.locator('article')).toHaveCount(8);
  const first = page.locator('article img').first();
  await expect(first).toBeVisible();
  expect(await first.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test('work page filters by category', async ({ page }) => {
  await page.goto('/work?filter=short');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Shorts');
  await expect(page.locator('article')).toHaveCount(3);
});

test('filter tabs cover every category', async ({ page }) => {
  await page.goto('/work');
  for (const label of [
    'All',
    'Features',
    'Shorts',
    'Commercials',
    'Music videos',
    'In development',
  ]) {
    await expect(page.getByRole('link', { name: label, exact: true }).first()).toBeVisible();
  }
});

test('project page shows details, stills and navigates to the next project', async ({ page }) => {
  await page.goto('/work/the-quiet-hours');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Quiet Hours');
  await expect(page.getByText('94 min')).toBeVisible();
  await expect(page.locator('article img')).toHaveCount(4);
  await page.getByRole('link', { name: /→$/ }).click();
  await expect(page).toHaveURL(/\/work\/[a-z-]+$/);
});

test('bio and contact pages render', async ({ page }) => {
  await page.goto('/bio');
  await expect(page.getByRole('heading', { level: 1, name: 'Bio' })).toBeVisible();
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: 'hello@lukesearle.com' }).first()).toBeVisible();
});
