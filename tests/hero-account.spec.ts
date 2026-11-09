import { expect, test } from '@playwright/test';

test.describe('hero de la home (Sprint 3)', () => {
  test('US-35 CA-3: el ícono de cuenta se abre con Enter y se cierra con Escape devolviendo el foco', async ({ page }) => {
    await page.goto('/');
    const account = page.getByRole('button', { name: 'Mi cuenta' });
    await expect(async () => {
      await account.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('region', { name: 'Mi espacio' })).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('region', { name: 'Mi espacio' })).toBeHidden();
    await expect(account).toBeFocused();
  });

  test('US-36 CA-2: con movimiento reducido las líneas a mano se ven dibujadas enteras', async ({ page }) => {
    await page.goto('/');
    const strokes = page.locator('[data-hero-frame] [data-hero-strokes]:visible');
    expect(await strokes.count()).toBeGreaterThan(0);
    for (const stroke of await strokes.all()) {
      await expect(stroke).toBeVisible();
      await expect(stroke).toHaveCSS('clip-path', 'none');
    }
  });

  test('US-37 CA-2: en mobile la flecha queda a la altura de «la base de tu salud» y no pisa el botón', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'La flecha junto a la frase de cierre es de mobile');
    await page.goto('/');
    const [hint, text, button] = await Promise.all([
      page.locator('[data-hero-frame] [data-scroll-hint]:visible').boundingBox(),
      page.locator('[data-hero-frame] strong', { hasText: 'la base de tu' }).boundingBox(),
      page.getByRole('link', { name: 'Reservá tu turno' }).boundingBox(),
    ]);
    expect(hint && text && button).toBeTruthy();
    expect((hint?.y ?? 0) < (text?.y ?? 0) + (text?.height ?? 0) && (hint?.y ?? 0) + (hint?.height ?? 0) > (text?.y ?? 0)).toBe(true);
    const [h, b] = [hint, button];
    const apart = !h || !b || h.x >= b.x + b.width || h.x + h.width <= b.x || h.y >= b.y + b.height || h.y + h.height <= b.y;
    expect(apart).toBe(true);
  });
});
