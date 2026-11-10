import { expect, test } from '@playwright/test';
import { TEST_PATIENT } from '../src/features/patient/testing/test-patient';
import { activePatient, card, newEmail, openAccountMenu, openLink, openTab, PASSWORD, registerPatient, signInAs } from './pages/patient';
import { freshClient } from './pages/panel';
import { emailsSentTo, linkSentTo } from './support/outbox';

test.describe('cuentas de pacientes (Sprint 3)', () => {
  test('US-28 y US-29: se registra, no entra sin activar, activa con el link y llega a Mi espacio', async ({ page }) => {
    const email = newEmail();
    await registerPatient(page, email);
    await signInAs(page, email);
    await expect(page.getByText('Activá tu cuenta con el link que te mandamos.')).toBeVisible();
    await page.getByRole('button', { name: 'Reenviar el email' }).click();
    await expect(page.getByText('te mandamos un email nuevo')).toBeVisible();
    await expect.poll(() => emailsSentTo(email)).toBe(2);
    await openLink(page, { email, path: '/verificar', button: 'Activar mi cuenta' });
    await signInAs(page, email);
    await expect(page).toHaveURL(/\/mi-espacio$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hola, Paciente');
  });

  test('US-31 y T-8: el paciente sembrado ve sus turnos y no entra al panel', async ({ page }) => {
    await signInAs(page, TEST_PATIENT.email, TEST_PATIENT.password);
    await expect(page).toHaveURL(/\/mi-espacio$/);
    await expect(card(page, 'Tus próximos turnos').getByText('Consultorio de ejemplo').first()).toBeVisible();
    await page.getByRole('link', { name: /Ver todos/ }).click();
    await expect(page).toHaveURL(/\/mi-espacio\/turnos$/);
    await expect(card(page, 'Tus turnos anteriores').getByText('Asistió')).toBeVisible();
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Acceso/ })).toBeVisible();
  });

  test('US-30: restablece la contraseña con el link y la vieja deja de servir', async ({ page }) => {
    const email = await activePatient(page);
    await page.context().clearCookies();
    await freshClient(page);
    await page.goto('/recuperar');
    await page.getByLabel('Email').fill(email);
    await page.getByRole('button', { name: 'Mandarme el link' }).click();
    await expect(page.getByText('Si el email tiene una cuenta')).toBeVisible();
    await page.goto(await linkSentTo(email, '/restablecer'));
    await page.getByLabel('Contraseña nueva').fill('clave-nueva-e2e');
    await page.getByRole('button', { name: 'Guardar la contraseña' }).click();
    await expect(page.getByText('Ya podés entrar con tu contraseña nueva.')).toBeVisible();
    await signInAs(page, email);
    await expect(page.getByText('El email o la contraseña no son correctos.')).toBeVisible();
    await signInAs(page, email, 'clave-nueva-e2e');
    await expect(page).toHaveURL(/\/mi-espacio$/);
  });

  test('US-33: cambia el email con el link que llega al email nuevo', async ({ page }) => {
    await activePatient(page);
    const next = newEmail();
    const form = await openTab(page, 'Tu email');
    await form.getByLabel('Email nuevo').fill(next);
    await form.getByLabel('Contraseña actual').fill(PASSWORD);
    await form.getByRole('button', { name: 'Cambiar el email' }).click();
    await expect(form.getByText(`Te mandamos un link a ${next}`)).toBeVisible();
    await openLink(page, { email: next, path: '/confirmar-email', button: 'Confirmar mi email' });
    await signInAs(page, next);
    await expect(page).toHaveURL(/\/mi-espacio$/);
  });

  test('US-32: elimina la cuenta y ya no puede entrar', async ({ page }) => {
    const email = await activePatient(page);
    const form = await openTab(page, 'Eliminar mi cuenta');
    await form.getByLabel('Contraseña actual').fill(PASSWORD);
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Eliminar mi cuenta' }).click();
    await expect(page).toHaveURL(/\/$/);
    await signInAs(page, email);
    await expect(page.getByText('El email o la contraseña no son correctos.')).toBeVisible();
  });

  test('US-35: el ícono del hero lleva al login sin sesión y saluda con sesión', async ({ page }) => {
    await page.goto('/');
    const menu = await openAccountMenu(page);
    await expect(menu.getByRole('link', { name: 'Registrate' })).toHaveAttribute('href', '/registro');
    await menu.getByRole('link', { name: /Iniciar sesión/ }).click();
    await expect(page).toHaveURL(/\/login$/);
    await signInAs(page, TEST_PATIENT.email, TEST_PATIENT.password);
    await expect(page).toHaveURL(/\/mi-espacio$/);
    await page.goto('/');
    const signedIn = await openAccountMenu(page);
    await expect(signedIn.getByText('Hola, Paciente')).toBeVisible();
    await expect(signedIn.getByRole('link', { name: 'Ir a mi espacio' })).toHaveAttribute('href', '/mi-espacio');
  });
});
