import { expect, type Page, test } from '@playwright/test';

const translate = (page: Page, selector: string, axis: 'x' | 'y'): Promise<number> =>
  page.evaluate(
    ([target, which]) => {
      const element = document.querySelector(target ?? '');
      const matrix = new DOMMatrixReadOnly(element ? getComputedStyle(element).transform : 'none');
      return which === 'x' ? matrix.m41 : matrix.m42;
    },
    [selector, axis]
  );

async function seesOffset(page: Page, selector: string, check: (value: number) => boolean): Promise<void> {
  const axis = selector.includes('phrase') ? 'x' : 'y';
  await expect.poll(async () => check(await translate(page, selector, axis)), { intervals: [16], timeout: 3000 }).toBe(true);
}

test.describe('movimiento de la home', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('al cargar, cada parte entra desde su lado y termina en su lugar en menos de 1.8 s', async ({ page }) => {
    await page.goto('/');
    await Promise.all([
      seesOffset(page, '[data-hero-phrase]:nth-of-type(1)', (x) => x > 10),
      seesOffset(page, '[data-hero-phrase]:last-of-type', (x) => x < -10),
      seesOffset(page, '[data-hero-name] > span > div', (y) => y < -5),
      seesOffset(page, '[data-hero-photo]', (y) => y > 10),
    ]);
    await page.waitForTimeout(1800);
    expect(await translate(page, '[data-hero-photo]', 'y')).toBeCloseTo(0, 0);
    expect(await translate(page, '[data-hero-phrase]:last-of-type', 'x')).toBeCloseTo(0, 0);
    expect(await page.evaluate(() => document.documentElement.className)).not.toContain('motion-pending');
  });

  test('el scroll tiene inercia y la escena del hero se mueve con él', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1800);
    await expect(page.locator('html')).toHaveClass(/lenis/);
    await page.mouse.wheel(0, 500);
    await expect.poll(() => page.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-hero-photo] img') ?? document.body).transform).a)).toBeGreaterThan(1);
  });

  test('el trazo de "Sobre mí" se dibuja con el scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1800);
    const stroke = page.locator('#sobre-mi [data-draw]').first();
    await expect(stroke).toHaveAttribute('style', /stroke-dash/);
  });

  test('con "reducir movimiento" no hay inercia ni intro: todo quieto y visible', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/lenis|motion-pending/);
    expect(await translate(page, '[data-hero-photo]', 'y')).toBe(0);
    await expect(page.locator('[data-hero-name]')).toHaveCSS('opacity', '1');
    await context.close();
  });

  test('sin JavaScript todo el contenido queda visible', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('[data-hero-name]')).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-hero-phrase]').first()).toBeVisible();
    await context.close();
  });

  test('la home no se mueve sola mientras carga y se baja: CLS por debajo de 0.1', async ({ page }) => {
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
