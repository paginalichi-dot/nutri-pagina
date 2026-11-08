import { expect, type Locator, type Page, test } from '@playwright/test';

const button = (page: Page): Locator => page.getByRole('link', { name: 'Reservá tu turno' });

async function isBottomCenter(page: Page, locator: Locator): Promise<boolean> {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) return false;
  const centered = Math.abs(box.x + box.width / 2 - viewport.width / 2) <= 2;
  return centered && box.y + box.height <= viewport.height && box.y + box.height >= viewport.height - 120;
}

test.describe('botón flotante "Reservá tu turno"', () => {
  test('está abajo al centro al cargar y al llegar al final, sin tapar lo último de la página', async ({ page }) => {
    await page.goto('/');
    await expect(button(page)).toBeVisible();
    expect(await isBottomCenter(page, button(page))).toBe(true);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(button(page)).toBeVisible();
    expect(await isBottomCenter(page, button(page))).toBe(true);
    const last = page.locator('#sobre-mi p').last();
    const [lastBox, buttonBox] = await Promise.all([last.boundingBox(), button(page).boundingBox()]);
    expect((lastBox?.y ?? 0) + (lastBox?.height ?? 0)).toBeLessThanOrEqual(buttonBox?.y ?? 0);
  });

  test('se alcanza con Tab, tiene un área táctil de al menos 44px y lleva a /reservar', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(button(page)).toBeFocused();
    expect((await button(page).boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/reservar$/);
  });

  test('/reservar avisa que la reserva online está por llegar y no muestra el botón', async ({ page }) => {
    await page.goto('/reservar');
    await expect(page).toHaveTitle('Reservá tu turno · Lisandro López');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reservá tu turno');
    await expect(page.getByText('La reserva online está por llegar.')).toBeVisible();
    await expect(button(page)).toHaveCount(0);
    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lisandro López');
  });
});
