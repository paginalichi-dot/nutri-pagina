import { expect, test } from '@playwright/test';
import { bookSlot, chooseSlot, projectOffset } from './pages/booking';
import { signIn } from './pages/panel';
import { activePatient, card, newEmail, openLink, PASSWORD, registerPatient, signInAs } from './pages/patient';
import { emailsSentTo } from './support/outbox';

test.describe('reserva online (Sprint 4 y US-40)', () => {
  test('US-21, US-22, US-39 y US-40: sin sesión pasa por el login, reserva presencial, Lisandro la confirma y el paciente la ve confirmada', async ({ page }, testInfo) => {
    const email = newEmail();
    const name = `Paciente ${testInfo.project.name} ${Date.now()}`;
    await registerPatient(page, email, name);
    await openLink(page, { email, path: '/verificar', button: 'Activar mi cuenta' });
    await page.goto('/reservar');
    await expect(page).toHaveURL(/\/login\?volver=%2Freservar$/);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Contraseña', { exact: true }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('link', { name: 'Elegir presencial' })).toBeVisible();

    await bookSlot(page, { modality: 'presencial', dayIndex: 0, timeFromEnd: projectOffset(testInfo.project.name) });
    await expect(page.getByRole('list', { name: 'Pasos de la reserva' }).getByRole('listitem').last().locator('svg')).toBeVisible();
    await expect.poll(() => emailsSentTo(email)).toBe(2);
    await page.getByRole('link', { name: 'Ver mis turnos' }).click();
    await expect(card(page, 'Tus próximos turnos').getByText('Pendiente')).toBeVisible();

    await page.context().clearCookies();
    await signIn(page);
    await page.getByRole('link', { name: 'Ver solicitudes' }).click();
    const request = page.locator('section', { has: page.getByRole('heading', { name }) });
    await request.getByRole('button', { name: 'Confirmar' }).click();
    await expect(request).toHaveCount(0);

    await page.context().clearCookies();
    await signInAs(page, email);
    await expect(card(page, 'Tus próximos turnos').getByText('Confirmado')).toBeVisible();
  });

  test('US-21 CA-4, US-24, US-25 y US-40: virtual en 3 pasos, el tope, reprogramar con el mismo flujo y cancelar', async ({ page }, testInfo) => {
    const offset = projectOffset(testInfo.project.name);
    await activePatient(page);
    await bookSlot(page, { modality: 'presencial', dayIndex: 1, timeFromEnd: offset });
    await page.goto('/reservar');
    await page.getByRole('link', { name: /Elegir virtual/ }).click();
    await expect(page.getByRole('list', { name: 'Pasos de la reserva' }).getByRole('listitem')).toHaveCount(3);
    await expect(page.getByLabel('Tu turno')).toContainText('Por videollamada');
    await bookSlot(page, { modality: 'virtual', dayIndex: 0, timeFromEnd: offset });
    await page.goto('/reservar');
    await expect(page.getByText('Ya tenés dos turnos por venir.')).toBeVisible();

    await page.getByRole('link', { name: 'Ir a Mi espacio' }).click();
    await card(page, 'Tus próximos turnos').getByRole('link', { name: /Consultorio de ejemplo/ }).click();
    await page.getByRole('link', { name: 'Reprogramar' }).click();
    await chooseSlot(page, { modality: 'virtual', dayIndex: 1, timeFromEnd: offset });
    await page.getByRole('button', { name: 'Pedir el cambio' }).click();
    await expect(page.getByRole('heading', { name: '¡Pedido enviado!' })).toBeVisible();

    await page.getByRole('link', { name: 'Ver mis turnos' }).click();
    await card(page, 'Tus próximos turnos').getByRole('link', { name: /Por videollamada/ }).last().click();
    page.once('dialog', (dialog) => void dialog.accept());
    await page.getByRole('button', { name: 'Cancelar turno' }).click();
    await expect(page.getByRole('status')).toHaveText('Cancelaste tu turno. Le avisamos a Lisandro.');
    await page.goto('/reservar');
    await expect(page.getByRole('link', { name: 'Elegir presencial' })).toBeVisible();
  });

  test('US-40 CA-3: con teclado; «Continuar» no avanza sin elegir y «Atrás» vuelve con lo elegido marcado', async ({ page }) => {
    await activePatient(page);
    await page.goto('/reservar');
    await page.getByRole('link', { name: /Elegir presencial/ }).focus();
    await page.keyboard.press('Enter');
    const where = page.getByRole('heading', { name: '¿Dónde querés atenderte?' });
    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(where).toBeVisible();
    await page.getByRole('radio', { name: /Consultorio de ejemplo/ }).focus();
    await page.keyboard.press('Space');
    await page.getByRole('button', { name: 'Continuar' }).press('Enter');
    await expect(page.getByRole('heading', { name: '¿Qué día te queda bien?' })).toBeVisible();
    await page.getByRole('link', { name: 'Atrás' }).click();
    await expect(page.getByRole('radio', { name: /Consultorio de ejemplo/ })).toBeChecked();
  });
});
