import { expect, test } from '@playwright/test';
import { introDone, transformOf } from './support/motion';

test.describe('movimiento de la home', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('el scroll tiene inercia y la escena del hero se mueve con él', async ({ page }) => {
    await page.goto('/');
    await introDone(page);
    await expect(page.locator('html')).toHaveClass(/lenis/);
    await page.mouse.wheel(0, 500);
    await expect.poll(async () => (await transformOf(page, '[data-hero-photo] img')).scale).toBeGreaterThan(1);
  });

  test('el trazo de "Sobre mí" se dibuja con el scroll', async ({ page }) => {
    await page.goto('/');
    await introDone(page);
    const stroke = page.locator('#sobre-mi [data-draw]').first();
    await expect(stroke).toHaveAttribute('style', /stroke-dash/);
  });

  test('con "reducir movimiento" no hay inercia ni intro: todo quieto y visible', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/lenis|motion-pending/);
    expect((await transformOf(page, '[data-hero-photo]')).scale).toBe(1);
    await expect(page.locator('[data-hero-name]')).toHaveCSS('opacity', '1');
    await context.close();
  });

  test('la home no se mueve sola después de la intro y al bajar: CLS por debajo de 0.1', async ({ page }) => {
    await page.goto('/');
    await introDone(page);
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!Reflect.get(entry, 'hadRecentInput')) total += Number(Reflect.get(entry, 'value'));
          }).observe({ type: 'layout-shift', buffered: true });
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
          setTimeout(() => resolve(total), 1000);
        })
    );
    expect(cls).toBeLessThan(0.1);
  });
});
