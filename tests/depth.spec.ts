import { expect, type Page, test } from '@playwright/test';
import { introDone } from './support/motion';

const owns = (page: Page, selector: string): Promise<boolean> =>
  page.evaluate((target) => [8, innerHeight - 8].every((y) => Boolean(document.elementFromPoint(innerWidth / 4, y)?.closest(target))), selector);

const scrollTo = (page: Page, id: string, offset: number): Promise<void> =>
  page.evaluate(
    ({ target, screens }) => window.scrollTo({ top: (document.getElementById(target)?.getBoundingClientRect().top ?? 0) + window.scrollY + screens * innerHeight, behavior: 'instant' }),
    { target: id, screens: offset }
  );

const opacityOf = (page: Page, selector: string): Promise<string> => page.locator(selector).evaluate((element) => getComputedStyle(element).opacity);

test.describe('profundidad entre secciones', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('cada sección tiene su pantalla: "Sobre mí" no se mezcla con el hero y "Dónde atiendo" lo tapa', async ({ page }) => {
    await page.setViewportSize({ width: 1728, height: 1080 });
    await page.goto('/');
    await introDone(page);
    await scrollTo(page, 'sobre-mi', 0);
    await expect.poll(() => owns(page, '#sobre-mi')).toBe(true);
    await expect.poll(() => opacityOf(page, '#sobre-mi')).toBe('1');
    await scrollTo(page, 'sucursales', -0.5);
    const heroShown = (): Promise<string> => page.locator('[data-hero-frame]').evaluate((frame) => getComputedStyle(frame).visibility);
    await expect.poll(heroShown).toBe('hidden');
    await scrollTo(page, 'sucursales', 0);
    await expect.poll(() => owns(page, '#sucursales')).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(heroShown).toBe('visible');
  });

  test('"Sobre mí" queda quieto una pantalla y cuarto antes de que suba "Dónde atiendo"', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'En el celular "Sobre mí" no entra en la pantalla: scrollea normal, sin pausa');
    await page.goto('/');
    await introDone(page);
    const bottom = await page.evaluate(() => (document.getElementById('sobre-mi')?.getBoundingClientRect().bottom ?? 0) + window.scrollY);
    await page.evaluate((top) => window.scrollTo({ top: top - innerHeight + innerHeight * 1.1, behavior: 'instant' }), bottom);
    await expect.poll(() => owns(page, '#sobre-mi')).toBe(true);
    await expect.poll(() => opacityOf(page, '#sobre-mi')).toBe('1');
    expect(await page.evaluate(() => (document.getElementById('sucursales')?.getBoundingClientRect().top ?? 0) >= innerHeight)).toBe(true);
    await page.evaluate((top) => window.scrollTo({ top: top - innerHeight + innerHeight * 1.75, behavior: 'instant' }), bottom);
    await expect.poll(() => page.evaluate(() => (document.getElementById('sucursales')?.getBoundingClientRect().top ?? 0) < innerHeight)).toBe(true);
    await expect.poll(async () => Number(await opacityOf(page, '#sobre-mi'))).toBeLessThan(1);
  });
});
