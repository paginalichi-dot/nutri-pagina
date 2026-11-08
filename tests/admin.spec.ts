import { expect, test } from '@playwright/test';
import { TEST_ADMIN } from '../src/features/auth/testing/test-admin';
import { signIn, signOut } from './pages/panel';

test.describe('panel del admin', () => {
  for (const path of ['/admin', '/admin/cuenta', '/admin/ubicaciones', '/admin/ajustes', '/admin/bloqueos', '/admin/turnos/nuevo']) {
    test(`${path} sin sesión muestra "Acceso denegado" sin cambiar la URL ni dejarse indexar`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acceso denegado');
      await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      expect(new URL(page.url()).pathname).toBe(path);
    });
  }

  test('con una contraseña incorrecta muestra el error y no entra', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(TEST_ADMIN.email);
    await page.getByLabel('Contraseña').fill('no-es-la-clave');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('main').getByRole('alert')).toHaveText('El email o la contraseña no son correctos.');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('con la cuenta de prueba entra a la agenda, y "Cerrar sesión" vuelve al login', async ({ page }) => {
    await signIn(page);
    await expect(page).toHaveURL(/\/admin$/);
    await signOut(page);
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto('/admin');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acceso denegado');
  });

  test('con sesión, /admin/login lleva directo a la agenda', async ({ page }) => {
    await signIn(page);
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agenda');
  });

  test('T-4: el menú marca la sección actual y lleva a cada una', async ({ page }) => {
    await signIn(page);
    const menu = page.getByRole('navigation', { name: 'Panel' });
    await expect(menu.getByRole('link', { name: 'Agenda' })).toHaveAttribute('aria-current', 'page');
    for (const [label, heading] of [['Ubicaciones', 'Tus ubicaciones'], ['Ajustes', 'Ajustes de la agenda'], ['Mi cuenta', 'Mi cuenta']]) {
      await menu.getByRole('link', { name: label }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(menu.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
    }
  });
});
