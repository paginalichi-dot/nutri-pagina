import { expect, type Locator, test } from '@playwright/test';

async function isOnTop(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return hit !== null && element.contains(hit);
  });
}

test.describe('home', () => {
  test('carga con su título y el hero de Lisandro', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle('Lisandro López · Nutrición');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lisandro López');
    const photo = page.getByRole('img', { name: /^Lisandro López, licenciado en nutrición/ });
    await expect(photo).toBeVisible();
    expect(await photo.evaluate((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  });

  test('la cabeza de Lisandro tapa la base del nombre, y el nombre se sigue leyendo', async ({ page }) => {
    await page.goto('/');
    const [name, photo] = await Promise.all([page.locator('[data-hero-name]').boundingBox(), page.locator('[data-hero-photo]').boundingBox()]);
    const nameBottom = (name?.y ?? 0) + (name?.height ?? 0);
    const covered = nameBottom - (photo?.y ?? 0);
    expect(covered).toBeGreaterThan((name?.height ?? 0) * 0.15);
    expect(photo?.y ?? 0).toBeGreaterThan(name?.y ?? 0);
  });

  for (const phrase of ['La alimentación nos atraviesa durante toda nuestra vida', 'Y aprender a transformarla en un buen hábito es la base de tu salud']) {
    test(`"${phrase.slice(0, 24)}…" se lee completa y nada la tapa`, async ({ page }) => {
      await page.goto('/');
      const paragraph = page.locator('p', { hasText: phrase.split(' ').slice(0, 3).join(' ') }).first();
      await paragraph.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      await expect(paragraph).toBeVisible();
      expect((await paragraph.textContent())?.replace(/\s+/g, ' ').trim()).toBe(phrase);
      expect(await isOnTop(paragraph)).toBe(true);
    });
  }

  test('"Sobre mí" se ve al bajar, con líneas de menos de 75 caracteres y sin scroll horizontal', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#sobre-mi');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('Sobre mí');
    const longest = section.locator('p', { hasText: 'Entiendo la nutrición' });
    await expect(longest).toBeVisible();
    const fitsSeventyFive = await longest.evaluate((paragraph) => {
      const probe = document.createElement('span');
      Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', font: getComputedStyle(paragraph).font });
      probe.textContent = (paragraph.textContent ?? '').slice(0, 75);
      document.body.append(probe);
      const fits = probe.getBoundingClientRect().width <= paragraph.clientWidth;
      probe.remove();
      return fits;
    });
    expect(fitsSeventyFive).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('US-19: "Dónde atiendo" muestra las ubicaciones activas con sus horarios y las obras sociales', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#sucursales');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('Dónde atiendo');
    await expect(section.getByRole('heading', { name: 'Consultorio de ejemplo' })).toBeVisible();
    await expect(section.getByRole('heading', { name: 'Online de ejemplo' })).toBeVisible();
    await expect(section.getByRole('table', { name: 'Días y horarios de Consultorio de ejemplo' })).toContainText('09:00 a 13:00');
    await expect(section.getByText('Particular', { exact: true })).toBeVisible();
    await expect(section.getByText('meet.example.test')).toHaveCount(0);
  });

  test('una flecha junto a la frase avisa que se puede bajar, sin tapar el botón de reserva', async ({ page }) => {
    await page.goto('/');
    const hints = page.locator('[data-scroll-hint]:visible');
    await expect(hints).toHaveCount(2);
    await expect(page.locator('[data-hero-frame] [data-scroll-hint]:visible')).toHaveCount(1);
    await expect(page.locator('#sobre-mi [data-scroll-hint]')).toHaveCount(1);
    await expect(page.locator('#sucursales [data-scroll-hint]')).toHaveCount(0);
    const [hint, button] = await Promise.all([hints.first().boundingBox(), page.getByRole('link', { name: 'Reservá tu turno' }).boundingBox()]);
    const apart = !hint || !button || hint.x >= button.x + button.width || hint.x + hint.width <= button.x || hint.y >= button.y + button.height || hint.y + hint.height <= button.y;
    expect(apart).toBe(true);
  });

  test('en una notebook baja (1280×600) no hay scroll horizontal y el hero y «Sobre mí» entran en la pantalla', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Es un tamaño de notebook: sólo desktop');
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const fits = await page.locator('[data-hero-frame]').evaluate((frame) => {
      const box = frame.getBoundingClientRect();
      return box.bottom <= innerHeight && [...frame.querySelectorAll('p')].every((phrase) => phrase.getBoundingClientRect().right <= box.right);
    });
    expect(fits).toBe(true);
    expect(await page.locator('#sobre-mi').evaluate((section) => section.getBoundingClientRect().height <= innerHeight)).toBe(true);
  });
});
