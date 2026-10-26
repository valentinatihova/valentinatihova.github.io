import { test, expect } from '@playwright/test';

const PAGES = ['/', '/article/data360-schema-drift-ci/', '/article/sfmc-false-opens/', '/resume/'];

// The analytics beacon is production-only, but keep tests offline either way.
test.beforeEach(async ({ page }) => {
  await page.route(/cloudflareinsights\.com/, (route) => route.abort());
});

for (const path of PAGES) {
  test(`${path} renders without errors or sideways scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && m.text().includes('Content Security Policy')) errors.push(m.text()); });
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Site' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('home links to work, writing and the drift article', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('#writing')).toBeVisible();
  await page.locator('#writing a[href="/article/data360-schema-drift-ci/"]').first().click();
  await expect(page).toHaveURL(/\/article\/data360-schema-drift-ci\/$/);
});

test.describe('drift animation', () => {
  const ARTICLE = '/article/data360-schema-drift-ci/';

  test('autoplays and can be driven by its controls', async ({ page }) => {
    await page.goto(ARTICLE);
    const figure = page.locator('[data-sd]');
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.getByRole('button', { name: 'Pause' })).toBeVisible();
    await figure.getByRole('button', { name: /^Go to shot 3:/ }).click();
    await expect(figure.locator('[aria-live]')).toContainText('One field mapping was deleted upstream.');
  });

  test('stays still and shows the final shot with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ARTICLE);
    const figure = page.locator('[data-sd]');
    await figure.scrollIntoViewIfNeeded();
    await expect(page.locator('h1')).toBeVisible();
    await expect(figure.getByRole('button', { name: /^(Play|Replay)$/ })).toBeVisible();
    await expect(figure.locator('[aria-live]')).toContainText('Flagged at the next drift check.');
  });
});

test('unknown pages get the 404 page', async ({ page }) => {
  const res = await page.goto('/no-such-page/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
});

test('RSS feed lists every published article', async ({ request }) => {
  const res = await request.get('/rss.xml');
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  expect(xml).toContain('<link>https://valentinatihova.com/article/data360-schema-drift-ci/</link>');
  expect(xml).toContain('<link>https://valentinatihova.com/article/sfmc-false-opens/</link>');
});
