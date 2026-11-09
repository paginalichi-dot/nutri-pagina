import { expect, test } from '@playwright/test';
import { TEST_PATIENT } from '../src/features/patient/testing/test-patient';
import { newEmail, registerPatient, signInAs } from './pages/patient';
import { linkSentTo } from './support/outbox';

test.describe('acceso de pacientes (Sprint 3)', () => {
  test('US-28 CA-3: abrir el link de activación sin apretar el botón no activa la cuenta', async ({ page }) => {
    const email = newEmail();
    await registerPatient(page, email);
    await page.goto(await linkSentTo(email, '/verificar'));
    await expect(page.getByRole('button', { name: 'Activar mi cuenta' })).toBeVisible();
    await signInAs(page, email);
    await expect(page.getByText('Activá tu cuenta con el link que te mandamos.')).toBeVisible();
  });

  test('US-29 CA-1: con sesión iniciada, ir a /login lleva a Mi espacio', async ({ page }) => {
    await signInAs(page, TEST_PATIENT.email, TEST_PATIENT.password);
    await expect(page).toHaveURL(/\/mi-espacio$/);
    await page.goto('/login');
    await expect(page).toHaveURL(/\/mi-espacio$/);
  });
});
