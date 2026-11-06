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
    await expect(page.getByText('Lisandro López · Licenciado en Nutrición')).toBeVisible();
  });

  for (const phrase of ['La alimentación nos atraviesa durante toda nuestra vida', 'Y aprender a transformarla en un buen hábito es la base de tu salud']) {
    test(`"${phrase.slice(0, 24)}…" se lee completa y nada la tapa`, async ({ page }) => {
      await page.goto('/');
      const paragraph = page.locator('p', { hasText: phrase.split(' ').slice(0, 3).join(' ') }).first();
      await paragraph.scrollIntoViewIfNeeded();
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
      probe.style.whiteSpace = 'nowrap';
      probe.textContent = (paragraph.textContent ?? '').slice(0, 75);
      paragraph.append(probe);
      const fits = probe.getBoundingClientRect().width <= paragraph.clientWidth;
      probe.remove();
      return fits;
    });
    expect(fitsSeventyFive).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
