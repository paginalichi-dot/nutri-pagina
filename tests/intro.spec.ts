import { expect, test } from '@playwright/test';
import { clipOfMain, introDone, sees, transformOf } from './support/motion';

const PRELOADER = '[data-preloader]';

test.describe('intro de marca', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('al cargar, la caja muestra «Lic. Lisandro López» y después se expande hasta dejar la home libre', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator(PRELOADER)).toBeVisible();
    await expect(page.locator(PRELOADER)).toHaveText(/Lic\.\s+Lisandro López/);
    expect(await clipOfMain(page)).toContain('inset(');
    await introDone(page);
    await expect(page.locator(PRELOADER)).toBeHidden();
    expect(await clipOfMain(page)).toBe('none');
  });

  test('el hero entra desde su lado: frases desde los bordes, nombre desde arriba y foto desde el centro', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await Promise.all([
      sees(page, '[data-hero-phrase]:nth-of-type(1)', ({ x }) => x < -10),
      sees(page, '[data-hero-phrase]:last-of-type', ({ x }) => x > 10),
      sees(page, '[data-hero-name] > span > div', ({ y }) => y < -5),
      sees(page, '[data-hero-photo]', ({ scale }) => scale < 1),
    ]);
    await introDone(page);
    await sees(page, '[data-hero-photo]', ({ scale }) => scale === 1);
    await sees(page, '[data-hero-phrase]:last-of-type', ({ x }) => x === 0);
    expect((await transformOf(page, '[data-hero-phrase]:nth-of-type(1)')).x).toBe(0);
  });

  test('US-40 CA-7: al volver a la home navegando, la intro se repite y después deja la home libre', async ({ page }) => {
    await page.goto('/acceso-denegado');
    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.locator(PRELOADER)).toBeVisible();
    await introDone(page);
    await expect(page.locator(PRELOADER)).toBeHidden();
    await expect(page.locator('[data-hero-name]')).toHaveCSS('opacity', '1');
    expect(await clipOfMain(page)).toBe('none');
  });

  test('US-40 CA-7: entrando a un ancla de la home no hay intro', async ({ page }) => {
    await page.goto('/#sobre-mi');
    await expect(page.locator(PRELOADER)).toBeHidden();
    expect(await clipOfMain(page)).toBe('none');
  });

  test('con "reducir movimiento" no hay preloader ni máscara', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator(PRELOADER)).toBeHidden();
    expect(await clipOfMain(page)).toBe('none');
    await context.close();
  });

  test('sin JavaScript no hay preloader y la home se ve entera', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator(PRELOADER)).toBeHidden();
    await expect(page.locator('[data-hero-name]')).toHaveCSS('opacity', '1');
    expect(await clipOfMain(page)).toBe('none');
    await context.close();
  });
});
