import { expect, test } from '@playwright/test';

test('la home responde y muestra contenido', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('body')).toBeVisible();
});
