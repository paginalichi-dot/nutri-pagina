import { expect, type Page, test } from '@playwright/test';

async function motionState(page: Page): Promise<{ scroll: string; animation: string }> {
  return page.evaluate(() => {
    const reveal = document.querySelector('[data-reveal]');
    return {
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      animation: reveal ? getComputedStyle(reveal).animationName : 'falta [data-reveal]',
    };
  });
}

test.describe('scroll suave y aparición de secciones', () => {
  test('sin preferencia de movimiento: scroll suave y "Sobre mí" aparece al bajar', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    expect(await motionState(page)).toEqual({ scroll: 'smooth', animation: 'reveal' });
  });

  test('con "reducir movimiento": ni scroll animado ni aparición', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await motionState(page)).toEqual({ scroll: 'auto', animation: 'none' });
  });

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

  test('sin JavaScript, al bajar el texto de "Sobre mí" queda completamente visible', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('#sobre-mi').evaluate((section) => section.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await expect(page.locator('[data-reveal]')).toHaveCSS('opacity', '1');
    await context.close();
  });
});
