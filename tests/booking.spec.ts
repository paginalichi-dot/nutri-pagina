import { expect, type Locator, type Page, test } from '@playwright/test';

const button = (page: Page): Locator => page.locator('[data-booking-button]');

async function isBottomCenter(page: Page, locator: Locator): Promise<boolean> {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) return false;
  const centered = Math.abs(box.x + box.width / 2 - viewport.width / 2) <= 2;
  return centered && box.y + box.height <= viewport.height && box.y + box.height >= viewport.height - 120;
}

test.describe('botón flotante "Reservá tu turno"', () => {
  test('está abajo al centro al cargar y se oculta al llegar al footer, que trae su propia píldora', async ({ page }) => {
    await page.goto('/');
    await expect(button(page)).toBeVisible();
    expect(await isBottomCenter(page, button(page))).toBe(true);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(button(page)).toBeHidden();
    await expect(page.locator('footer').getByRole('link', { name: 'Reservá tu turno' })).toBeInViewport();
  });

  test('se alcanza con Tab, tiene un área táctil de al menos 44px y lleva a /reservar (sin sesión, por el login)', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(button(page)).toBeFocused();
    expect((await button(page).boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/login\?volver=%2Freservar$/);
  });
});
