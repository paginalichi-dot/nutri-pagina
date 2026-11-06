import { expect, type Page, test } from '@playwright/test';
import { E2E_ACCOUNT_ADMIN } from '../src/features/auth/testing/test-admin';

const NEW_EMAIL = `cuenta-e2e-${Date.now()}@ejemplo.test`;
const NEW_PASSWORD = 'clave-e2e-nueva-5678';

async function signIn(page: Page, credentials: { email: string; password: string }): Promise<void> {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Contraseña').fill(credentials.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel');
}

async function submit(page: Page, form: string, fields: Record<string, string>): Promise<void> {
  const section = page.getByRole('form', { name: form });
  for (const [label, value] of Object.entries(fields)) await section.getByLabel(label, { exact: true }).fill(value);
  await section.getByRole('button', { name: /^Guardar/ }).click();
}

test.describe('Mi cuenta', () => {
  test('el admin cambia su contraseña y su email, y vuelve a entrar con los datos nuevos', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Cambia una cuenta compartida: corre en un solo proyecto');
    await signIn(page, E2E_ACCOUNT_ADMIN);
    await page.getByRole('link', { name: 'Mi cuenta' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mi cuenta');

    await submit(page, 'Cambiar la contraseña', { 'Contraseña actual': 'mala', 'Contraseña nueva': NEW_PASSWORD, 'Repetí la contraseña nueva': NEW_PASSWORD });
    await expect(page.getByRole('form', { name: 'Cambiar la contraseña' }).getByRole('alert')).toHaveText('La contraseña actual no es correcta.');

    await submit(page, 'Cambiar la contraseña', { 'Contraseña actual': E2E_ACCOUNT_ADMIN.password, 'Contraseña nueva': NEW_PASSWORD, 'Repetí la contraseña nueva': NEW_PASSWORD });
    await expect(page.getByRole('form', { name: 'Cambiar la contraseña' }).getByRole('status')).toHaveText('Listo. Desde ahora entrás con la contraseña nueva.');

    await submit(page, 'Cambiar el email', { 'Email nuevo': NEW_EMAIL, 'Contraseña actual': NEW_PASSWORD });
    await expect(page.getByRole('form', { name: 'Cambiar el email' }).getByRole('status')).toHaveText(`Listo. Desde ahora entrás con ${NEW_EMAIL}.`);

    await page.getByRole('link', { name: 'Volver al panel' }).click();
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ingresá al panel');
    await signIn(page, { email: NEW_EMAIL, password: NEW_PASSWORD });
  });
});
