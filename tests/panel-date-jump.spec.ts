import { expect, test } from '@playwright/test';
import { signIn } from './pages/panel';

test.describe('panel: ir a una fecha (US-45)', () => {
  test('CA-1: en Día va a ese día y en Semana a la semana que lo contiene', async ({ page }) => {
    await signIn(page);
    const title = page.getByRole('heading', { level: 2 }).filter({ hasText: /de 20\d\d/ }).first();
    await page.getByLabel('Ir a una fecha').fill('2026-12-24');
    await expect(page).toHaveURL(/dia=2026-12-24&vista=dia/);
    await expect(title).toHaveText('Jueves, 24 de diciembre de 2026');

    await page.getByRole('link', { name: 'Semana' }).click();
    await expect(page).toHaveURL(/vista=semana/);
    await page.getByLabel('Ir a una fecha').fill('2027-01-07');
    await expect(page).toHaveURL(/dia=2027-01-07&vista=semana/);
    await expect(title).toHaveText('Semana del 4 de enero de 2027');
  });
});
