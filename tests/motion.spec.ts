import { expect, test } from '@playwright/test';

test.describe('movimiento de la home', () => {
  test('la home no se mueve sola mientras carga y se baja: CLS por debajo de 0.1', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
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
