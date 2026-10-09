import { expect, test } from '@playwright/test';

test('Startseite lädt, Footer verlinkt Impressum und Datenschutz', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Impressum' }).click();
  await expect(page).toHaveURL(/\/impressum$/);
  await expect(page.getByRole('heading', { name: 'Impressum' })).toBeVisible();
  await expect(page.getByText('§ 5 DDG')).toBeVisible();

  await page.getByRole('link', { name: 'Datenschutz' }).click();
  await expect(page).toHaveURL(/\/datenschutz$/);
  await expect(page.getByRole('heading', { name: 'Datenschutz', level: 1 })).toBeVisible();
});

test('Sprache wechselt ohne Neuladen und bleibt nach dem Neuladen', async ({ page }) => {
  await page.goto('/datenschutz');
  await page.getByRole('button', { name: 'en' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toBeVisible();
  await expect(page.getByText('legally binding')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toBeVisible();
});

test('auf dem Handy passt alles in die Breite', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'nur mobil');
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
