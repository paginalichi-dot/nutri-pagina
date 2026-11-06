import { expect, type Page, test } from '@playwright/test';
import { TEST_ADMIN } from '../src/features/auth/testing/test-admin';

async function signIn(page: Page, password: string): Promise<void> {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(TEST_ADMIN.email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

test.describe('panel del admin', () => {
  for (const path of ['/admin', '/admin/cuenta']) {
    test(`${path} sin sesión muestra "Acceso denegado" sin cambiar la URL ni dejarse indexar`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acceso denegado');
      await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      expect(new URL(page.url()).pathname).toBe(path);
    });
  }

  test('con una contraseña incorrecta muestra el error y no entra', async ({ page }) => {
    await signIn(page, 'no-es-la-clave');
    await expect(page.getByRole('main').getByRole('alert')).toHaveText('El email o la contraseña no son correctos.');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('con la cuenta de prueba entra al panel, y "Cerrar sesión" vuelve al login', async ({ page }) => {
    await signIn(page, TEST_ADMIN.password);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel');
    await expect(page).toHaveURL(/\/admin$/);
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ingresá al panel');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto('/admin');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acceso denegado');
  });

  test('con sesión, /admin/login lleva directo al panel', async ({ page }) => {
    await signIn(page, TEST_ADMIN.password);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel');
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel');
  });
});
